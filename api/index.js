import fetch from "node-fetch";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const GS_URL = "https://script.google.com/macros/s/AKfycbyNtnOw-3QFb32sh3CYHmMMF_psgquou5b9kvA196DcxZIvkwu2ahfOLvRH8HjW3L195g/exec";

    const form = new URLSearchParams();
    for (const key in req.body) {
      form.append(key, req.body[key]);
    }

    const response = await fetch(GS_URL, {
      method: "POST",
      body: form,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    const text = await response.text();

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        error: text.substring(0, 200)
      });
    }

    const data = JSON.parse(text);
    return res.json(data);

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

