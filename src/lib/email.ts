/**
 * Resend Email dispatch utility using native fetch REST endpoint
 */
export async function sendEmail({
  to,
  subject,
  html
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY || "re_69psEq3Z_Lhwk6bnicRhHtiFkx9ffYTRC";
  const fromEmail = process.env.RESEND_FROM_EMAIL || "cre8tiveplus08@gmail.com";

  if (!apiKey) {
    console.log("✉️ Email Simulation (Resend key missing):", { to, subject });
    return { success: true, simulated: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: `Creative Plus <${fromEmail}>`,
        to: [to],
        subject,
        html
      })
    });

    const data = await res.json();
    if (res.ok) {
      console.log(`✉️ Email dispatched successfully via Resend. ID: ${data.id}`);
      return { success: true, id: data.id };
    } else {
      console.error("❌ Resend API Error:", data);
      return { success: false, error: data };
    }
  } catch (err) {
    console.error("❌ Resend Fetch Exception:", err);
    return { success: false, error: err };
  }
}
