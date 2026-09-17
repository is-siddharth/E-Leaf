# E-Leaf

## Come as a learner. Grow into a teacher.

E-Leaf is a learning ecosystem built around a simple idea:

**You come as a learner, and you become a teacher by helping others learn.**

E-Leaf is designed to make learning more participatory. A person does not simply consume courses and leave. They learn from others, share what they understand, help other learners, and can eventually develop the capability to teach.

The product is intended to support both **Global learning** and **institutional education** while keeping those contexts distinct.

Every person begins as a **Leaf**.

A Leaf learns from others, takes classes, shares useful discoveries, asks questions, participates in discussion, and helps other learners.

Over time, meaningful participation and a more rigorous qualification process can open the **Tree** capability.

A Tree can teach, share knowledge, support Leaves, and still return to Leaf mode whenever they need to learn.

---

# The central model

E-Leaf deliberately separates several concepts that can otherwise become confused.

| Concept | Meaning |
|---|---|
| **Global / Institutional** | The world or context in which a person is participating |
| **Leaf / Tree** | The person's learning and teaching capability/mode |
| **Admin roles** | Authorization roles used to manage the platform or an institution |
| **Membership** | The relationship between a person and an institution |
| **Authentication** | The identity and account used to sign in |

These are different dimensions of the system.

A person should not need a separate account to become a Tree. A Tree is a capability of the same E-Leaf identity.

Likewise, being an Institution Admin does not make someone a Tree. Admin is an authorization role, not a learning mode.

---

# The two E-Leaf worlds

E-Leaf is intended to operate in two connected but distinct contexts:

```text
                         E-LEAF
                            │
              ┌─────────────┴─────────────┐
              │                           │
       GLOBAL WORLD             INSTITUTIONAL WORLD
              │                           │
      Global learning               Controlled academic
         ecosystem                     environments
              │                           │
      Trees worldwide              College / Institution
      Courses & classes             Curriculum & subjects
      Notes & questions             Students & Trees
      Discussion                    Classes & attendance
```

A person's identity can participate in both worlds without forcing the two data contexts to become the same thing.

## Global World

The Global World is E-Leaf as the open learning ecosystem beyond the boundaries of any one institution.

A person joins E-Leaf primarily to learn beyond the boundaries of their institution. They can explore multiple subjects, attend courses and classes taught by Trees from around the world, read and plant useful notes, ask questions, answer other learners, and participate in discussions.

A person does not have to belong to a college to use this part of E-Leaf.

The Global World is intended to support:

- learning across multiple subjects,
- courses and lessons from qualified Trees,
- live learning sessions,
- notes and knowledge sharing,
- questions and answers,
- discussion and peer learning,
- discovering Trees and their teaching areas,
- and eventually becoming a qualified Tree.

The Global World should feel like a **social learning ecosystem**, not a conventional social network. Popularity, follower counts, likes, XP, leaderboards, and engagement-maximizing mechanics should not define success.

## Institutional World

The Institutional World is the controlled academic environment inside E-Leaf.

A college, university, school, training organization, or other institution can operate its own environment inside E-Leaf. The institution controls its relevant members, curriculum, subjects, classes, academic structure, and institutional teaching relationships.

For example:

```text
E-Leaf
│
├── College A
│   ├── Students
│   ├── Institutional Trees
│   ├── Curriculum
│   ├── Subjects
│   └── Classes
│
└── College B
    ├── Students
    ├── Institutional Trees
    ├── Curriculum
    ├── Subjects
    └── Classes
```

College A's data must not be visible to College B simply because both institutions use E-Leaf.

An institution therefore represents a first-class tenant in the backend, with authorization and database policies enforcing the boundary.

A person may also belong to more than one institution. This is why institutional membership should be modeled as a relationship rather than placing a single `college_id` on the user's profile.

---

# One E-Leaf identity, multiple contexts

The intended identity model is:

```text
                     E-Leaf Identity
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
 Global World   Global Tree       Institution
                    capability        memberships
                                           │
                              ┌────────────┴────────────┐
                              ▼                         ▼
                         College A                 College B
```

