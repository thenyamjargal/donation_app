const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export interface PaymentNotificationData {
  amount: number;
  creatorSlug: string;
  supporterName?: string;
  isAnonymous: boolean;
  message?: string;
  invoiceId: string;
  paidAt: Date;
}

function formatPaymentMessage(data: PaymentNotificationData): string {
  const donor = data.isAnonymous || !data.supporterName
    ? "Нэргүй"
    : data.supporterName;

  const lines = [
    "💰 Шинэ төлбөр амжилттай!",
    "",
    `👤 Хандивлагч: ${donor}`,
    `🎯 Creator: ${data.creatorSlug}`,
    `💵 Дүн: ${data.amount.toLocaleString("mn-MN")}₮`,
  ];

  if (data.message) {
    lines.push(`💬 Мессеж: ${data.message}`);
  }

  lines.push(`📋 Invoice: ${data.invoiceId}`);
  lines.push(`🕐 Цаг: ${data.paidAt.toLocaleString("mn-MN", { timeZone: "Asia/Ulaanbaatar" })}`);

  return lines.join("\n");
}

/**
 * Sends a payment success notification to Telegram.
 * Non-blocking: resolves without throwing — all errors are logged internally.
 */
export async function sendPaymentNotification(
  data: PaymentNotificationData
): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn("[Telegram] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set — skipping notification");
    return;
  }

  const text = formatPaymentMessage(data);
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: "HTML",
      }),
      // Timeout after 5 seconds so it never blocks the payment response
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[Telegram] Notification failed (HTTP ${res.status}): ${body}`);
      return;
    }

    console.log(`[Telegram] Payment notification sent for invoice ${data.invoiceId}`);
  } catch (error) {
    // Log but never re-throw — Telegram failure must not affect the payment flow
    console.error("[Telegram] Notification error:", error);
  }
}
