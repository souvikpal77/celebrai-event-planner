# CelebrAI — Every Celebration, Thoughtfully Planned

**[Challenge 5] Celebration & Event Planner**

> *Create a GenAI-powered planning assistant that helps users organize weddings, birthdays, and community events with budgets, timelines, vendor checklists, and personalized ideas.*

CelebrAI is a production-grade, full-stack celebration planning assistant built with React, TypeScript, Tailwind CSS, Express, and Google Gemini (`gemini-3.8-flash`). CelebrAI empowers hosts to effortlessly organize complex celebrations—converting high-level event goals and guest constraints into deterministic budgets, chronological planning timelines, vendor requirement trackers, and deeply personalized celebration ideas.

---

## 1. User Journey Flow

CelebrAI introduces a public landing page as the first touchpoint, leading seamlessly into the planning application:

```
LANDING PAGE (Public showcase, How It Works, Features, AI Value)
    │
    ▼ [Plan My Event]
EVENT CREATION (Structured parameters, budget, guest count, dietary, accessibility)
    │
    ▼ [Generate Plan with Gemini 3.8 Flash]
AI-GENERATED PLAN (Concept statement, executive overview, tips)
    │
    ▼
APPLICATION DASHBOARD (Full management suite: Budgets, Timelines, Vendors, Ideas, Schedule)
```

---

## 2. System Architecture

CelebrAI follows a decoupled full-stack architecture where sensitive intelligence and API keys are strictly guarded server-side:

```
┌────────────────────────────────────────────────────────┐
│                   Client (Browser)                     │
│  - React 19 + TypeScript + Tailwind CSS               │
│  - Deterministic Math Engine (Budgets & Allocations)   │
│  - localStorage Persistence Layer                      │
│  - Accessible Keyboard Navigation & WCAG AA UI         │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP REST (JSON)
                           ▼
┌────────────────────────────────────────────────────────┐
│               Server (Express / Node.js)               │
│  - Secure Secret Management (process.env.GEMINI_API_KEY)│
│  - Strict Payload Validation & Schema Sanitization     │
│  - Rate Limiting & DoS Protection (1MB body limits)    │
│  - Deterministic Offline Fallback Plan Engine          │
└──────────────────────────┬─────────────────────────────┘
                           │ Google GenAI TypeScript SDK
                           ▼
┌────────────────────────────────────────────────────────┐
│               Google Gemini AI Layer                   │
│  - Model: gemini-3.8-flash                             │
│  - User-Agent: aistudio-build                          │
│  - Structured JSON Schema (responseSchema)             │
│  - Strict Type Enforcement & Safety Guardrails         │
└────────────────────────────────────────────────────────┘
```

---

## 2. Agentic Threat Modeling (5 Threat Zones)

In accordance with production security directives, CelebrAI was engineered under structured scenario-driven threat modeling:

| Threat Zone | Identified Attack Vector | Countermeasure & Implementation |
| :--- | :--- | :--- |
| **1. Input Surfaces** | Malicious injection payloads, oversized inputs, or prototype tampering in event names, locations, and special requirements. | Strict payload length caps (event name $\le 100$ characters, budget $>0$, guests $1$ to $50,000$), strict type checking on Express backend before processing, and safe text-node React rendering. |
| **2. Planning & Reasoning** | Prompt injection attempting to override system instructions or leak underlying AI prompt configurations. | Separation of system instructions (`systemInstruction`) from user parameters, explicit JSON schema constraints (`responseSchema`), and post-generation data sanitization. |
| **3. Tool Execution** | SSRF or arbitrary dynamic code execution risks via dynamic templates. | CelebrAI uses pure structured JSON outputs; arithmetic (budget sums, percentages, progress rates) is executed strictly via deterministic TypeScript utilities, never dynamic code eval. |
| **4. Memory & State** | Corrupted or malformed browser `localStorage` causing application crash or hydration loops. | Type-safe JSON deserialization wrapped in defensive `try/catch` fallbacks; fallback to in-memory defaults if storage is unavailable. |
| **5. Inter-System Comm.** | Client-side API key leakage, header sniffing, or token exposure. | Zero API keys exposed to browser bundles. Gemini API key is accessed exclusively via server-side `process.env.GEMINI_API_KEY`. |

---

## 3. Core Challenge 5 Features

CelebrAI directly satisfies the four primary requirements of Challenge 5:

