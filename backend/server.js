const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
const fs = require("fs");
const { supabase } = require("./supabaseClient");

const app = express();
const PORT = process.env.PORT || 3001;
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "";

app.use(cors());
app.use(express.json());

// Serve static frontend assets (both public and frontend directories supported)
const publicPath = path.join(__dirname, "../public");
const frontendPath = path.join(__dirname, "../frontend");
const dataFilePath = path.join(__dirname, "../data_funnel.json");

app.use(express.static(publicPath));
app.use(express.static(frontendPath));

// In-memory users store for 3D Studio Internal Access
const usersStore = [
  {
    user_id: "USR-NEXA-001",
    email: "nexa.3d@gmail.com",
    password: "fatih11204",
    full_name: "Lead 3D Artist (Nexa3D)",
    studio_name: "Dimension3D Studio",
    role: "Studio Director & Lead Artist",
    created_at: new Date(Date.now() - 86400000 * 30).toISOString()
  }
];

// Persistent campaign funnel data for 3D Design Studio
let campaignData = {
  all: {
    channel: "Semua Saluran Iklan",
    impresi: 190000,
    pengunjung: 24200,
    kalkulator: 4780,
    deal: 560
  },
  google_ads: {
    channel: "Google Ads (Search B2B Intent)",
    impresi: 62000,
    pengunjung: 8400,
    kalkulator: 2030,
    deal: 275
  },
  instagram: {
    channel: "Instagram Ads (Reels & Showcase 3D)",
    impresi: 88000,
    pengunjung: 9800,
    kalkulator: 1620,
    deal: 145
  },
  twitter_x: {
    channel: "Twitter/X & Artstation",
    impresi: 25000,
    pengunjung: 2800,
    kalkulator: 450,
    deal: 48
  },
  website: {
    channel: "Website Portofolio Organik (SEO)",
    impresi: 15000,
    pengunjung: 3200,
    kalkulator: 680,
    deal: 92
  }
};

// In-memory & JSON backed UX interaction & 3D client calculator leads
let leadsStore = [];

async function loadSupabaseData() {
  if (!supabase) {
    console.log("ℹ️ Supabase standby (waiting for env vars in production)");
    return;
  }
  try {
    const { data: dbMetrics } = await supabase.from("summary_metrics").select("*").limit(1).maybeSingle();
    if (dbMetrics) {
      campaignData.all.impresi = dbMetrics.total_impresi || campaignData.all.impresi;
      campaignData.all.pengunjung = dbMetrics.total_pengunjung || campaignData.all.pengunjung;
      campaignData.all.kalkulator = dbMetrics.total_kalkulator || campaignData.all.kalkulator;
      campaignData.all.deal = dbMetrics.total_deal || campaignData.all.deal;
    }

    const { data: dbSources } = await supabase.from("funnel_sources").select("*");
    if (Array.isArray(dbSources) && dbSources.length > 0) {
      dbSources.forEach(s => {
        const key = mapChannelKey(s.name);
        if (campaignData[key]) {
          campaignData[key].impresi = s.impresi || campaignData[key].impresi;
          campaignData[key].pengunjung = s.pengunjung || campaignData[key].pengunjung;
          campaignData[key].kalkulator = s.kalkulator || campaignData[key].kalkulator;
          campaignData[key].deal = s.deal || campaignData[key].deal;
        }
      });
    }

    const { data: dbLeads, error: errLeads } = await supabase.from("client_leads").select("*").order("created_at", { ascending: false });
    if (!errLeads && Array.isArray(dbLeads) && dbLeads.length > 0) {
      leadsStore = dbLeads;
    }
    console.log(`✅ Supabase Database connected: loaded ${leadsStore.length} leads & cloud metrics.`);
  } catch (err) {
    console.warn("Notice: Supabase initial sync fallback to local store:", err.message);
  }
}

function loadInitialData() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const raw = fs.readFileSync(dataFilePath, "utf8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.recent_ux_logs) && parsed.recent_ux_logs.length > 0) {
        leadsStore = parsed.recent_ux_logs;
      }
      if (parsed.summary) {
        campaignData.all.impresi = parsed.summary.total_impresi || campaignData.all.impresi;
        campaignData.all.pengunjung = parsed.summary.total_pengunjung || campaignData.all.pengunjung;
        campaignData.all.kalkulator = parsed.summary.total_kalkulator || campaignData.all.kalkulator;
        campaignData.all.deal = parsed.summary.total_deal || campaignData.all.deal;
      }
    }
  } catch (err) {
    console.warn("Notice: Using default fallback dataset for 3D studio:", err.message);
  }

  // Load from Supabase in background
  loadSupabaseData();
}