The same person could therefore be:

- a Leaf in the Global World,
- a globally qualified Tree for specific teaching areas,
- a student at College A,
- a Tree provisioned by College B,
- or an administrator for an institution,

depending on their capabilities and memberships.

These relationships must not be collapsed into one generic role field.

---

# Leaf and Tree

The two terms are intentionally simple:

| E-Leaf concept | Meaning |
|---|---|
| 🍃 **Leaf** | Learner |
| 🌳 **Tree** | Teacher with authorized teaching capability |

The terminology is part of the product's identity, not merely decoration.

### Leaf

Everyone begins as a Leaf.

A Leaf can learn from Trees, attend classes, explore notes, ask questions, participate in discussions, and help other learners.

### Tree

A Tree is a learner who has developed an authorized capability to teach.

A Tree can create or deliver approved learning experiences, share knowledge, support Leaves, and teach within the subject areas for which they are authorized.

A Tree is **not** a separate account.

A Tree is also not a permanent hierarchy above Leaves.

**A Tree is still a Leaf.**

A Tree can switch back to Leaf mode whenever they want to learn from another Tree.

---

# Learning should become contribution

The intended progression is:

**Learn → Share → Help → Teach → Learn again**

The progression is conceptual rather than a gamified level system.

A learner should gradually be able to:

1. understand something,
2. explain it clearly,
3. share something useful,
4. help another learner,
5. demonstrate teaching ability,
6. and eventually teach others responsibly.

The cycle has no real final step.

```text
                 ┌───────────────┐
                 │     LEARN     │
                 └───────┬───────┘
                         ↓
                 ┌───────────────┐
                 │     SHARE     │
                 └───────┬───────┘
                         ↓
                 ┌───────────────┐
                 │      HELP     │
                 └───────┬───────┘
                         ↓
                 ┌───────────────┐
                 │     TEACH     │
                 └───────┬───────┘
                         ↓
                 ┌───────────────┐
                 │     LEARN     │
                 └───────────────┘
```

---

# Becoming a Tree

Becoming a Tree is intentionally different in the Global and Institutional worlds.

## Current prototype qualification

The current prototype uses a simple three-condition model:

### 1. Learn

Attend at least one class from another Tree.

### 2. Share

Plant at least one useful note.

### 3. Help

Answer at least one question from another learner.

When all three conditions are complete, the prototype can unlock Tree capability.

This model is intentionally simple for the prototype. It demonstrates the product philosophy and state transitions without pretending to be the final qualification system.

## Intended production qualification

The production Global World should use a substantially more rigorous process.

The goal is not simply to reward activity. The goal is to determine whether someone is genuinely ready to take responsibility for teaching other people.

Potential evidence can include:

- sustained learning participation,
- quality and usefulness of shared notes,
- meaningful interactions with other learners,
- quality of answers and explanations,
- subject competence,
- consistency over time,
- teaching demonstrations or supervised mini-classes,
- an interview or review,
- and other evidence appropriate to the teaching area.

The exact thresholds should remain configurable by the backend rather than hard-coded into the interface.

### Eligibility is not the same as approval

A production system should distinguish between:

```text
Participation / evidence
          ↓
       Eligibility
          ↓
      Application
          ↓
   Review / interview
          ↓
 Teaching demonstration
          ↓
        Approval
          ↓
 Authorized Tree capability
```

Completing activity should therefore not automatically give someone unrestricted teaching authority.

### Teaching should be scoped

A global Tree should not automatically receive permission to teach every subject.

Tree capability should be associated with approved **subjects or teaching areas**.

This allows E-Leaf to control quality and responsibility as the platform grows.

---

# Global Trees and Institutional Trees

E-Leaf can support more than one origin for Tree capability.

## Global Tree

A Global Tree is reviewed and approved through E-Leaf's qualification process.

This Tree can teach within their approved Global World teaching areas and offer learning experiences to the wider E-Leaf community.

## Institutional Tree

An institution may provision or approve a Tree for its own academic environment.

