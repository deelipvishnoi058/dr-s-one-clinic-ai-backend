DR. S ONE CLINIC — AI VOICE ASSISTANT TEST

WHAT CHANGED
- Replaced fixed keyword answers with an AI backend.
- Hindi/Hinglish voice input remains enabled.
- AI is instructed to use only verified clinic information and not invent fees/services.
- Clinic knowledge is centralized in server.js so it can be expanded later.

IMPORTANT SECURITY NOTE
GitHub Pages is static hosting. Do NOT put a Gemini API key inside index.html. The key must stay on a server/backend environment.

TEST ON A COMPUTER
1. Install Node.js 18+.
2. Open this folder in Terminal.
3. Run: npm install
4. Copy .env.example to .env
5. Put your Gemini API key in .env as GEMINI_API_KEY=...
6. Run: npm start
7. Open: http://localhost:3000

DEPLOYMENT
For the public mobile site, deploy the frontend and server/API together on a platform that supports server-side environment variables (for example Google AI Studio full-stack/Cloud Run, Vercel, or another Node server host). Keep GEMINI_API_KEY as a server secret.

CLINIC DATA TO ADD NEXT
Doctor name/qualifications, consultation fee, full treatment list, each verified price, working days/holidays, offers, appointment rules, phone/WhatsApp, and any other clinic-approved FAQs.
