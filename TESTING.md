# CelebrAI Testing & Verification

## 1. Testing Overview

CelebrAI combines static analysis, backend API verification, deterministic logic validation, and structured manual walkthroughs to ensure reliability across all event planning features.

Because this project is a lightweight, full-stack application (React SPA on Vite + Express backend), testing focuses on:
- Static type safety and build verification
- Server-side request validation and payload limits
- Robustness of Gemini 3.8 Flash integration with deterministic fallbacks
- Client-side persistence and calculation accuracy
- Resolution of iframe-specific development server constraints

---

## 2. Build and Static Checks

| Check | Tool / Command | Result |
|-------|----------------|--------|
| TypeScript Compilation | `npx tsc --noEmit` | Passed with 0 errors across frontend and backend codebase. |
| Production Build | `npm run build` (`vite build`) | Passed cleanly. Bundles client assets into `dist/` with zero missing modules or unhandled imports. |
| Production Server Execution | `node server.ts` | Server binds successfully to `0.0.0.0:3000` with static asset serving and API routing. |
| CSS & Styling Compilation | `@tailwindcss/vite` | Verified that all Tailwind utility classes and theme tokens compile into the final stylesheet without parser errors. |

---

## 3. Backend/API Verification

Backend endpoints were verified through direct HTTP requests, integration checks, and boundary payload testing.

### `GET /api/health`
- **Method:** `GET`
- **Verification:** Sent HTTP GET request to verify server status.
- **Observed Response:**
  ```json
  {
    "status": "ok",
    "aiConfigured": true,
    "timestamp": "2026-10-28T07:54:37.370Z"
  }
  ```
- **Validation:** Confirms server is running and `GEMINI_API_KEY` is detected.

### `POST /api/plan/generate`
- **Method:** `POST`
- **Valid Payload Verification:**
  - Sent sample event parameters (wedding, birthday, community, custom).
  - Verified structured JSON output containing: `eventOverview`, `personalizedConcept`, `budgetCategories`, `tasks`, `vendors`, `ideas`, `eventDaySchedule`, and `practicalTips`.
  - Confirmed all financial calculations match the user's total budget.
- **Request Validation & Boundary Checks:**
  - Missing event name: Returns `400 Bad Request` (`Event name is required and must be under 120 characters`).
  - Name exceeding 120 characters: Returns `400 Bad Request`.
  - Invalid guest count (0, negative, >50,000): Returns `400 Bad Request`.
  - Invalid budget (<100 or non-numeric): Returns `400 Bad Request`.
  - Non-object JSON body: Returns `400 Bad Request`.
- **Gemini Generation & Resilience:**
  - Generates realistic, contextual planning data matching event specifications.
  - Enforces schema matching via `@google/genai` `responseSchema` and `responseMimeType: "application/json"`.
  - Clamps percentages to `[0, 100]` and ensures non-negative amounts.
- **Fallback Behavior:**
  - When Gemini API key is unset, invalid, or experiencing temporary upstream errors (e.g., 429/503), the server falls back immediately to `generateDeterministicPlan()`.
  - Returns a realistic, mathematically balanced plan tagged with `mode: "demo"`.
  - Confirmed that invalid or missing `eventDate` falls back cleanly without `RangeError: Invalid time value` crashes.

### `POST /api/plan/regenerate-ideas`
- **Method:** `POST`
- **Verification:** Generates 4 to 6 fresh, diverse celebration concepts tailored to event type, budget, and guest count.
- **Fallback Verification:** If upstream AI call fails, serves curated high-quality celebration ideas without throwing 500 errors to the client.

### Request Body & Payload Limits
- Verified `express.json({ limit: '1mb' })` and `express.urlencoded({ limit: '1mb' })` reject payloads exceeding 1MB to prevent memory exhaustion.

---

## 4. Functional Verification

Client-side user interactions and planning workflows were verified through structured manual walkthroughs.

### Landing Page & Navigation
- **Public Entry Screen:** Verified the application opens directly to the public landing page with brand tagline, value proposition, and feature overviews.
- **Call-to-Action:** Verified "Plan My Celebration" and "Plan an Event" open the event creation modal.
- **Existing Event Navigation:** Verified "Open Planning Workspace" allows users with stored plans to enter the planning dashboard.
- **Header Return:** Verified "Return to Home" seamlessly switches back to the public landing page.