For example, College A may select three people to act as Trees for its curriculum. Those permissions belong to the institution's context and do not automatically mean that E-Leaf has globally certified those people as Global Trees.

This distinction is important:

**Institutional approval and global E-Leaf qualification are not necessarily the same thing.**

A person can potentially have both.

---

# Teaching ecosystem

Once appropriately qualified and authorized, a Tree can participate in teaching workflows such as:

- creating courses,
- planning lessons,
- preparing teaching notes,
- publishing approved learning material,
- running live classes,
- delivering demo or supervised lectures,
- supporting learners,
- answering questions,
- and improving lessons based on learner needs.

Leaves can discover and join these learning experiences.

The production platform should use a controlled subject taxonomy so that Trees do not create an uncontrolled collection of duplicate or contradictory subject categories.

A Tree's teaching permissions should determine which subjects or teaching areas they can create content for.

---

# Institutional model

Institutions are first-class entities in the backend.

A simplified model is:

```text
Institution
    │
    ├── Memberships
    │      ├── Students
    │      ├── Teachers / Trees
    │      └── Administrators
    │
    ├── Curriculum
    │      └── Subjects
    │             └── Units / Chapters
    │
    ├── Classes
    │      ├── Schedule
    │      ├── Attendance
    │      └── Teaching assignments
    │
    └── Institutional content
           ├── Notes
           ├── Questions
           └── Learning resources
```

Institution-specific records should carry the appropriate institution relationship in the data model.

Database-level authorization must enforce that relationship.

The frontend must never be treated as the security boundary.

---

# Admin system

Administrators are separate from the Leaf/Tree learning model.

An admin role answers:

**What is this person authorized to manage?**

It does not answer:

**Is this person a learner or teacher?**

A person can therefore have an administrative role while also participating in E-Leaf as a Leaf or Tree where appropriate.

The initial planned administrative structure is:

## 1. Platform Owner / Super Admin

The highest-level E-Leaf administration layer.

Responsibilities can include:

- managing the overall E-Leaf platform,
- creating and managing institutions,
- platform-wide configuration,
- global governance,
- global Tree qualification and approval,
- global moderation,
- managing platform-level taxonomies,
- reviewing platform analytics,
- and managing other administrative roles and permissions.

This role operates across the E-Leaf platform rather than belonging to one college.

## 2. Institution Admin

An administrator responsible for an institution.

Responsibilities can include:

- managing the institution's members,
- managing institutional Trees,
- managing student access,
- managing institutional settings,
- overseeing institutional classes,
- and coordinating institutional operations.

The Institution Admin should only receive access to institutions for which they have an authorized membership.

## 3. Academic Admin

An administrator focused on the academic structure of an institution.

Responsibilities can include:

- curriculum management,
- subject management,
- academic programs,
- class structures,
- teaching assignments,
- academic schedules,
- and other academic configuration.

This separates academic control from general institution administration as the product grows.

## 4. Moderator

A role focused on community and content safety rather than institutional ownership.

Responsibilities can include:

- reviewing reported content,
- moderating notes and discussions,
- handling inappropriate questions or answers,
- reviewing community violations,
- and applying platform policies within the scope granted to the moderator.

Moderation permissions can be global or institution-scoped depending on the eventual authorization model.

### Admin permissions should remain granular

The first implementation may use a small number of broad admin roles, but the backend should be designed so permissions can become more granular.

For example:

```text
Role
  ↓
Permissions
  ├── manage_members
  ├── manage_curriculum
  ├── manage_subjects
  ├── manage_classes
  ├── manage_trees
  ├── moderate_content
  └── view_analytics
```

This avoids making the entire authorization system depend on one oversized `is_admin` flag.

---

# Identity, roles, capabilities, and memberships

The production data model should keep these concepts separate.

```text
User / Identity
│
├── Profile
│
├── Global capabilities
│   └── Tree teaching areas
│
├── Global participation
│
└── Institution memberships
    │
    ├── College A
    │   └── membership role / permissions
    │
    └── College B
        └── membership role / permissions
```

A user's current UI mode is a session/application state, not the entire authorization model.

For example, a user might have:

