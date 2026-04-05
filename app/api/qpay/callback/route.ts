import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import { Donation } from "@/lib/models/Donation";
import { checkQPayPayment } from "@/lib/qpay";
import { sendPaymentNotification } from "@/lib/telegram";

const QPAY_CALLBACK_SECRET = process.env.QPAY_CALLBACK_SECRET;

export async function POST(req: NextRequest) {
  try {
    // Verify callback authenticity via shared secret if configured
    if (QPAY_CALLBACK_SECRET) {
      const authHeader = req.headers.get("authorization");
      const url = new URL(req.url);
      const secretParam = url.searchParams.get("secret");
      const providedSecret = authHeader?.replace("Bearer ", "") || secretParam;
      
      if (providedSecret !== QPAY_CALLBACK_SECRET) {
        return NextResponse.json({ message: "OK" }, { status: 200 });
      }
    }

    await dbConnect();

    const body = await req.json();
    const invoiceId = body.invoice_id;

    if (!invoiceId || typeof invoiceId !== "string") {
      return NextResponse.json({ message: "OK" }, { status: 200 });
    }

    const donation = await Donation.findOne({ invoice_id: invoiceId });
    if (!donation) {
      return NextResponse.json({ message: "OK" }, { status: 200 });
    }

    // Already processed
    if (donation.status !== "pending") {
      return NextResponse.json({ message: "OK" }, { status: 200 });
    }

    // Verify with QPay - only mark as paid, never as failed from callback
    const checkResult = await checkQPayPayment(invoiceId);

    if (checkResult.count >= 1) {
      donation.status = "paid";
      donation.telegramNotified = true;
      await donation.save();

      // Non-blocking: runs after response is sent, failure doesn't affect payment
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
    // If not paid yet, leave as pending — don't mark failed from callback

    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    console.error("QPay callback error:", error);
    // Always return 200 to QPay to prevent retries
    return NextResponse.json({ message: "OK" }, { status: 200 });
  }
}
