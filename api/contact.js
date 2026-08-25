export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, project, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({
        error: "Please complete your name, email, and message.",
      });
    }

    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim();
    const cleanProject = String(project || "Not specified").trim();
    const cleanMessage = String(message).trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
      return res.status(400).json({
        error: "Please enter a valid email address.",
      });
    }

    const escapeHtml = (value) =>
      String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Painted Gate Creative <hello@paintedgatecreative.com>",
        to: ["hello@paintedgatecreative.com"],
        reply_to: cleanEmail,
        subject: `New website inquiry from ${cleanName}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
            <h2>New Painted Gate Creative Inquiry</h2>

            <p><strong>Name:</strong> ${escapeHtml(cleanName)}</p>

            <p><strong>Email:</strong> ${escapeHtml(cleanEmail)}</p>

            <p><strong>Project:</strong> ${escapeHtml(cleanProject)}</p>

            <p><strong>Message:</strong></p>

            <p>${escapeHtml(cleanMessage).replace(/\n/g, "<br>")}</p>
          </div>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend error:", data);

      return res.status(500).json({
        error: "The message could not be sent. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Your message has been sent.",
    });
  } catch (error) {
    console.error("Contact form error:", error);

    return res.status(500).json({
      error: "Something went wrong. Please try again.",
    });
  }
}
