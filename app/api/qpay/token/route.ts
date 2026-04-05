import { NextResponse } from "next/server";

// This endpoint has been disabled for security reasons.
// QPay tokens should only be used server-side.
export async function POST() {
  return NextResponse.json(
    { error: "This endpoint is not available" },
    { status: 403 }
  );
}