function persistDataToFile() {
  try {
    let baseData = {};
    if (fs.existsSync(dataFilePath)) {
      baseData = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
    }
    baseData.summary = {
      total_impresi: campaignData.all.impresi,
      total_pengunjung: campaignData.all.pengunjung,
      total_kalkulator: campaignData.all.kalkulator,
      total_deal: campaignData.all.deal
    };
    baseData.recent_ux_logs = leadsStore;
    fs.writeFileSync(dataFilePath, JSON.stringify(baseData, null, 2), "utf8");
  } catch (err) {
    console.warn("Notice: Could not persist data to file:", err.message);
  }
}

loadInitialData();

/**
 * Helper: Map various UTM source strings to campaignData channel keys
 */
function mapChannelKey(sourceStr) {
  if (!sourceStr) return "website";
  const s = sourceStr.toLowerCase();
  if (s.includes("google")) return "google_ads";
  if (s.includes("instagram") || s.includes("ig")) return "instagram";
  if (s.includes("twitter") || s.includes("artstation") || s.includes("x_")) return "twitter_x";
  return "website";
}

/**
 * Helper: Calculate 4-stage 3D Design Studio Funnel Analytics & Leak Detection
 * 1. Impresi Iklan -> 2. Pengunjung Web 3D -> 3. Interaksi Kalkulator Harga -> 4. Request Brief / Deal Proyek
 */
function calculateFunnelAnalytics(raw) {
  const stages = [
    { key: "impresi", label: "1. Impresi Iklan (IG/Google Ads)", count: raw.impresi },
    { key: "pengunjung", label: "2. Pengunjung Web 3D", count: raw.pengunjung },
    { key: "kalkulator", label: "3. Interaksi Kalkulator Harga", count: raw.kalkulator },
    { key: "deal", label: "4. Request Brief / Deal Proyek", count: raw.deal }
  ];

  let maxDropRate = -1;
  let leakStageIndex = -1;

  for (let i = 1; i < stages.length; i++) {
    const prev = stages[i - 1].count;
    const curr = stages[i].count;
    const dropCount = Math.max(0, prev - curr);
    const dropRate = prev > 0 ? parseFloat(((dropCount / prev) * 100).toFixed(1)) : 0;
    const convRate = prev > 0 ? parseFloat(((curr / prev) * 100).toFixed(1)) : 0;

    stages[i].drop_count = dropCount;
    stages[i].drop_rate_pct = dropRate;
    stages[i].conv_rate_pct = convRate;

    // Detect highest drop-off rate
    if (dropRate > maxDropRate) {
      maxDropRate = dropRate;
      leakStageIndex = i;
    }
  }

  // First stage has 0% drop
  stages[0].drop_count = 0;
  stages[0].drop_rate_pct = 0;
  stages[0].conv_rate_pct = 100;

  // Mark critical leak stage
  stages.forEach((st, idx) => {
    st.is_critical_leak = (idx === leakStageIndex);
  });

  const leakStage = stages[leakStageIndex] || stages[1];
  const prevStage = stages[Math.max(0, leakStageIndex - 1)];

  const overallConversion = raw.impresi > 0
    ? parseFloat(((raw.deal / raw.impresi) * 100).toFixed(2))
    : 0;

  const visitorToDealConversion = raw.pengunjung > 0
    ? parseFloat(((raw.deal / raw.pengunjung) * 100).toFixed(2))
    : 0;

  const calcToDealConversion = raw.kalkulator > 0
    ? parseFloat(((raw.deal / raw.kalkulator) * 100).toFixed(1))
    : 0;

  let recommendation = "";
  if (leakStage.key === "kalkulator") {
    recommendation = "Banyak pengunjung portofolio 3D tidak mencoba kalkulator simulasi harga. Buat tombol CTA 'Hitung Estimasi Biaya Proyek 3D' lebih kontras dan pastikan waktu muat 3D web viewer di bawah 2 detik.";
  } else if (leakStage.key === "deal") {
    recommendation = "Calon klien menghitung estimasi biaya tetapi batal submit brief proyek (BOCOR PARAH). Berikan opsi 'Konsultasi WhatsApp Instan dengan 3D Artist' langsung di hasil kalkulator serta kupon diskon first-order 15%.";
  } else {
    recommendation = "Tingkatkan relevansi visual headline iklan 3D (tampilkan wireframe to render before-after) untuk menaikkan CTR iklan ke website portofolio.";
  }

  return {
    overall_conversion_pct: overallConversion,
    visitor_to_deal_conv_pct: visitorToDealConversion,
    calc_to_deal_conv_pct: calcToDealConversion,
    stages,
    leak_alert: {
      detected: true,
      stage_index: leakStageIndex,
      from_stage: prevStage.label,
      to_stage: leakStage.label,
      drop_rate_pct: maxDropRate,
      warning_message: `🚨 BOCOR PARAH TERDETEKSI: Drop-off ${maxDropRate}% terjadi dari "${prevStage.label}" ke "${leakStage.label}"!`,
      recommendation: recommendation
    }
  };
}

