// api/debug-env.ts
// TEMPORARY — delete this file after confirming env vars work.
// Visit: https://your-site.vercel.app/api/debug-env
// It will show you exactly what Vercel has in process.env for your Kit vars.

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    KIT_API_KEY: process.env.KIT_API_KEY
      ? `SET (starts with: ${process.env.KIT_API_KEY.slice(0, 6)}...)`
      : 'NOT SET ❌',
    KIT_FORM_ID: process.env.KIT_FORM_ID
      ? `SET — value: ${process.env.KIT_FORM_ID}`
      : 'NOT SET ❌',
    NODE_ENV: process.env.NODE_ENV,
  });
}
