export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    return res.status(500).json({ error: "Contact form is not configured." });
  }

  return res.status(200).json({ accessKey });
}
