import fetch from "node-fetch";

export default async function handler(req, res) {
  // CORS-Header setzen, damit dein Frontend zugreifen darf
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight-Anfrage (OPTIONS) direkt beantworten
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Nur POST-Anfragen erlauben
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const GS_URL = "https://script.google.com/macros/s/AKfycbyNtnOw-3QFb32sh3CYHmMMF_psgquou5b9kvA196DcxZIvkwu2ahfOLvRH8HjW3L195g/exec";

  try {
    // Daten für Google vorbereiten
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

    const responseText = await response.text();

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        error: `Fehler beim Google Script (Status: ${response.status})`,
        debug: responseText.substring(0, 200)
      });
    }

    // JSON parsen und zurückgeben
    const data = JSON.parse(responseText);
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Kritischer Fehler im Vercel-Proxy: " + err.message
    });
  }
}
