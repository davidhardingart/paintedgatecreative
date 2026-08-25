export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, website, project, message } = req.body || {};

    if (!name || !email || !project || !message) {
      return res.status(400).json({
        error: "Please complete all required fields.",
      });
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured.");

      return res.status(500).json({
        error: "Email service is not configured.",
      });
    }

    const escapeHtml = (value = "") =>
      String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeWebsite = escapeHtml(website || "Not provided");
    const safeProject = escapeHtml(project);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",

      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        from: "Painted Gate Creative <hello@paintedgatecreative.com>",
        to: ["hello@paintedgatecreative.com"],
        reply_to: email,

        subject: `New website inquiry from ${name}`,

        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
            <h2>New Painted Gate Creative Inquiry</h2>

            <p>
              <strong>Name:</strong><br>
              ${safeName}
            </p>

            <p>
              <strong>Email:</strong><br>
              ${safeEmail}
            </p>

            <p>
              <strong>Current Website:</strong><br>
              ${safeWebsite}
            </p>

            <p>
              <strong>Project Type:</strong><br>
              ${safeProject}
            </p>

            <p>
              <strong>Project Details:</strong><br>
              ${safeMessage}
            </p>
          </div>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend error:", data);

      return res.status(response.status).json({
        error: "The message could not be sent. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Contact form error:", error);

    return res.status(500).json({
      error: "Something went wrong. Please try again.",
    });
  }
}
