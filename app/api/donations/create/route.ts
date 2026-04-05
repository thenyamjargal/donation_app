import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { dbConnect } from "@/lib/mongoose";
import { Donation } from "@/lib/models/Donation";
import { createQPayInvoice } from "@/lib/qpay";

const APP_URL = process.env.APP_URL;
const QPAY_CALLBACK_SECRET = process.env.QPAY_CALLBACK_SECRET;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, creatorSlug, supporterName, message, isAnonymous } = body;

    // Validate required fields
    if (!amount || !creatorSlug) {
      return NextResponse.json(
        { error: "amount and creatorSlug are required" },
        { status: 400 }
      );
    }

    // Validate amount bounds
    if (typeof amount !== "number" || amount < 1000 || amount > 10_000_000) {
      return NextResponse.json(
        { error: "Amount must be between 1,000 and 10,000,000" },
        { status: 400 }
      );
    }

    // Validate creatorSlug format and existence
    if (typeof creatorSlug !== "string" || !/^[a-z0-9_-]{1,50}$/.test(creatorSlug)) {
      return NextResponse.json(
        { error: "Invalid creator slug format" },
        { status: 400 }
      );
    }

    // Validate optional string fields
    if (supporterName !== undefined && (typeof supporterName !== "string" || supporterName.length > 100)) {
      return NextResponse.json(
        { error: "Supporter name must be 100 characters or less" },
        { status: 400 }
      );
    }

    if (message !== undefined && (typeof message !== "string" || message.length > 500)) {
      return NextResponse.json(
        { error: "Message must be 500 characters or less" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Use APP_URL env var instead of trusting request headers
    if (!APP_URL) {
      console.error("APP_URL environment variable is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }
    let callbackUrl = `${APP_URL}/api/qpay/callback`;
    if (QPAY_CALLBACK_SECRET) {
      callbackUrl += `?secret=${QPAY_CALLBACK_SECRET}`;
    }

    const invoiceDesc = `Donation to ${creatorSlug} - ${amount}₮`;
    const senderInvoiceNo = `DON-${Date.now()}`;

    // Create QPay invoice
    const qpayInvoice = await createQPayInvoice({
      sender_invoice_no: senderInvoiceNo,
      invoice_description: invoiceDesc,
      amount,
      callback_url: callbackUrl,
    });

    // Generate a status token for secure polling
    const statusToken = randomBytes(32).toString("hex");

    // Create donation record
    const donation = await Donation.create({
      amount,
      creatorSlug,
      supporterName: isAnonymous ? undefined : supporterName,
      message: message ? message.slice(0, 500) : undefined,
      isAnonymous: isAnonymous || false,
      status: "pending",
      invoice_id: qpayInvoice.invoice_id,
      invoice_desc: invoiceDesc,
      qr_image: qpayInvoice.qr_image,
      qr_text: qpayInvoice.qr_text,
      urls: qpayInvoice.urls,
      statusToken,
    });

    return NextResponse.json({
      donationId: donation._id,
      statusToken,
      qpayInvoiceId: qpayInvoice.invoice_id,
      qrImage: qpayInvoice.qr_image,
      qrText: qpayInvoice.qr_text,
      deepLinks: qpayInvoice.urls,
    });
  } catch (error: unknown) {
    console.error("Donation create error:", error);
    return NextResponse.json(
      { error: "Failed to create donation" },
      { status: 500 }
    );
  }
}
