import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/mongoose";
import { Donation } from "@/lib/models/Donation";
import { checkQPayPayment } from "@/lib/qpay";
import { sendPaymentNotification } from "@/lib/telegram";

export async function GET(req: NextRequest) {
  try {
    const donationId = req.nextUrl.searchParams.get("donationId");
    const statusToken = req.nextUrl.searchParams.get("statusToken");

    if (!donationId || !statusToken) {
      return NextResponse.json(
        { error: "donationId and statusToken are required" },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(donationId)) {
      return NextResponse.json(
        { error: "Invalid donation ID" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Require matching statusToken to prevent IDOR
    const donation = await Donation.findOne({
      _id: donationId,
      statusToken,
    });
    if (!donation) {
      return NextResponse.json(
        { error: "Donation not found" },
        { status: 404 }
      );
    }

    // If still pending, actively check QPay
    if (donation.status === "pending") {
      try {
        const checkResult = await checkQPayPayment(donation.invoice_id);
        if (checkResult.count >= 1) {
          const shouldNotify = !donation.telegramNotified;
          donation.status = "paid";
          donation.telegramNotified = true;
          await donation.save();

          // Fallback: notify if the QPay webhook didn't already send the notification
          if (shouldNotify) {
            sendPaymentNotification({
              amount: donation.amount,
              creatorSlug: donation.creatorSlug,
              supporterName: donation.supporterName,
              isAnonymous: donation.isAnonymous,
              message: donation.message,
              invoiceId: donation.invoice_id,
              paidAt: new Date(),
            });
          }
        }
      } catch {
        // Ignore check errors during polling, status stays pending
      }
    }

    return NextResponse.json({
      status: donation.status,
      amount: donation.amount,
      createdAt: donation.createdAt,
    });
  } catch (error: unknown) {
    console.error("Donation status error:", error);
    return NextResponse.json(
      { error: "Failed to check status" },
      { status: 500 }
    );
  }
}
