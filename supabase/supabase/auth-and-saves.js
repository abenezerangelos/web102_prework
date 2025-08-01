// auth-and-saves.js
// Drop-in wiring for Supabase auth + per-user saves.
// Usage: <script type="module" src="./auth-and-saves.js"></script>
// Replace SUPABASE_URL and SUPABASE_ANON_KEY below.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// 1) CONFIG ————————————————
const SUPABASE_URL = "https://fkmqzpqjaqsnbrugkblv.supabase.co";          // ← replace
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrbXF6cHFqYXFzbmJydWdrYmx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNTAzOTMsImV4cCI6MjA2OTYyNjM5M30.0ot_CvL5S_E8v6dqNs0qQ4eBAPoY0waHGKlbn6s_H-M";                 // ← replace
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2) DOM HELPERS ————————————————
const $ = (sel) => document.querySelector(sel);
function toast(msg, type="info") {
  const el = $("#toast");
  if (!el) { console[type === "error" ? "error" : "log"](msg); return; }
  el.textContent = msg;
  el.dataset.type = type;
  el.style.opacity = "1";
  setTimeout(()=> el.style.opacity = "0", 3200);
}
function showAuthState(signedIn) {
  document.querySelectorAll('[data-auth="signed-in"]').forEach(e => e.style.display = signedIn ? "" : "none");
  document.querySelectorAll('[data-auth="signed-out"]').forEach(e => e.style.display = signedIn ? "none" : "");
}

// 3) AUTH API ————————————————
export async function signup(email, password) {
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  else {
    document.querySelector("#signup-form")?.reset();
  }
  toast("Check your email to confirm your account.");
}
export async function signin(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error; 
  toast("Signed in");
}
export async function signout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  toast("Signed out");
}
export async function currentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// 4) SAVES API ————————————————
// Table schema expected:
// create table saves (
//   id bigserial primary key,
//   user_id uuid references auth.users not null,
//   slot int default 1,
//   data jsonb not null,
//   updated_at timestamptz default now()
// );
// RLS policies should restrict access to auth.uid() = user_id.
export async function saveGame(stateObj, slot=1) {
  const user = await currentUser(); if (!user) throw new Error("Not signed in");
  const payload = { user_id: user.id, slot, data: stateObj };
  const { error } = await supabase.from("saves")
    .upsert(payload, { onConflict: "user_id,slot" });
  if (error) throw error;
  toast("Game saved");
}
export async function loadGame(slot=1) {
  const user = await currentUser(); if (!user) throw new Error("Not signed in");
  const { data, error } = await supabase.from("saves")
    .select("data, updated_at").eq("user_id", user.id).eq("slot", slot).maybeSingle();
  if (error) throw error;
  return data?.data ?? null;
}

// 5) UI WIRING ————————————————
async function init() {
  // flip UI on auth changes
  supabase.auth.onAuthStateChange(async (_event, session) => {
    showAuthState(!!session);
    if (session) { toast("Signed in"); } else { toast("Signed out"); }
  });

  // initial render
  const user = await currentUser();
  showAuthState(!!user);

  // form handlers (if present)
  $("#signup-form")?.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const email = (e.target.querySelector('input[name="email"]')?.value || "").trim();
    const password = e.target.querySelector('input[name="password"]')?.value || "";
    try { await signup(email, password); } catch (err) { toast(err.message, "error"); }
  });
  $("#signin-form")?.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const email = (e.target.querySelector('input[name="email"]')?.value || "").trim();
    const password = e.target.querySelector('input[name="password"]')?.value || "";
    try { await signin(email, password); } catch (err) { toast(err.message, "error"); }
  });
  $("#signout-btn")?.addEventListener("click", async ()=>{
    try { await signout(); } catch (err) { toast(err.message, "error"); }
  });

  // demo save/load wiring
  $("#save-btn")?.addEventListener("click", async ()=>{
    try {
      const raw = $("#game-json")?.value || "{}";
      const obj = JSON.parse(raw);
      const slot = Number($("#slot")?.value || "1");
      await saveGame(obj, slot);
    } catch (err) { toast(err.message, "error"); }
  });
  $("#load-btn")?.addEventListener("click", async ()=>{
    try {
      const slot = Number($("#slot")?.value || "1");
      const data = await loadGame(slot);
      $("#output").textContent = JSON.stringify(data, null, 2);
      toast(data ? "Loaded" : "No save for this slot");
    } catch (err) { toast(err.message, "error"); }
  });
}
document.addEventListener("DOMContentLoaded", init);
