import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const ALLOWED_ORIGIN = process.env.APP_URL || "";

const RATE_LIMITS: Record<string, { limit: number; windowMs: number }> = {
  "/api/donations/create": { limit: 10, windowMs: 60_000 },       // 10 per minute
  "/api/donations/status": { limit: 30, windowMs: 60_000 },       // 30 per minute
  "/api/donations/recent": { limit: 30, windowMs: 60_000 },       // 30 per minute
  "/api/qpay/callback":    { limit: 30, windowMs: 60_000 },       // 30 per minute
};

function addSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
  );
  return response;
}

function addCorsHeaders(response: NextResponse, origin: string | null) {
  if (ALLOWED_ORIGIN && origin === ALLOWED_ORIGIN) {
    response.headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  } else if (!ALLOWED_ORIGIN) {
    // If APP_URL not set, allow same-origin only (no CORS header = blocked by browser)
  }
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  response.headers.set("Access-Control-Max-Age", "86400");
  return response;
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const origin = req.headers.get("origin");

  // Handle CORS preflight
  if (req.method === "OPTIONS" && pathname.startsWith("/api/")) {
    const response = new NextResponse(null, { status: 204 });
    addCorsHeaders(response, origin);
    return response;
  }

  // Rate limiting for API routes
  if (pathname.startsWith("/api/")) {
    const rateLimitConfig = RATE_LIMITS[pathname];
    if (rateLimitConfig) {
      const ip = getClientIp(req);
      const key = `${ip}:${pathname}`;
      const result = rateLimit(key, rateLimitConfig);

      if (!result.success) {
        const response = NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        );
        response.headers.set("Retry-After", "60");
        addSecurityHeaders(response);
        return response;
      }
    }
  }

  const response = NextResponse.next();
  addSecurityHeaders(response);

  if (pathname.startsWith("/api/")) {
    addCorsHeaders(response, origin);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
