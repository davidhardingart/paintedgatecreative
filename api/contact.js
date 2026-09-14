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

    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
      console.error("WEB3FORMS_ACCESS_KEY is not configured.");

      return res.status(500).json({
        error: "Email service is not configured.",
      });
    }

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `New website inquiry from ${name}`,
        from_name: "Painted Gate Creative Website",
        name,
        email,
        website: website || "Not provided",
        project,
        message,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.success === false) {
      console.error("Web3Forms error:", data);

      return res.status(500).json({
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