// API Health Check & status
app.get("/api", (req, res) => {
  res.json({
    success: true,
    studio: "Dimension3D Studio Internal Analytics",
    status: "active",
    endpoints: {
      register: "/api/register",
      login: "/api/login",
      user: "/api/user",
      funnel: "/api/dashboard/funnel",
      leads: "/api/leads",
      track: "/api/analytics/track"
    }
  });
});

/**
 * POST /api/register
 */
app.post("/api/register", (req, res) => {
  try {
    const { name, full_name, email, password } = req.body;
    const userName = (name || full_name || "").trim();
    const userEmail = (email || "").trim().toLowerCase();

    if (!userEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi."
      });
    }

    const existingUser = usersStore.find(u => u.email === userEmail);
    if (existingUser) {
      return res.status(200).json({
        success: true,
        message: "Akun studio sudah terdaftar. Mengalihkan ke dashboard...",
        user: {
          user_id: existingUser.user_id,
          full_name: existingUser.full_name,
          email: existingUser.email,
          role: existingUser.role
        }
      });
    }

    const newUser = {
      user_id: `USR-3D-${Date.now().toString().slice(-4)}`,
      full_name: userName || "Studio 3D Owner",
      email: userEmail,
      password: password,
      role: "Lead 3D Artist & Studio Director",
      created_at: new Date().toISOString()
    };

    usersStore.push(newUser);

    res.status(201).json({
      success: true,
      message: "Registrasi akun Studio 3D berhasil! Membuka dashboard internal...",
      user: {
        user_id: newUser.user_id,
        full_name: newUser.full_name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat registrasi.",
      error: err.message
    });
  }
});

/**
 * POST /api/login
 */
app.post("/api/login", (req, res) => {
  try {
    const { email, password } = req.body;
    const userEmail = (email || "").trim().toLowerCase();

    const user = usersStore.find(u => u.email.toLowerCase() === userEmail);
    if (user && user.password === password) {
      return res.json({
        success: true,
        message: "Login Studio 3D berhasil!",
        user: {
          user_id: user.user_id,
          full_name: user.full_name,
          email: user.email,
          role: user.role
        }
      });
    }

    return res.status(401).json({
      success: false,
      message: "Email atau password tidak sesuai. Silakan periksa kembali."
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat login.",
      error: err.message
    });
  }
});

/**
 * GET /api/user or /api/me
 */
app.get(["/api/user", "/api/me"], (req, res) => {
  res.json({
    success: true,
    user: usersStore[0]
  });
});

/**
 * POST /api/logout
 */
app.post("/api/logout", (req, res) => {
  res.json({
    success: true,
    message: "Logout berhasil."
  });
});

/**
 * GET /api/dashboard/funnel
 * Returns 4-stage 3D studio funnel analytics, drop-off rates, and leak alerts
 */
app.get("/api/dashboard/funnel", (req, res) => {
  const channel = (req.query.channel || "all").toLowerCase().replace("-", "_").replace(" ", "_");
  const dataToUse = campaignData[channel] || campaignData.all;
  const analysis = calculateFunnelAnalytics(dataToUse);

  res.json({
    success: true,
    filter: {
      channel: req.query.channel || "all",
      period: req.query.range || "7"
    },
    funnel: analysis,
    summary: {
      total_impresi: campaignData.all.impresi,
      total_pengunjung: campaignData.all.pengunjung,
      total_kalkulator: campaignData.all.kalkulator,
      total_deal: campaignData.all.deal
    },
    comparison: {
      google_ads: calculateFunnelAnalytics(campaignData.google_ads),
      instagram_ads: calculateFunnelAnalytics(campaignData.instagram)
    }
  });
});

/**
 * POST /api/analytics/track
 * Receives real-time telemetry from 3DWebsite:
 * Stage 2: { event: "pageview", utm_source: "Instagram_Ads" }
 * Stage 3: { event: "calculator_interaction", utm_source: "..." }
 */
