/*
  Phase 4A Backend-Ready Data Service
  -----------------------------------
  This file keeps the SPA fully functional on GitHub Pages while preparing the
  quote workflow for a real backend such as Supabase in Phase 4B/4C.

  Current mode: localStorage fallback.
  Future mode: replace the empty Supabase URL/key below and load the Supabase SDK.
*/

const SIKAT_ARAW_BACKEND_CONFIG = {
  phase: "4A",
  provider: "localStorage",
  localStorageKey: "sikatArawQuoteRequests",
  maxLocalRecords: 50,
  supabase: {
    url: "",
    anonKey: "",
    table: "quote_requests"
  }
};

window.SIKAT_ARAW_BACKEND_CONFIG = window.SIKAT_ARAW_BACKEND_CONFIG || SIKAT_ARAW_BACKEND_CONFIG;

window.SikatArawDataService = (() => {
  const config = window.SIKAT_ARAW_BACKEND_CONFIG;

  function hasSupabaseConfig() {
    return Boolean(config.supabase?.url && config.supabase?.anonKey);
  }

  function isSupabaseSdkAvailable() {
    return Boolean(window.supabase?.createClient);
  }

  function isRemoteReady() {
    return hasSupabaseConfig() && isSupabaseSdkAvailable();
  }

  function readLocalQuoteRequests() {
    try {
      const value = localStorage.getItem(config.localStorageKey);
      return value ? JSON.parse(value) : [];
    } catch (error) {
      console.warn("Unable to read local quote requests", error);
      return [];
    }
  }

  function writeLocalQuoteRequests(requests) {
    try {
      localStorage.setItem(config.localStorageKey, JSON.stringify(requests));
    } catch (error) {
      console.warn("Unable to write local quote requests", error);
    }
  }

  function normalizeQuoteRequest(request) {
    const now = new Date().toISOString();
    return {
      ...request,
      backendPhase: config.phase,
      storageProvider: "localStorage",
      syncStatus: isRemoteReady() ? "ready-for-database-sync" : "local-fallback",
      savedAt: request.savedAt || now,
      updatedAt: request.updatedAt || now
    };
  }

  function getBackendStatus() {
    const remoteConfigured = hasSupabaseConfig();
    const sdkAvailable = isSupabaseSdkAvailable();
    const remoteReady = isRemoteReady();
    return {
      phase: config.phase,
      provider: config.provider,
      localStorageKey: config.localStorageKey,
      table: config.supabase.table,
      remoteConfigured,
      sdkAvailable,
      remoteReady,
      syncMode: remoteReady ? "database-ready" : "local-fallback",
      message: remoteReady
        ? "Supabase configuration and SDK are detected. Remote sync can be activated in the next implementation phase."
        : "Using browser localStorage fallback. Quote records remain on this browser/device until Supabase is connected."
    };
  }

  function getQuoteRequests() {
    return readLocalQuoteRequests();
  }

  function setQuoteRequests(requests) {
    const normalized = (requests || []).map(normalizeQuoteRequest).slice(0, config.maxLocalRecords);
    writeLocalQuoteRequests(normalized);
    return normalized;
  }

  function saveQuoteRequest(request) {
    const saved = normalizeQuoteRequest(request);
    const existing = getQuoteRequests().filter((entry) => entry.reference !== saved.reference);
    setQuoteRequests([saved, ...existing]);
    return saved;
  }

  function updateQuoteRequest(reference, updater) {
    let updatedRecord = null;
    const requests = getQuoteRequests().map((request) => {
      if (request.reference !== reference) return request;
      updatedRecord = normalizeQuoteRequest({
        ...request,
        ...updater(request),
        updatedAt: new Date().toISOString()
      });
      return updatedRecord;
    });
    setQuoteRequests(requests);
    return updatedRecord;
  }

  function deleteQuoteRequest(reference) {
    const requests = getQuoteRequests().filter((request) => request.reference !== reference);
    setQuoteRequests(requests);
    return requests;
  }

  function clearQuoteRequests() {
    writeLocalQuoteRequests([]);
    return [];
  }

  function getSupabaseTableSql() {
    return `create table quote_requests (\n  id uuid primary key default gen_random_uuid(),\n  reference text unique not null,\n  status text not null default 'Quote Submitted',\n  customer jsonb not null,\n  items jsonb not null,\n  subtotal numeric not null default 0,\n  currency text not null default 'PHP',\n  timeline jsonb,\n  submitted_at timestamptz not null,\n  updated_at timestamptz not null default now(),\n  created_at timestamptz not null default now()\n);`;
  }

  return {
    config,
    getBackendStatus,
    getQuoteRequests,
    setQuoteRequests,
    saveQuoteRequest,
    updateQuoteRequest,
    deleteQuoteRequest,
    clearQuoteRequests,
    getSupabaseTableSql
  };
})();
