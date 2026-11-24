const { createClient } = require("@supabase/supabase-js");
const path = require("path");
const fs = require("fs");

// Load .env manually if dotenv not installed (for local dev)
const envPath = path.join(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  try {
    const envContent = fs.readFileSync(envPath, "utf8");
    envContent.split("\n").forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
        const idx = trimmed.indexOf("=");
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    });
  } catch (e) {}
}

const SUPABASE_URL = process.env.SUPABASE_URL || "https://vxuqnhgfjblregyhjcnx.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 
                     process.env.SUPABASE_ANON_KEY || 
                     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                     "";

let supabase = null;

if (SUPABASE_KEY) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  } catch (err) {
    console.warn("Notice: Supabase init warning:", err.message);
  }
} else {
  console.warn("Notice: SUPABASE_KEY is not set. Operating in resilient fallback mode.");
}

module.exports = {
  supabase,
  SUPABASE_URL,
  SUPABASE_KEY
};