app.post("/api/analytics/track", (req, res) => {
  try {
    const { event, utm_source } = req.body;
    const channelKey = mapChannelKey(utm_source);

    if (event === "pageview") {
      campaignData.all.pengunjung += 1;
      if (campaignData[channelKey]) {
        campaignData[channelKey].pengunjung += 1;
      }
    } else if (event === "calculator_interaction") {
      campaignData.all.kalkulator += 1;
      if (campaignData[channelKey]) {
        campaignData[channelKey].kalkulator += 1;
      }
    }

    persistDataToFile();

    res.json({
      success: true,
      message: `Event ${event} recorded successfully for channel ${channelKey}`,
      current_metrics: {
        pengunjung: campaignData.all.pengunjung,
        kalkulator: campaignData.all.kalkulator,
        deal: campaignData.all.deal
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/leads
 * Saves 3D design calculator brief submissions.
 * Supports BOTH flat payload AND nested 3DWebsite uxPayload!
 */
app.post("/api/leads", async (req, res) => {
  try {
    const b = req.body || {};

    // 1. Normalize client name
    const full_name = b.full_name || (b.client && b.client.name) || b.name || "";

    // 2. Normalize WhatsApp
    const whatsapp = b.whatsapp || (b.client && (b.client.whatsapp_full || b.client.whatsapp_raw)) || "";

    // 3. Normalize Email
    const email = b.email || (b.client && b.client.email) || "-";

    // 4. Normalize Service Type
    const service_type = b.service_type || (b.configuration && b.configuration.service_name) || "3D Visualisasi Produk";

    // 5. Normalize Specifications
    let specifications = b.specifications || "";
    if (!specifications && b.configuration) {
      const cfg = b.configuration;
      const addonsStr = (cfg.addons && cfg.addons.length > 0)
        ? cfg.addons.map(a => typeof a === "string" ? a : a.name).join(", ")
        : "Tanpa Add-on";
      specifications = `${cfg.visual_style_name || "Standard"} • ${cfg.duration_value || 5} ${cfg.duration_unit || "Detik/Angle"} • [${addonsStr}]`;
      if (b.client && b.client.notes) {
        specifications += ` • Catatan: ${b.client.notes}`;
      }
    }
    if (!specifications) specifications = "Custom 3D Render & Asset";

    // 6. Normalize Estimated Price
    const estimated_price = b.estimated_price || (b.configuration && (b.configuration.total_estimate_formatted || (b.configuration.total_estimate_raw ? `Rp ${b.configuration.total_estimate_raw.toLocaleString("id-ID")}` : ""))) || "Rp 5.000.000";

    // 7. Normalize UTM Source
    const utm_source = b.utm_source || (b.tracking && b.tracking.utm_source) || "Instagram Ads";

    if (!full_name || !whatsapp) {
      return res.status(400).json({
        success: false,
        message: "Nama klien dan nomor WhatsApp wajib diisi."
      });
    }

    const leadRef = b.lead_id || `3D-LEAD-${new Date().getFullYear()}-${String(leadsStore.length + 1).padStart(3, "0")}`;

    const newLead = {
      lead_id: leadRef,
      full_name,
      whatsapp,
      email,
      service_type,
      specifications,
      estimated_price,
      utm_source,
      created_at: new Date().toISOString(),
      status: "Request Brief Submitted"
    };

    leadsStore.unshift(newLead);

    // Save lead to Supabase Cloud Database
    if (supabase) {
      try {
        const { error: sbErr } = await supabase.from("client_leads").insert([{
          lead_id: leadRef,
          full_name,
          whatsapp,
          email,
          service_type,
          specifications,
          estimated_price,
          utm_source,
          status: "Request Brief Submitted"
        }]);
        if (sbErr) {
          console.warn("Notice: Supabase insert lead warning:", sbErr.message);
        } else {
          console.log(`☁️ Lead ${leadRef} successfully saved to Supabase PostgreSQL!`);
        }
      } catch (sbEx) {
        console.warn("Supabase lead insert exception:", sbEx.message);
      }
    }

    // Increment deal count in funnel analytics (Stage 4)
    campaignData.all.deal += 1;
    const channelKey = mapChannelKey(utm_source);
    if (campaignData[channelKey]) {
      campaignData[channelKey].deal += 1;
    }

    persistDataToFile();

    // Optional webhook trigger for n8n notification to Studio Owner
    let webhookStatus = "n8n webhook skipped / direct API mode";
    if (N8N_WEBHOOK_URL) {
      try {
        await fetch(N8N_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newLead)
        });
        webhookStatus = "forwarded to n8n successfully";
      } catch (err) {
        webhookStatus = `failed to forward to n8n: ${err.message}`;
      }
    }

    res.status(201).json({
      success: true,
      message: "Brief proyek 3D berhasil disimpan ke sistem!",
      lead: newLead,
      webhook_status: webhookStatus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan internal server.",
      error: error.message
    });
  }
});

/**
 * GET /api/leads
 * Returns recent 3D design UX simulator interactions & client briefs
 * Fetches real-time data from Supabase PostgreSQL with local cache fallback
 */
app.get("/api/leads", async (req, res) => {
  if (supabase) {
    try {
      const { data: dbLeads, error } = await supabase
        .from("client_leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(dbLeads)) {
        leadsStore = dbLeads;
        return res.json({
          success: true,
          source: "supabase",
          total: dbLeads.length,
          leads: dbLeads
        });
      }
    } catch (err) {
      console.warn("Supabase fetch leads exception, fallback to local:", err.message);
    }
  }

  res.json({
    success: true,
    source: "local",
    total: leadsStore.length,
    leads: leadsStore
  });
});

/**
 * GET /api/leads/:leadId
 * Returns single lead status (queryable by n8n or admin)
 */
app.get("/api/leads/:leadId", async (req, res) => {
  const { leadId } = req.params;
  if (supabase) {
    try {
      const { data: dbLead, error } = await supabase
        .from("client_leads")
        .select("*")
        .eq("lead_id", leadId)
        .maybeSingle();

      if (!error && dbLead) {
        return res.json({ success: true, source: "supabase", lead: dbLead });
      }
    } catch (err) {}
  }

  const lead = leadsStore.find(l => l.lead_id === leadId);
  if (!lead) {
    return res.status(404).json({ success: false, message: "Lead tidak ditemukan" });
  }
  res.json({ success: true, source: "local", lead });
});

/**
 * PATCH or POST /api/leads/:leadId/status
 * Updates lead status in real-time (e.g. to 'Deal Project (DP 50% Received)')
 * Synchronizes with Supabase Cloud Database & local file store
 */
app.all(["/api/leads/:leadId", "/api/leads/:leadId/status"], async (req, res, next) => {
  if (req.method !== "PATCH" && req.method !== "POST" && req.method !== "PUT") {
    return next();
  }
  const { leadId } = req.params;
  const { status } = req.body || {};

  const lead = leadsStore.find(l => l.lead_id === leadId);
  if (!lead) {
    return res.status(404).json({ success: false, message: "Lead tidak ditemukan." });
  }

  if (status) {
    const oldStatus = lead.status || "";
    lead.status = status;

    if (status.includes("Deal") && !oldStatus.includes("Deal")) {
      campaignData.all.deal += 1;
      const channelKey = mapChannelKey(lead.utm_source);
      if (campaignData[channelKey]) {
        campaignData[channelKey].deal += 1;
      }
    }
    persistDataToFile();

    // Synchronize to Supabase Cloud PostgreSQL
    if (supabase) {
      try {
        const { error: sbErr } = await supabase
          .from("client_leads")
          .update({ status: status })
          .eq("lead_id", leadId);

        if (sbErr) {
          console.warn("Notice: Supabase lead status update warning:", sbErr.message);
        } else {
          console.log(`☁️ Supabase lead ${leadId} status updated to: "${status}"`);
        }
      } catch (sbEx) {
        console.warn("Supabase lead status update exception:", sbEx.message);
      }
    }
  }

  res.json({
    success: true,
    message: `Status lead ${leadId} berhasil diperbarui menjadi "${lead.status}"`,
    lead
  });
});

// Single Page Application Fallback: Route any non-API request straight to index.html
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  const indexFile = path.join(publicPath, "index.html");
  const fallbackIndex = path.join(frontendPath, "index.html");
  res.sendFile(indexFile, (err) => {
    if (err) res.sendFile(fallbackIndex);
  });
});

// Run server only if executed directly (not when required as a serverless module)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Dimension3D Funnel Analytics running on http://localhost:${PORT}`);
    console.log(`📡 GET  http://localhost:${PORT}/api/dashboard/funnel`);
    console.log(`📥 POST http://localhost:${PORT}/api/leads`);
    console.log(`📊 POST http://localhost:${PORT}/api/analytics/track`);
  });
}

// Export for Vercel Serverless Function
module.exports = app;