### Event Setup & Validation
- **Form Fields:** Verified inputs for Event Name, Event Type, Date, Location, Guest Count, Total Budget, Currency, Theme Preferences, Dietary Requirements, Accessibility, Priorities, and Special Requirements.
- **Client-Side Validation:** Empty event name, zero guest count, or negative budget prevent submission and display inline errors.
- **Submission State:** Verified loading spinner, disabling of submit buttons, and descriptive loading status while the plan is generating.
- **Retry Mechanism:** When an error occurs, the modal displays the error clearly and provides a "Retry Generation" action without wiping entered data.

### Smart Budget Management
- **Category Allocation:** Verified automatic breakdown across categories summing to 100%.
- **Live Editing:** Verified that modifying individual category amounts updates percentage calculations in real time.
- **Over-Budget Warning:** Verified that when allocated amounts exceed total budget, a visible over-budget banner and warning badge appear with the overage amount.
- **Currency Formatting:** Verified consistent display across INR, USD, EUR, GBP, AUD, and CAD.

### AI Timeline & Tasks
- **Task Sorting & Due Dates:** Verified that tasks are generated chronologically leading up to the celebration date.
- **Status Toggle:** Verified that clicking status updates tasks between Pending, In Progress, and Completed.
- **Priority Indicators:** Verified color-coded High, Medium, and Low priority badges.
- **Past-Due Detection:** Verified that tasks with due dates prior to the current date display a past-due badge.

### Vendor Checklist
- **Vendor Tracking:** Verified pre-populated vendor categories with estimated costs and operational notes.
- **Status Workflow:** Verified changing status between To Contact, Shortlisted, Booked, and Paid.
- **Notes Editing:** Verified notes field updates and persists per vendor.

### Personalized Ideas
- **Category Badges:** Verified tags for theme, decor, food, entertainment, activities, guest experience, invitations, and photography.
- **Reasoning Display:** Verified that each idea explains specifically why it fits the user's budget, venue, and guest count.
- **Regenerate Ideas:** Verified that clicking "Regenerate Ideas" triggers the API and replaces the list with fresh suggestions while keeping the rest of the plan intact.

### Event Day Run Sheet
- **Chronological Schedule:** Verified that setup, arrival, main ceremony, dining, and pack-down times display in order.
- **Host Checklist:** Verified completion checkboxes for day-of tasks.
- **Host Tips:** Verified practical, non-generic coordination tips for the event host.

### Browser Persistence
- **Storage:** Verified that all event modifications, created events, and active event IDs persist in browser `localStorage`.
- **Reload Survival:** Reloading the browser preserves the active event, modified tasks, budget overrides, and vendor statuses.
- **Sample Data Controls:** Verified ability to reset or clear demo data from Event Settings.

---

## 5. Security Verification

Security practices were reviewed against OWASP recommendations for web and LLM applications.

| Security Control | Implementation Check | Status |
|------------------|----------------------|--------|
| Zero Client-Side Secrets | Verified `GEMINI_API_KEY` is accessed solely inside `server.ts` via `process.env`. No API keys exist in client code, bundles, or HTML. | Verified |
| Environment Variable Hygiene | `.env.example` contains variable names only (`GEMINI_API_KEY=`). No credentials are committed to the repository. | Verified |
| Server-Side Input Validation | Payload validation enforces non-empty strings (<=120 chars for name), positive numeric ranges for budget and guest count. | Verified |
| Clamped Output Sanitization | AI-generated category percentages are clamped between 0 and 100. Amounts are sanitized against negative numbers and non-numeric values. | Verified |
| Payload Size Limits | Body parser middleware limits incoming JSON and URL-encoded data to 1MB, preventing memory exhaustion attacks. | Verified |
| Safe Client Error Messages | Backend catches all generation exceptions and returns sanitized user-facing messages, preventing stack trace or system path leakage. | Verified |
| No Insecure Dependencies | No unmaintained, vulnerable packages or unpinned third-party script tags. | Verified |

---

## 6. HMR / Development Environment Verification

During development in iframe-sandboxed preview environments (such as cloud development web previews), standard Vite Hot Module Replacement (HMR) attempts WebSocket connections to development ports, which can cause recurring `WebSocket closed without opened` unhandled rejections and console errors.

### Root Cause
1. Vite's default dev server injects `/@vite/client` into `index.html`.
2. Vite's CSS plugin generates modules that import `/@vite/client` for style updates (`updateStyle`).
3. In sandboxed preview iframes, WebSocket connections to local ports fail.

### Implementation Fix
1. **`vite.config.ts` Plugin (`disableHmrPlugin`):**
   - Activated when `DISABLE_HMR=true`.
   - Uses `transformIndexHtml` to strip `<script type="module" src="/@vite/client"></script>` from entry HTML.
   - Implements `resolveId` and `load` hooks to resolve `/@vite/client` and `@vite/client` to an inert virtual module (`\0stub-vite-client`).
   - The virtual module exports stub implementations of `createHotContext`, `updateStyle`, `removeStyle`, `ErrorOverlay`, and `injectQuery` without opening any WebSocket connections.
