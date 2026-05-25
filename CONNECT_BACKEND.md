Connecting Frontend and Backend deployed separately on Vercel

Overview
- Two recommended approaches:
  1) Use env var in frontend and enable CORS on backend (recommended).
  2) Proxy API calls via Vercel rewrites (avoids CORS but requires static backend URL).

1) Env var + CORS (recommended)
- On your backend (Express) enable CORS and read `FRONTEND_URL` from env:

  const cors = require('cors');
  app.use(cors({ origin: process.env.FRONTEND_URL }));

- In the Vercel dashboard for your backend project set `FRONTEND_URL` to your frontend URL (e.g. https://my-frontend.vercel.app).
- In the Vercel dashboard for your frontend project set `REACT_APP_API_URL` to your backend API base (e.g. https://my-backend.vercel.app/api).
- Your frontend already uses `process.env.REACT_APP_API_URL` with a sensible fallback (see `src/api/api.js`).
- Redeploy the frontend so the build picks up the env var.

Test:
  curl -i https://my-backend.vercel.app/api/health
  # In browser devtools, check network requests for the API and CORS headers.

2) Proxy through Vercel (no CORS changes needed)
- Use a Vercel rewrite that forwards `/api/*` to your backend. Example `vercel.json` snippet (replace backend URL):

  {
    "rewrites": [
      { "source": "/api/:path*", "destination": "https://my-backend.vercel.app/api/:path*" },
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }

- If you use this rewrite, your frontend can call `/api/...` directly and Vercel will forward to the backend.
- Important: `vercel.json` destinations are static; you must edit the file with the real backend URL and redeploy, or maintain the rewrite in the Vercel project settings.

Notes & troubleshooting
- If you see CORS errors, ensure backend response includes `Access-Control-Allow-Origin: https://your-frontend.vercel.app`.
- For auth-protected endpoints, make sure tokens are sent and your backend accepts the origin.
- If your backend base path differs (e.g. `/v1`), update `REACT_APP_API_URL` accordingly.

If you want, I can:
- Add a `vercel.json` rewrite with your backend URL (tell me the backend URL), or
- Patch the backend code to use `FRONTEND_URL` for CORS if you provide the backend repo, or
- Add CI-friendly instructions to this repo to automate the rewrite replacement.
