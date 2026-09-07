import { NextResponse } from "next/server";
import Razorpay from "razorpay";

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body?.name || "").trim();
    const mobileNumber = String(body?.mobileNumber || "").trim();
    const email = String(body?.email || "").trim();
    const countryCode = String(body?.countryCode || "91");
    const appBaseUrl = resolveAppBaseUrl(request);

    if (!name) {
      return NextResponse.json({ status: "error", message: "Name is required" }, { status: 400 });
    }
    if (!mobileNumber || mobileNumber.length !== 10) {
      return NextResponse.json(
        { status: "error", message: "Valid 10-digit mobile number is required" },
        { status: 400 }
      );
    }
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { status: "error", message: "Valid email is required" },
        { status: 400 }
      );
    }

    const coachMongoId = process.env.FITNOD_COACH_MONGO_ID;
    const amount = Number(process.env.FITNOD_AMOUNT || 999);
    const keyId = process.env.FITNOD_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    const keySecret =
      process.env.FITNOD_RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET;

    if (!coachMongoId) {
      return NextResponse.json(
        { status: "error", message: "FitNoD coach is not configured" },
        { status: 500 }
      );
    }
    if (!keyId || !keySecret) {
      return NextResponse.json(
        { status: "error", message: "Razorpay credentials are not configured" },
        { status: 500 }
      );
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { status: "error", message: "FitNoD amount is not configured" },
        { status: 500 }
      );
    }

    const precheckRes = await fetch(`${API_BASE}/fitnod/precheck`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coachMongoId, mobileNumber, countryCode, appBaseUrl }),
    });
    const precheckJson = await precheckRes.json();
    if (!precheckRes.ok) {
      return NextResponse.json(
        {
          status: "error",
          message: precheckJson?.message || "Precheck failed",
          data: precheckJson?.data,
        },
        { status: precheckRes.status }
      );
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `fitnod_${Date.now()}`,
      notes: {
        source: "fitnod",
        name,
        mobileNumber,
        email,
        countryCode,
        coachMongoId,
      },
    });

    return NextResponse.json({
      status: "success",
      data: {
        order,
        keyId,
        amount,
        appBaseUrl,
        inviteCode:
          process.env.FITNOD_INVITE_CODE ||
          process.env.FITNOD_COACH_ID ||
          precheckJson?.data?.coachId ||
          "",
      },
    });
  } catch (error: unknown) {
    console.error("[fitnod/create-order]", error);
    const message =
      error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ status: "error", message }, { status: 500 });
  }
}
