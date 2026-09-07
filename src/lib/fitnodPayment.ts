export type FitnodOrderResult = {
  order: {
    id: string;
    amount: number;
    currency: string;
  };
  keyId: string;
  amount: number;
};

export type FitnodVerifyResult = {
  clientId: string;
  loginLink: string;
  inviteCode?: string;
  coachId?: string;
  alreadyRegistered?: boolean;
  membership?: {
    startDate: string;
    endDate: string;
    years: number;
  };
};

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Razorpay can only run in the browser"));
      return;
    }
    const w = window as Window & { Razorpay?: unknown };
    if (w.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(script);
  });
}

export async function fetchFitnodConfig(): Promise<{
  amount: number;
  currency: string;
  membershipYears?: number;
  inviteCode?: string;
  appBaseUrl?: string;
}> {
  const res = await fetch("/api/fitnod/config");
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || "Failed to load pricing");
  return json.data;
}

export async function createFitnodOrder(payload: {
  name: string;
  mobileNumber: string;
  email: string;
}): Promise<FitnodOrderResult> {
  const res = await fetch("/api/fitnod/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) {
    const err = new Error(json?.message || "Failed to create order") as Error & {
      data?: unknown;
      status?: number;
    };
    err.data = json?.data;
    err.status = res.status;
    throw err;
  }
  return json.data;
}

export async function verifyFitnodPayment(payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  name: string;
  mobileNumber: string;
  email: string;
}): Promise<FitnodVerifyResult> {
  const res = await fetch("/api/fitnod/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || "Payment verification failed");
  return json.data;
}

export async function openFitnodCheckout(params: {
  order: FitnodOrderResult["order"];
  keyId: string;
  name: string;
  mobileNumber: string;
  email: string;
}): Promise<FitnodVerifyResult> {
  await loadRazorpayScript();

  return new Promise((resolve, reject) => {
    const RazorpayCtor = (
      window as Window & {
        Razorpay: new (options: Record<string, unknown>) => {
          open: () => void;
          on: (
            event: string,
            cb: (response: { error: { description?: string } }) => void
          ) => void;
        };
      }
    ).Razorpay;

    const rzp = new RazorpayCtor({
      key: params.keyId,
      amount: params.order.amount,
      currency: params.order.currency || "INR",
      name: "FitNoD",
      description: "Annual Membership",
      order_id: params.order.id,
      prefill: {
        name: params.name,
        contact: params.mobileNumber,
        email: params.email,
      },
      theme: { color: "#7B2DFF" },
      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        try {
          const result = await verifyFitnodPayment({
            ...response,
            name: params.name,
            mobileNumber: params.mobileNumber,
            email: params.email,
          });
          resolve(result);
        } catch (err) {
          reject(err);
        }
      },
      modal: {
        ondismiss: () => reject(new Error("Payment cancelled")),
      },
    });

    rzp.on("payment.failed", (response) => {
      reject(new Error(response?.error?.description || "Payment failed"));
    });

    rzp.open();
  });
}
