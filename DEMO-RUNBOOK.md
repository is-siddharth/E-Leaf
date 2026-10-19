# E-Leaf demonstration runbook

## The story to tell

**Join as a Leaf. Learn with people. Grow through participation. If the evolving readiness assessment supports it, request review. An administrator makes the final decision and assigns teaching subjects. A Tree keeps the Leaf identity.**

## Suggested walkthrough

1. Open the public page and explain the learning cycle briefly.
2. Select **Join E-Leaf**. For the most reliable presentation, choose **Continue as demo user**; it needs no email and works without Supabase authentication. You can also use a real Supabase account.
3. Complete the conversational learning-profile setup one prompt at a time. Choose Institutional or Global; Institutional asks college and course, then year/semester, optional roll number, and interests. Global skips college details. The role picker starts with Leaf; Tree is unavailable until approval.
4. In Leaf mode, open a lesson and use its learning action, share a note, and help in the community. These are illustrative demo signals, not the production qualification rubric.
5. Open **Journey**. Explain that exact criteria are not exposed as a fixed checklist and that the visible state is a demonstration of an adaptive assessment concept.
6. When the state becomes **Ready to request review**, select **Submit for review**.
7. From the pending-review panel, open **View review queue (demo)**. Select at least one subject and approve or decline the candidate.
8. After approval, switch to Tree. The Journey tab should say the Tree capability is active and offer the teaching space—not ask the user to “Enter Tree” again. Show the warmer earth palette and approved subject scope.
9. Switch back to Leaf to reinforce the principle: **A Tree is still a Leaf.**

## Dashboard layout notes

- Leaf and Tree now share a reference-inspired workspace: compact top bar, persistent left navigation on desktop, clear page heading, subject cards, and a small set of contextual shortcuts.
- Leaf uses the forest-green/sage palette and learning-first actions. Tree uses the warm earthy palette and teaching-first actions. The card structure, spacing, and navigation patterns remain consistent.
- Primary navigation is intentionally limited to Home, Learn/Teach, Community, and Journey. Secondary destinations remain reachable from relevant workspaces.
- On mobile, the sidebar collapses and primary navigation becomes a floating glass-style bottom bar. Check that it does not cover the last content or primary action. The growth dock is hidden on mobile to reduce overlap.
- Subject cards use sample content. Tree subject cards are filtered against approved subjects when assignments exist; if none are assigned, the dashboard clearly directs the Tree to its teaching workspace.
- Onboarding is one question per step with Back, Continue, and optional Skip controls.

## Demo limitations to state accurately

- Supabase handles real-account authentication in this build. The no-email demo user is a separate local-only session and does not authenticate with Supabase.
- Demo learning progress is reset when a new demo session starts. Profile details and photo edits in demo mode are temporary and are cleared when that session ends.
- Real-account profile fields and the selected photo preview are currently stored in this browser, not written to a Supabase profile table or Storage bucket. The photo is a local preview; production photo persistence requires Supabase Storage and access policies.
- Learning records are sample content.
- Readiness signals, the administrator review flow, review decisions, and subject assignments are simulated in this browser using local storage.
- The review page is a presentation-only simulation, not a secure administrator interface. It is not connected to a multi-user review queue or production authorization rules.
- A production ML model that learns from live student behaviour is not implemented by this UI build. The interface demonstrates the intended product workflow, not a deployed model.
- Do not describe sample sessions or actions as real backend writes.

## Run locally

From the `E-Leaf V2` folder:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

The Supabase browser client is loaded from the existing CDN configuration. A network connection is required for authentication.

## Rehearsal checklist

- [ ] Test **Continue as demo user** with the network disconnected or Supabase unavailable.
- [ ] Check the Leaf home at desktop width: sidebar, subject cards, contextual shortcuts, and growth status.
- [ ] Switch to approved Tree mode and check the same layout with earthy colors and teaching actions.
- [ ] Check desktop widths around 1024px and 1440px, then mobile widths 320px, 375px, and 430px.
- [ ] Confirm that subject cards and shortcuts navigate to their intended destinations.
- [ ] Confirm the demo user begins at zero Leaf-to-Tree progress after logging out and starting a new demo session.
- [ ] Complete onboarding and edit the profile/photo preview.
- [ ] Test real Supabase sign-in with the prepared account if using it in the presentation.
- [ ] Confirm the Supabase project is reachable and email confirmation requirements are understood.
- [ ] Confirm the account starts in Leaf mode and Tree is not selectable.
- [ ] Complete the illustrative activities and submit the review request.
- [ ] Approve at least one teaching subject and verify the Tree view.
- [ ] Test switching back to Leaf and logging out.
- [ ] Rehearse at the screen resolution you will use in the interview.
- [ ] Test mobile widths (320, 375, 390, and 430 px), bottom navigation, profile modal, onboarding modal, and page bottoms for overlap/cropping.
- [ ] Keep a backup copy of this ZIP and a fallback explanation if network authentication is unavailable.
