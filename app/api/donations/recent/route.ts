import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import { Donation } from "@/lib/models/Donation";

export async function GET() {
  try {
    await dbConnect();

    const donations = await Donation.find({ status: "paid" })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("supporterName message amount isAnonymous createdAt")
      .lean();

    const supporters = donations.map((d) => ({
      name: d.isAnonymous || !d.supporterName ? "Нэргүй" : d.supporterName,
      message: d.message || "",
      amount: d.amount,
      isAnonymous: d.isAnonymous || !d.supporterName,
      createdAt: d.createdAt,
    }));

    return NextResponse.json({ supporters });
  } catch (error) {
    console.error("Recent supporters error:", error);
    return NextResponse.json({ supporters: [] });
  }
}
