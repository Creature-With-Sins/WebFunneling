-- Dimension3D Studio Funnel Analytics & Deal Tracker Supabase Schema
-- Run this file in Supabase SQL Editor if connecting to cloud PostgreSQL database.

begin;

drop table if exists public.client_leads cascade;
drop table if exists public.funnel_sources cascade;
drop table if exists public.summary_metrics cascade;

-- 1. Summary Metrics Table (Overview 4-Stage Funnel)
create table if not exists public.summary_metrics (
  id bigint generated always as identity primary key,
  project_name text not null,
  period text not null unique,
  business_type text not null default '3D Design & Commercial CGI Studio',
  generated_by text not null,
  total_impresi integer not null,
  total_pengunjung integer not null,
  total_kalkulator integer not null,
  total_deal integer not null,
  funnel_stages jsonb not null,
  funnel_data jsonb not null,
  created_at timestamptz not null default now()
);

-- 2. Funnel Sources by Marketing Channel
create table if not exists public.funnel_sources (
  id bigint generated always as identity primary key,
  period text not null references public.summary_metrics(period) on delete cascade,
  name text not null,
  channel_full text not null,
  impresi integer not null,
  pengunjung integer not null,
  kalkulator integer not null,
  deal integer not null,
  conversion_rate numeric(6, 2) not null,
  drop_off numeric(6, 2) not null,
  status text not null,
  badge_class text not null,
  created_at timestamptz not null default now(),
  unique (period, name)
);

-- 3. Client Simulator & Brief Leads Table
create table if not exists public.client_leads (
  id bigint generated always as identity primary key,
  lead_id text not null unique,
  full_name text not null,
  whatsapp text not null,
  email text default '-',
  service_type text not null,
  specifications text not null,
  estimated_price text not null,
  utm_source text not null,
  status text not null default 'Request Brief Submitted',
  created_at timestamptz not null default now()
);

-- Seed Initial Data
insert into public.summary_metrics (
  project_name,
  period,
  business_type,
  generated_by,
  total_impresi,
  total_pengunjung,
  total_kalkulator,
  total_deal,
  funnel_stages,
  funnel_data
) values (
  'Dimension3D Studio Funnel Analytics',
  '2026',
  '3D Design & Commercial CGI Studio',
  'Internal Studio Analytics Engine',
  190000,
  24200,
  4780,
  560,
  '["1. Impresi Iklan (IG/Google Ads)", "2. Pengunjung Web 3D", "3. Interaksi Kalkulator Harga", "4. Request Brief / Deal Proyek"]'::jsonb,
  '[190000, 24200, 4780, 560]'::jsonb
);

insert into public.funnel_sources (
  period,
  name,
  channel_full,
  impresi,
  pengunjung,
  kalkulator,
  deal,
  conversion_rate,
  drop_off,
  status,
  badge_class
) values
  ('2026', 'Google Ads', 'Google Ads (High Intent B2B Search)', 62000, 8400, 2030, 275, 3.27, 86.45, 'Stable', 'stable'),
  ('2026', 'Instagram', 'Instagram Ads (Reels Portfolio 3D)', 88000, 9800, 1620, 145, 1.48, 88.86, 'Alert (Drop-off Tinggi)', 'risk'),
  ('2026', 'Twitter/X', 'Twitter/X & Artstation Showcase', 25000, 2800, 450, 48, 1.71, 88.80, 'Stable', 'stable'),
  ('2026', 'Website', 'Website Portofolio Organik (SEO Direct)', 15000, 3200, 680, 92, 2.88, 78.67, 'Stable', 'stable');

insert into public.client_leads (
  lead_id,
  full_name,
  whatsapp,
  email,
  service_type,
  specifications,
  estimated_price,
  utm_source,
  status,
  created_at
) values
  ('3D-LEAD-2026-001', 'Reza Pratama (PT Mahakarya Arsitektur)', '+6281234567890', 'reza.pratama@mahakarya-arch.id', '3D Architectural Visualization', '4K Exterior Render (3 Angle) + Twilight Lighting Mood', 'Rp 6.500.000', 'Instagram Ads (Reels Portfolio)', 'Deal Project (DP 50% Received)', now() - interval '2 hours'),
  ('3D-LEAD-2026-002', 'Clarissa Dewi (Brand Manager Lumina Cosmetic)', '+6281987654321', 'clarissa@luminacosmetics.com', '3D Product Commercial & Animation', '360 Spin + Exploded View 60fps (Blender/Cycles 4K)', 'Rp 12.000.000', 'Google Ads (High Intent Search)', 'Request Brief Submitted', now() - interval '5 hours'),
  ('3D-LEAD-2026-003', 'Bayu Wicaksono (IndoPlay Games Studio)', '+6281377889900', 'bayu@indoplaygames.co.id', '3D Game Asset & Character Rigging', 'Low-poly PBR Game Ready Character + Unreal Engine Rig', 'Rp 7.800.000', 'Google Ads (High Intent Search)', 'Follow-up Konsultasi WA', now() - interval '12 hours'),
  ('3D-LEAD-2026-004', 'Fajar Nugraha (F&B Creative Agency)', '+6281299887766', 'fajar@kreatifagency.id', '3D Photorealistic Packaging Render', '8K Packaging Packshot (Can & Box) + Splash Simulation', 'Rp 4.200.000', 'Instagram Ads (Reels Portfolio)', 'Kalkulator Cek Harga', now() - interval '24 hours');

commit;