```text
Authenticated: yes
Global Tree: yes
Current mode: Leaf
College A membership: Student
College B membership: Academic Admin
```

Another person might have:

```text
Authenticated: yes
Global Tree: no
Current mode: Leaf
College A membership: Student
```

The application should derive what the person can see and do from the appropriate backend records and permissions.

---

# Authentication

Authentication answers **who the person is**.

The current prototype uses Supabase Auth with email/password authentication.

The intended flow is:

```text
Authentication
      ↓
Authenticated identity
      ↓
Load profile and capabilities
      ↓
Resolve available contexts / memberships
      ↓
Resolve available Leaf / Tree modes
      ↓
Enter the appropriate experience
```

Role or mode selection should not replace authentication.

The user first authenticates. The application then determines what capabilities and contexts are available to that identity.

The authentication screen should remain common to users regardless of whether they are already qualified as Trees.

---

# Authorization and data isolation

Authentication alone is not enough for E-Leaf.

The production system must distinguish:

- authentication,
- authorization,
- membership,
- capability,
- and current mode.

Supabase Row Level Security (RLS) should provide the database-level security boundary.

For institutional data, the important rule is:

**A user must only be able to access records for institutions and scopes for which their authenticated identity has permission.**

The frontend may hide another college's data, but that is not security. The database must enforce the restriction itself.

This is especially important when multiple colleges use the same E-Leaf installation.

### Auditability

Important administrative and authorization-sensitive actions should eventually produce audit records.

Examples include:

- granting institutional Tree capability,
- changing membership roles,
- modifying curriculum,
- approving or restricting teaching capability,
- moderating content,
- and other consequential administrative actions.

---

# Curriculum vision

E-Leaf can support structured academic learning without making the Global World dependent on one institution.

A possible institutional curriculum structure is:

```text
Institution
    ↓
Academic Year
    ↓
Program / Grade
    ↓
Subject
    ↓
Unit
    ↓
Chapter
    ↓
Learning activity
```

The exact hierarchy can evolve, but the important architectural principle is that institutional curriculum belongs to the institution that controls it.

The Global World can use the wider E-Leaf subject taxonomy and Tree teaching areas instead of inheriting a college's curriculum.

---

# Classes and attendance

Classes are a major bridge between learning and teaching.

A Leaf can learn from a Tree. A Tree can teach a class.

The production system should eventually maintain authoritative records for:

- class ownership,
- teaching assignments,
- schedules,
- enrollment,
- attendance,
- class status,
- and participation.

The prototype currently demonstrates the role-aware class experience and local activity model. Production attendance must be stored and authorized through the backend.

External meeting infrastructure such as Google Meet can later be integrated through secure backend services rather than exposing privileged credentials in the browser.

---

# Notes and knowledge sharing

A note can become part of the community's shared knowledge.

```text
Learn something
      ↓
Understand it
      ↓
Write it clearly
      ↓
Plant a note
      ↓
Someone else learns from it
```

Future production versions can add:

- stronger moderation,
- review workflows,
- file and PDF support,
- secure storage,
- search,
- quality controls,
- and institution-specific content policies.

The backend should remain the authority over ownership, visibility, moderation, and storage permissions.

---

# Questions and helping

Questions create another contribution pathway.

A Tree can ask a question. A Leaf can answer.

The value of an answer is that it helps another person move forward, not that it produces a competitive score.

This is central to E-Leaf:

**The learner gradually becomes useful to other learners.**

Production systems should eventually support ownership, moderation, answer quality, reporting, and appropriate institutional/global visibility through backend authorization.

---

# Recognition without competition

E-Leaf should recognize meaningful contribution without turning learning into a race.

Recognition can surface people who have recently:

- helped another learner,
- written a useful note,
- taught a class,
- answered questions,
- or otherwise contributed constructively.

The intended principle is:

**appreciation without competition.**

Avoid making XP, follower counts, popularity, rankings, or engagement volume the central measure of educational value.

---

# Product experience

E-Leaf should guide users rather than make them figure out what to do.

The interface should continually answer:

**What can I do now?**

A Leaf can:

