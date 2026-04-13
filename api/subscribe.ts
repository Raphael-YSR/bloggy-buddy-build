// api/subscribe.ts
// Vercel Serverless Function — lives at /api/subscribe
// Sits between the browser and Kit's API so your secret key is never exposed.
//
// Deploy: just commit this file. Vercel auto-detects /api/* and deploys it.
// Env vars needed in Vercel dashboard:
//   KIT_API_KEY     — your Kit API Secret (Settings → Developer)
//   KIT_FORM_ID     — your form ID (from the form's URL)

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body as { email?: string };

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email is required' });
  }

  const apiKey = process.env.KIT_API_KEY;
  const formId = process.env.KIT_FORM_ID;

  if (!apiKey || !formId) {
    console.error('Missing KIT_API_KEY or KIT_FORM_ID env vars');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  try {
    const kitRes = await fetch(
      `https://api.convertkit.com/v3/forms/${formId}/subscribe`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: apiKey,
          email,
        }),
      }
    );

    const data = await kitRes.json() as { subscription?: unknown; error?: string; message?: string };

    if (!kitRes.ok) {
      console.error('Kit API error:', data);
      return res.status(kitRes.status).json({
        error: data.message ?? data.error ?? 'Failed to subscribe',
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Subscribe handler error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
