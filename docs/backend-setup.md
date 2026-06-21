# Backend Setup Notes - Phase 4A

This project is still deployable as a static GitHub Pages website. Phase 4A adds a backend-ready architecture without requiring a live database yet.

## Current Mode

```text
Provider: localStorage fallback
Service file: assets/js/backend-service.js
Quote key: sikatArawQuoteRequests
Target table name: quote_requests
```

Saved quote records remain in the same browser/device until a real backend is connected.

## Why This Layer Exists

Before adding real email, login, payment, proof upload, inventory deduction, or cross-device tracking, the quote workflow needs a clean data boundary. `backend-service.js` gives the app one place to manage quote persistence.

The front-end now calls service-style functions such as:

```text
getQuoteRequests()
saveQuoteRequest(request)
updateQuoteRequest(reference, updater)
deleteQuoteRequest(reference)
clearQuoteRequests()
```

Later, those functions can be connected to Supabase or another backend without rewriting the buyer workflow.

## Supabase Table Draft

```sql
create table quote_requests (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  status text not null default 'Quote Submitted',
  customer jsonb not null,
  items jsonb not null,
  subtotal numeric not null default 0,
  currency text not null default 'PHP',
  timeline jsonb,
  submitted_at timestamptz not null,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
```

## Recommended Phase 4B / 4C Tasks

1. Create a Supabase project.
2. Create the `quote_requests` table using the draft schema.
3. Add Supabase URL and public anon key to a config file or environment-injected script.
4. Load the Supabase JavaScript SDK.
5. Connect quote submission to remote insert.
6. Connect quote history and admin dashboard to remote select/update/delete.
7. Keep localStorage as fallback for offline/demo use.

## Later Production Features

- Customer login and trade account approval
- Admin login and role-based access
- Real sales/admin email notifications
- Payment processing
- Proof-of-payment upload
- Inventory deduction and stock reservations
- Cross-device order tracking
- PDF quotation generation