- attend classes,
- explore notes,
- meet Trees,
- ask questions,
- participate in discussion,
- track learning progress,
- plant notes,
- and help other learners.

A Tree can:

- continue learning as a Leaf,
- teach within authorized areas,
- plan lessons,
- support students,
- create approved learning experiences,
- ask questions,
- receive help,
- and contribute to the wider community.

An administrator sees a different experience based on their authorization scope. Admin dashboards are separate from the Leaf/Tree learning dashboards.

---

# Design philosophy

The interface is intentionally:

- minimal,
- calm,
- personal,
- readable,
- responsive,
- consistent,
- and guidance-oriented.

E-Leaf should not look like a conventional gamified education application.

The Leaf and Tree metaphor should remain understandable and restrained. Animation should communicate transitions and state changes rather than exist only for decoration.

Mobile is a first-class experience, not simply a smaller desktop layout.

The product should maintain consistency in:

- language,
- typography,
- spacing,
- colors,
- interaction patterns,
- navigation,
- responsive behavior,
- and terminology.

The central relationship should remain clear:

**Leaf = Learner**

**Tree = Teacher**

---

# Backend roadmap

The recommended production sequence is:

```text
1. Authentication
        ↓
2. Institutions + memberships + authorization
        ↓
3. Curriculum and subjects
        ↓
4. Classes + enrollment + attendance
        ↓
5. Notes + storage + moderation
        ↓
6. Questions + answers
        ↓
7. Tree qualification + teaching areas
        ↓
8. Admin + moderation + analytics
        ↓
9. Notifications + search + discovery
```

The important architectural decision is to establish **identity, institutions, memberships, permissions, and data isolation before building a large institutional curriculum system**.

The backend should become authoritative for important product state rather than relying on browser-local UI state.

---

# Current prototype vs production target

The current project is a lightweight frontend prototype with a real Supabase authentication foundation.

### Currently demonstrated

- E-Leaf authentication flow,
- Leaf/Tree conceptual model,
- role-aware navigation,
- Leaf growth path,
- prototype Learn / Share / Help progression,
- Tree transition experience,
- classes,
- notes,
- questions and answers,
- discussion,
- recognition,
- responsive UI,
- and user-scoped prototype activity.

### Not yet fully implemented as the production backend

The following are part of the intended architecture rather than claims about the current prototype:

- institutions and institutional memberships,
- institution-scoped RLS,
- admin dashboards and permissions,
- complete curriculum management,
- production class enrollment and attendance,
- production content storage and moderation,
- global Tree application and review workflows,
- teaching-area authorization,
- institutional Tree provisioning,
- audit logging,
- production analytics,
- notifications,
- global search and discovery,
- and the complete production authorization model.

This distinction is intentional. The prototype demonstrates the experience while the backend architecture is developed in stages.

---

# Long-term product architecture

The high-level product model is:

```text
                              E-LEAF
                                 │
             ┌───────────────────┴───────────────────┐
             │                                       │
       GLOBAL WORLD                         INSTITUTIONAL WORLD
             │                                       │
       Global learning                         Institutions
          ecosystem                                  │
             │                             ┌─────────┴─────────┐
       ┌─────┼─────┐                       │                   │
       │     │     │                    College A           College B
       ▼     ▼     ▼                       │                   │
     Trees Courses Notes              Curriculum           Curriculum
       │     │     │                   Students             Students
       └─────┼─────┘                   Trees                 Trees
             │                         Classes               Classes
             ▼
       Questions / Help
             │
             ▼
       Tree qualification
             │
             ▼
       Teaching capability
```

The identity layer sits across these contexts:

```text
                           E-Leaf Identity
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
       Global use       Global Tree         Institution
                            capability          memberships
                                                    │
                                      ┌─────────────┼─────────────┐
                                      ▼             ▼             ▼
                                  College A     College B      ...
```

This architecture allows E-Leaf to be a global learning platform beyond any one institution while still supporting institutions as controlled environments inside the same ecosystem.

---

# What E-Leaf is trying to become

E-Leaf should not become just another course catalogue or just another college LMS.