1. **Budgets**:
   - Total budget, allocated budget, remaining uncommitted balance, and percentage allocated.
   - Native Indian Rupee formatting (e.g., `₹25,000`).
   - Category breakdowns with dynamic add, edit, and delete controls.
   - Real-time arithmetic recalculation in deterministic TypeScript code.
   - Overbudget alert banner when allocations exceed total budget.
   - Transparent disclaimer: *"Estimated cost — CelebrAI is a planning assistant, not a booking platform."*

2. **Timelines**:
   - Chronological planning milestones leading up to the celebration date.
   - Priority tagging (High, Medium, Low) and status tracking (Completed / Pending).
   - Complete/reopen toggle, inline editing, and custom task creation.
   - Adapts to event dates and handles past dates gracefully (`X days past due` without crashing).

3. **Vendor Checklists**:
   - Category-specific vendor requirements (Venue, Catering, Decor, Photography, AV, Entertainment).
   - Planning status pipeline: `To Contact`, `Contacted`, `Shortlisted`, `Booked / Confirmed`.
   - Editable vendor notes for quotes, contacts, and milestones.
   - Explicit planning disclaimer: statuses reflect host checklist only.

4. **Personalized Ideas**:
   - Creative concepts grounded in guest count, budget, location, theme, and dietary needs.
   - Covers Theme, Decor, Food & Dining, Entertainment, Activities & Games, Guest Experience, Invitations, and Photography.
   - Every idea features an explicit **"Why it fits your celebration"** justification.
   - **Regenerate Ideas** action that requests fresh concepts while preserving overall event context.

5. **Event-Day Itinerary**:
   - Dedicated run-of-show schedule from vendor load-in to guest arrival, dining, speeches, and farewell.
   - Interactive checkbox completion, inline time/activity editing, and custom slot creation.

---

## 4. Google Cloud Setup & Secret Manager

### Prerequisites
- Node.js 20+
- Google Cloud Project with Cloud Run & Gemini API enabled.
- `gcloud` CLI installed and authenticated.

### Secret Manager Configuration
To securely store and expose the Gemini API key to Cloud Run without hardcoding:

```bash
# 1. Create the secret
gcloud secrets create GEMINI_API_KEY \
  --replication-policy="automatic"

# 2. Add secret version with your Gemini API key
echo -n "YOUR_GEMINI_API_KEY" | \
  gcloud secrets versions add GEMINI_API_KEY \
  --data-file=-

# 3. Grant the Cloud Run runtime service account permission to access the secret
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## 5. Cloud Run Deployment

Deploy CelebrAI as a containerized service with the required challenge label:

```bash
# 1. Build and deploy container to Cloud Run
gcloud run deploy celebrai \
  --source . \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --set-secrets=GEMINI_API_KEY=GEMINI_API_KEY:latest \
  --port 3000

# 2. Apply the required Challenge verification label
gcloud run services update celebrai \
  --update-labels=dev-tutorial=cloud-run-ai-challenge \
  --region asia-southeast1
```

---

## 6. Functional Verification Walkthrough

The application has been verified against the hackathon benchmark scenario:

| Step | Action | Expected Result | Verified |
| :--- | :--- | :--- | :---: |
| 1 | Open Dashboard | Benchmark event (Birthday Celebration, 50 guests, ₹25,000) displays with KPI cards. | YES |
| 2 | Review Budget Allocation | Total budget (`₹25,000`), allocated (`₹25,000`), remaining (`₹0`) calculated deterministically. | YES |
| 3 | Edit Expense Category | Change Food allocation to `₹12,000`. Overbudget warning displays immediately. | YES |
| 4 | Add Expense Category | Add custom category "Traditional Drummers" (`₹2,000`). Totals update. | YES |
| 5 | Complete Task | Mark venue checklist task as completed. Task counter updates to `2/5 (40%)`. | YES |
| 6 | Change Vendor Status | Update caterer status to `Booked`. Counter reflects updated pipeline. | YES |
| 7 | Add Vendor Notes | Input phone number and tasting date. Notes persist immediately. | YES |
| 8 | Regenerate Ideas | Click "Regenerate Ideas". Fresh concepts load with "Why it fits" justifications. | YES |
| 9 | Create New Event | Open modal, submit Wedding (120 guests, ₹3,50,000). Plan generates via Gemini. | YES |
| 10 | Browser Refresh | Refresh page. All customized budgets, tasks, vendors, and ideas remain saved. | YES |

---

## 7. License & Compliance
CelebrAI is developed for the Google Cloud Run & AI Studio Challenge 5. All generated costs are designated as planning approximations.
