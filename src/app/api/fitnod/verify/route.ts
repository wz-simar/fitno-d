import crypto from "crypto";
import { NextResponse } from "next/server";

const API_BASE =
  process.env.WELLNESSZ_API_BASE ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://api.wellnessz.in/api/app";

function resolveAppBaseUrl(request: Request) {
  const configured = process.env.FITNOD_APP_BASE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");

  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") || "http";
  if (host) return `${proto}://${host}/app`;

  const origin =
    request.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";
  return `${origin.replace(/\/$/, "")}/app`;
}

function verifySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
) {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return expected === signature;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      name,
      mobileNumber,
      email,
      countryCode = "91",
    } = body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { status: "error", message: "Payment details are required" },
        { status: 400 }
      );
    }
    if (!name || !mobileNumber || !email) {
      return NextResponse.json(
        { status: "error", message: "Customer details are required" },
        { status: 400 }
      );
    }

    const coachMongoId = process.env.FITNOD_COACH_MONGO_ID;
    const amount = Number(process.env.FITNOD_AMOUNT || 999);
    const membershipYears = Number(process.env.FITNOD_MEMBERSHIP_YEARS || 1);
    const keySecret =
      process.env.FITNOD_RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET;
    const appBaseUrl = resolveAppBaseUrl(request);

    if (!coachMongoId || !keySecret) {
      return NextResponse.json(
        { status: "error", message: "FitNoD payment is not configured" },
        { status: 500 }
      );
    }

    if (
      !verifySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        keySecret
      )
    ) {
      return NextResponse.json(
        { status: "error", message: "Payment verification failed" },
        { status: 400 }
      );
    }

    const registerRes = await fetch(`${API_BASE}/fitnod/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        coachMongoId,
        name,
        mobileNumber,
        email,
        countryCode,
        amount,
        membershipYears,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        appBaseUrl,
      }),
    });
    const registerJson = await registerRes.json();

    if (!registerRes.ok) {
      return NextResponse.json(
        {
          status: "error",
          message: registerJson?.message || "Failed to create client",
          data: registerJson?.data,
        },
        { status: registerRes.status }
      );
    }

    const data = registerJson.data || {};
    const inviteCode =
      data.inviteCode ||
      data.coachId ||
      process.env.FITNOD_INVITE_CODE ||
      process.env.FITNOD_COACH_ID ||
      "";

    return NextResponse.json({
      status: "success",
      data: {
        ...data,
        inviteCode,
        loginLink:
          data.loginLink ||
          `${appBaseUrl}/loginClient?clientID=${data.clientId || ""}`,
      },
    });
  } catch (error: unknown) {
    console.error("[fitnod/verify]", error);
    const message =
      error instanceof Error ? error.message : "Payment verification failed";
    return NextResponse.json({ status: "error", message }, { status: 500 });
  }
}