It should become an environment where learning can naturally turn into contribution, and contribution can naturally turn into teaching.

The Global World provides the open learning ecosystem.

The Institutional World provides controlled academic environments.

Trees provide the teaching layer.

Administrators provide the governance and operational layer.

The identity system connects these experiences without confusing their permissions.

The result is one ecosystem with different contexts rather than several disconnected products.

---

# The simplest explanation

If someone understands only one thing about E-Leaf, it should be this:

> **Everyone comes as a Leaf.**
>
> **A Leaf learns.**
>
> **A Leaf shares.**
>
> **A Leaf helps.**
>
> **A Leaf can grow into a Tree.**
>
> **A Tree teaches.**
>
> **And every Tree can still return to being a Leaf.**
>
> **E-Leaf can support this journey both globally and inside institutions.**

**E-Leaf: Come as a learner. Grow into a teacher.**

## Global means beyond the institution

In E-Leaf, **Global** and **Institutional** describe two learning contexts, not two kinds of account.

- **Global** means learning from the wider E-Leaf world, beyond the boundaries of a person's institution. A learner can discover subjects, Trees, classes, notes, questions, and discussions from the broader community.
- **Institutional** means learning within an institution through its classmates, institutional Trees, curriculum, classes, and resources.

The same authenticated E-Leaf identity can participate in both contexts. Switching context changes the learning environment; it does not create another account.

The words **Leaf** and **Tree** remain separate from this context distinction: a person can be a Leaf or an authorized Tree in either context where the relevant capability exists.

## Demo qualification vs production qualification

The prototype intentionally uses a simple **three-action demo threshold** so the Leaf → Tree transition can be shown clearly in presentations:

1. **Learn** — attend a demo learning session from another Tree.
2. **Share** — plant a useful note in the demo library.
3. **Help** — help another learner through a useful conversation.

Completing the three actions reveals the Tree transition, changes the dashboard/navigation, and exposes the demo teaching space. This is **presentation behavior only**. It must not be treated as production certification.

Production Global Tree qualification remains a separate process involving evidence, eligibility, application, review, teaching demonstration, approval, and scoped teaching areas.

## V3.1 Demo UI: Global World

The prototype now includes an Global World without changing the existing Institutional World dashboard structure. Authentication remains the existing Supabase flow. After authentication, the user chooses a world, then chooses their Global Learner/Teacher path.

### Current demo flow

```text
Authenticate
    ↓
Choose E-Leaf World
    ├── Global
    │      ↓
    │  Global profile
    │      ↓
    │  Learner / Teacher
    │      ↓
    │  Global dashboard
    │
    └── Institutional
           ↓
       Existing institutional profile/dashboard
```

### Global World

The Global World has a deliberately different UI language from the Institutional World. It is wider, more open, discovery-oriented, and community-focused rather than curriculum-oriented. Its primary concepts are:

- Home
- Explore
- Learn
- Library
- Community
- Trees
- Journey

The Global Tree experience adds teaching without turning the user into a separate account or a separate product. A Tree remains a Learner and can switch back at any time.

### Demo Tree progression

The Global World currently uses a separate demo growth state so it cannot unlock or modify the Institutional Tree state. The three demo actions are:

1. Attend a demo learning session.
2. Share something useful to My Library.
3. Help the community through a useful conversation.

After all three are completed, the Global Tree path becomes available.

This is a prototype-only representation of the eventual, substantially stricter global Tree qualification and approval process described in the product architecture.

### World isolation

The current demo keeps the following concepts separate in frontend state:

- Global World vs Institutional World
- Global Tree capability vs Institutional Tree capability
- Global growth progress vs Institutional growth progress
- World selection vs Learner/Teacher mode

The Global World is intentionally implemented as a separate UI shell. The Institutional UI and its existing navigation are not redesigned as part of V2.16.



---

# V3.2 refinement notes

This build keeps the original project structure and extends the prototype without changing the core architecture. The main refinements are:

