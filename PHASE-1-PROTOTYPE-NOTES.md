# E-Leaf Phase 1 Prototype

## Starting points
- Functional foundation: `E-Leaf V2 - Shared Leaf and Tree Dashboard` archive supplied earlier in this project.
- Visual reference: `E-Leaf Learning Ecosystem` Figma React export supplied for this phase.
- The React export is used as a design reference. The working app remains the existing vanilla HTML, CSS, and JavaScript application so its existing flows and Supabase authentication integration are preserved.

## Phase 1 changes
- Added a Figma-informed, role-specific next-action panel to the shared dashboard.
- Leaf dashboard prioritizes continuing a learning journey, with a clear next topic and a compact code example.
- Tree dashboard prioritizes a learner question and a direct path to Community, while retaining approved teaching subjects and teaching shortcuts.
- Kept the same page hierarchy, subject card system, spacing, and navigation structure across Leaf and Tree. Existing role and world color tokens continue to distinguish context.
- Replaced dashboard arrow glyphs with inline SVG icons from the existing icon helper.
- Removed decorative Unicode particles from the authenticated workspace and kept the existing ambient background treatment.
- Replaced the decorative star on the demo entry action with an inline SVG leaf mark.
- Added responsive styling for the next-action panel, including a single-column mobile layout and full-width mobile action.

## Existing flows intentionally preserved
- Public landing page and auth dialog.
- Supabase sign-up, sign-in, and sign-out wiring.
- Demo-user flow and conversational onboarding.
- Global and Institutional context selection.
- Leaf and Tree mode gating.
- Journey signals, simulated review queue, and simulated subject assignment.
- Existing subject, learning, community, profile, and logout routes.

## Data and security boundaries
- Learning content is illustrative sample content.
- The no-email demo account is local-only.
- Profile edits are browser-local in this prototype; the profile table and persistent photo storage are not implemented here.
- Growth signals, review submission, review decisions, and teaching subject assignments are simulated with browser local storage. The review queue is not a production authorization boundary.
- No deployed machine-learning readiness model is included.

## QA performed
- JavaScript syntax validation with `node --check`.
- HTML parsing and duplicate-ID scan.
- Local asset existence scan.
- CSS parser scan.
- Icon markup scan for unresolved `$(icon` / `${icon(` patterns.
- Static route and responsive-rule checks for the dashboard and mobile breakpoints.
- Archive integrity check after packaging.

## QA limitation
Automated Chromium navigation was blocked by the execution environment (`ERR_BLOCKED_BY_ADMINISTRATOR`) for both local HTTP and file URLs. As a result, this delivery does not claim a successful interactive browser walkthrough or visual-device verification. The user should perform the final hands-on design test, as planned.

## Run locally
From the `E-Leaf V2` directory:

```bash
python -m http.server 8000
```

Open `http://localhost:8000` in a browser. Choose **Join E-Leaf**, then **Continue as demo user** to test without creating an account. Supabase authentication requires network access.