2. **`server.ts` Fallback Handler:**
   - Intercepts requests for `/@vite/client` and `/@vite/client.mjs` directly in Express to serve the inert client stub.
   - Configures Vite server options with `hmr: false`, `ws: false`, and `watch: null`.

### Verification
- Verified `/` loads without injecting the HMR script.
- Verified `/src/index.css` loads with clean, valid JavaScript that uses the inert `updateStyle` stub.
- Verified zero WebSocket connection attempts in the browser console.
- Verified zero `[vite] failed to connect to websocket` errors.

---

## 7. Production Verification

The CelebrAI application has been deployed to Render and manually verified in a public production environment.

- **Deployment URL:** [https://celebrai-event-planner-4f9e.onrender.com/](https://celebrai-event-planner-4f9e.onrender.com/)
- **Live Checks Performed:**
  - Verified public landing page renders properly with responsive typography and images.
  - Verified navigation from landing page to "Plan My Celebration".
  - Verified complete event creation submission with live Gemini generation.
  - Verified structured budget, timeline, vendors, and ideas render accurately.
  - Verified mobile and desktop responsive views.
  - Verified tab navigation across Dashboard, Plan Overview, Budget, Timeline, Vendors, Ideas, Schedule, and Settings.

---

## 8. Known Testing Limitations

For full transparency, the following limitations apply to the current testing scope:

- **No Automated E2E Test Suite:** The repository currently does not include Cypress, Playwright, or Selenium automated browser test suites. UI workflows were verified through manual walkthroughs.
- **No Headless Unit Test Runner:** No `jest` or `vitest` test runner is currently defined in `package.json`. Business logic testing was performed via TypeScript static analysis and API test scripts.
- **Dynamic AI Response Variance:** Because Gemini 3.8 Flash generates dynamic planning content, exact task titles, vendor descriptions, and creative concepts will vary between runs, although structural conformity to the JSON schema is enforced.
- **Single-User Local Persistence:** Event persistence is currently client-side (`localStorage`), meaning cross-device synchronization and multi-user collaboration are not tested or supported.
- **No Large-Scale Load Testing:** Formal stress testing or high-concurrency load testing (e.g., k6, Locust) has not been performed on the hosting infrastructure.

---

## 9. Verification Summary

| Area | Verification Method | Status |
|------|---------------------|--------|
| TypeScript Type Checking | `tsc --noEmit` static analysis | Verified |
| Production Build Compilation | `npm run build` (`vite build`) | Verified |
| Dev Server Startup | Express server initialization on port 3000 | Verified |
| Health Check Endpoint (`/api/health`) | HTTP GET request inspection | Verified |
| Plan Generation Endpoint (`/api/plan/generate`) | HTTP POST with valid & invalid payloads | Verified |
| Ideas Regeneration Endpoint (`/api/plan/regenerate-ideas`) | HTTP POST request inspection | Verified |
| Deterministic Fallback Planner | Forced offline mode verification | Verified |
| API Input Validation & Sanitization | Range, type, and length boundary tests | Verified |
| Request Size Limiting | 1MB payload enforcement check | Verified |
| Secret Management | Server-only environment variable audit | Verified |
| Public Landing Page Flow | Manual interaction walkthrough | Manually Verified |
| Event Creation Modal | Form input & validation walkthrough | Manually Verified |
| Smart Budget Allocation & Over-Budget Warning | Real-time calculation walkthrough | Manually Verified |
| Timeline Management & Priority Filtering | Task status toggle walkthrough | Manually Verified |
| Vendor Checklist & Notes | Status update walkthrough | Manually Verified |
| Personalized Ideas & Regeneration | Regenerate button interaction check | Manually Verified |
| Event Day Schedule & Host Tips | Checkbox completion walkthrough | Manually Verified |
| Client-Side Persistence (`localStorage`) | Browser refresh & state restore check | Manually Verified |
| HMR / Dev Preview WebSocket Fix | HTTP inspection of `/@vite/client` stub | Verified |
| Live Production Deployment | Render live site manual walkthrough | Manually Verified |
| Automated E2E Browser Testing | End-to-end framework (Cypress/Playwright) | Not Automated |
| Automated Unit Test Suite | Headless unit test runner (Jest/Vitest) | Not Automated |
| Concurrency & Load Testing | High-concurrency stress testing | Not Applicable |