- Global is explicitly defined as learning beyond the user's institution.
- Global discovery now has a search-first surface across demo subjects, courses, classes, notes, questions, and Trees.
- Global navigation includes a Journey surface for the Learn → Share → Help → Teach model.
- The three-action Leaf → Tree threshold remains intentionally available for demonstrations and presentations.
- Tree UI communicates scoped teaching capability rather than implying unrestricted teaching authority.
- Global Home emphasizes a next learning step, discovery, contribution, and the learner's journey rather than a generic social feed.
- Institutional navigation and its existing structure remain separate from the Global shell.
- These additions remain prototype/demo behavior; backend authorization, RLS, qualification review, institutional membership, and production persistence remain future implementation work.

- The authenticated navbar now uses the same Leaf mark as the public E-Leaf space.
- Demo Tree criteria now make the Tree ready at 3/3 without automatically switching the learner into Tree mode.
- A fully satisfied demo Tree is visually filled completely and gives a restrained invitation cue on Home.
- Entering Tree mode from the growth Tree uses the same canonical Leaf → Tree transition as the normal role switch.
- Dashboard ambient visuals remain subtle and preserve the existing color foundation; Global/Institutional and Leaf/Tree states use different levels of organic contextual motion rather than separate color themes.

## V3.3 refinement notes

- Persistent World + Leaf/Tree context orientation, mobile bottom navigation, responsive layout refinement, and true 100% Tree fill at 3/3.

## V3.4 — Growth Tree + Internal UX Consistency Fix

This refinement pass focused on interaction integrity across the four internal contexts and on clarifying the Growth Tree as a qualification companion rather than a generic floating widget.

- The Growth Tree now has explicit lifecycle states: growing → ready → enter Tree. At 3/3, its fill is a true 100% state and the completed state provides an explicit **Enter Tree** action.
- Growth progress continues to derive from the shared world-specific growth state and remains stable while navigating between internal pages.
- Leaf → Tree and Tree → Leaf transitions retain destination-specific visual language; the transition label also identifies the destination world and mode.
- User-facing Leaf/Tree language is framed as participation/mode rather than implying a separate account role.
- World switching is labelled **Change world** to distinguish Global ↔ Institutional from Leaf ↔ Tree mode switching.
- Institutional Explore labels its content as institutional rather than Global.
- Tree users can continue learning without attempting to mutate Tree qualification progress through lesson completion.
- Institutional Tree class selections route into the teaching experience rather than the Leaf learning experience.
- Visible presentation actions provide feedback instead of silently failing; Tree profile actions now also explain when an experience is represented by the demo.
- Journey/context copy respects the current world rather than assuming Global.


## V3.5 — Contextual Visual Consistency

- Internal interactive actions now inherit the current Leaf/Tree participation accent by default, preventing mode-inconsistent green/orange controls across dashboards.
- Interactive course/action cards receive a restrained mode accent without recoloring the whole interface.
- Journey progress states use the current mode accent consistently.
- Neutral institutional information can remain neutral where explicitly marked, while actionable controls stay contextual.
- World styling remains environmental and separate from mode-specific action styling; contextual color is treated as a signal rather than a full-page skin.


## V3.6 — Internal Dashboard Integrity + Semantic Consistency

- Fixed Growth Tree fill persistence so its state-derived SVG fill remains visible after internal navigation and dashboard rerenders.
- Refined action styling so Leaf/Tree colors identify participation-mode actions rather than indiscriminately recoloring every button.
- Institutional College infrastructure actions (exam dates, library, and notices) remain neutral in both Leaf and Tree modes.
- Institutional Classes now make the participation action explicit: Leaf sees **Join** and Tree sees **Prepare**.
- Tree learning no longer presents lesson completion as qualification progress; its primary learning action is framed as **Continue learning**.
- Global Tree Explore no longer jumps directly from discovery into the teaching space; course selection is represented as a neutral course-details step in the presentation demo.
- UI terminology and controls continue to distinguish **World** (Global / Institutional) from **Mode** (Leaf / Tree), while internal authorization roles remain a separate concept.
- Role-switch controls now expose explicit accessible labels such as **Switch to Tree mode** / **Switch to Leaf mode**.
