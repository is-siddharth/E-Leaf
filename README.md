# E-Leaf UX Transformation v3

This build refines the approved product foundation into four coherent experiences:

- Institutional Leaf: bounded college learning space
- Institutional Tree: college teaching capability
- Global Leaf: open learning and discovery
- Global Tree: global teaching capability

## Repository structure

The project keeps the modular GitHub structure:

- `index.html`
- `assets/css/main.css`
- `assets/js/app.js`
- `assets/js/state.js`
- `assets/js/config.js`
- `assets/js/mockData.js`
- `assets/js/utils.js`
- `assets/js/supabaseClient.js`
- `supabase/migrations/`

## Important product behavior

Tree qualification remains a hidden three-action prototype rule. The UI does not expose it as a checklist or recipe. Growth is stored independently for Global and Institutional contexts. Becoming a Tree in one space does not unlock Tree in the other.

Institutional membership is treated as admin-controlled. The prototype uses one demo institution membership rather than asking the learner to choose a college.

## Validation

Static checks performed for this build:

- JavaScript syntax check
- duplicate HTML ID check
- HTML parse check
- local CSS/JS/migration existence checks
- local HTTP 200 checks for the application and modular assets

Browser rendering is not claimed as validated because Chromium in the execution environment has not completed reliably.
