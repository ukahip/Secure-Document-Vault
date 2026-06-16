// api/config.js
const ALLOWED_ORIGINS = [
  process.env.ALLOWED_ORIGIN,
  'http://localhost:3000',
  'http://localhost:5173',
].filter(Boolean);

export default function handler(req, res) {
  const origin = req.headers['origin'] || '';

  const allowed =
    !origin ||
    ALLOWED_ORIGINS.includes(origin) ||
    /^https:\/\/[a-z0-9-]+(\.vercel\.app)$/.test(origin);

  if (!allowed) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  // SECURITY FIX: Prevent CDN/browser caching of config endpoint.
  // Without this, a CDN or shared browser cache could serve User A's
  // config response to User B, leaking environment-level configuration.
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');

  res.status(200).json({
    gatewayUrl:         process.env.GATEWAY_URL            || '',
    identityApiKey:     process.env.IDENTITY_API_KEY       || '',
    firebaseProject:    process.env.FIREBASE_PROJECT_ID    || 'vault-project-492518',
    firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN   ||
      `${process.env.FIREBASE_PROJECT_ID || 'vault-project-492518'}.firebaseapp.com`
  });
}
