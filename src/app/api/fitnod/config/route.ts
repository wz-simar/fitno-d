import { NextResponse } from "next/server";

function resolveAppBaseUrl(request: Request) {
  const configured = process.env.FITNOD_APP_BASE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");

  const origin =
    request.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";
  return `${origin.replace(/\/$/, "")}/app`;
}

export async function GET(request: Request) {
  const amount = Number(process.env.FITNOD_AMOUNT || 999);
  const membershipYears = Number(process.env.FITNOD_MEMBERSHIP_YEARS || 1);
  const inviteCode =
    process.env.FITNOD_INVITE_CODE || process.env.FITNOD_COACH_ID || "";

  return NextResponse.json({
    status: "success",
    data: {
      amount,
      currency: "INR",
      membershipYears,
      inviteCode,
      appBaseUrl: resolveAppBaseUrl(request),
    },
  });
}
