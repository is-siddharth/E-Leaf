# E-Leaf

## Come as a learner. Grow into a teacher.

E-Leaf is an education platform built around a simple idea:

**You come as a learner, and you become a teacher by helping others
learn.**

The product is designed to make learning feel less like consuming
content and more like participating in a living learning community.

Every person begins as a **Leaf**.

A Leaf learns from others, takes classes, shares useful discoveries,
asks questions, and helps other learners.

Over time, meaningful participation can open the **Tree** capability.

A Tree can teach, share knowledge, support Leaves, and still return to
Leaf mode whenever they need to learn.

------------------------------------------------------------------------

## The Leaf and the Tree

The two terms are intentionally simple:

  E-Leaf concept   Meaning
  ---------------- ---------------------
  🍃 **Leaf**      Come as a Learner
  🌳 **Tree**      Grow into a Teacher

The terminology is part of the product's identity, not merely
decoration.

A new person should immediately understand:

**Leaf = Learner**\
**Tree = Teacher**

------------------------------------------------------------------------

## Core philosophy

### 1. Everyone starts by learning

Teaching is not the starting privilege. The first step is to learn from
people who already know something.

The intended progression is:

**Learn → Share → Help → Teach**

Teaching is therefore something developed through participation rather
than simply selected from a menu.

### 2. Learning should become contribution

Learning is not considered complete when information has been consumed.
A learner should gradually be able to understand an idea, explain
something useful, ask a thoughtful question, answer someone else's
question, share a useful note, participate in a class, and eventually
help others learn.

E-Leaf treats contribution as part of learning itself.

### 3. A Tree is still a Leaf

Becoming a Tree does not mean leaving learning behind.

A Tree can return to Leaf mode whenever they need to learn from someone
else.

**Every teacher remains a learner.**

The role is a capability, not a permanent hierarchy.

### 4. Recognition without competition

E-Leaf is intentionally not built around noisy gamification. The product
should not depend on XP, follower counts, popularity scores, competitive
rankings, or artificial achievement systems.

Recognition should answer a quieter question:

**Who has been useful to other people?**

The goal is appreciation without turning learning into a race.

------------------------------------------------------------------------

# The learner journey

A new user enters E-Leaf through authentication. The authentication
experience introduces the philosophy immediately:

**🍃 Come as a Learner.**\
**🌳 Grow into a Teacher.**

After authentication, the product determines what capabilities belong to
that account.

A new user begins through Leaf. The Tree capability is initially locked.
The product then guides the learner toward the Tree path.

For the current prototype, the path contains three conditions:

### Learn

Attend a class from another Tree.

### Share

Plant a useful note that can help others.

### Help

Answer a question from another learner.

When all three conditions are complete, the prototype allows the learner
to grow into a Tree.

The model is intentionally simple now so that it can later support a
more rigorous qualification system without changing the core philosophy.

------------------------------------------------------------------------

# The Tree path

The Tree path is not meant to feel like a game. It is a visible
representation of meaningful participation.

A learner should always understand:

-   what they have already done,
-   what remains,
-   why it matters,
-   and what they can do next.

Example:

``` text
PATH TO TREE

Learn   ✓
Share   ✓
Help    ○

2/3 complete
```

The important part is the behavior represented by the progress, not the
number itself.

The production system should ultimately derive this progress from
verified participation records rather than trusting a UI counter.

------------------------------------------------------------------------

# Product experience

E-Leaf is intended to guide users rather than make them figure out what
to do.

The interface should answer the user's next natural question:

**What can I do now?**

A Leaf can:

-   attend classes,
-   explore notes,
-   meet Trees,
-   ask questions,
-   participate in discussion,
-   track learning progress,
-   plant notes,
-   and help other learners.

A Tree can:

-   teach classes,
-   plan lessons,
-   support students,
-   ask questions and receive help,
-   plant teaching notes,
-   continue learning as a Leaf,
-   and contribute to the wider community.

Navigation is role-aware, while the underlying person remains the same
account.

------------------------------------------------------------------------

# Identity and account model

E-Leaf separates three concepts:

### Authentication

Who is this person?

### Capability

Has this account earned Tree access?

### Current mode

Is the person currently using E-Leaf as a Leaf or as a Tree?

These concepts should not be conflated.

A returning user must never receive another user's progress simply
because the same browser is being used.

The prototype associates account-owned activity with the authenticated
user's ID. Supabase provides authentication, while local browser storage
currently holds much of the prototype activity model. The long-term
direction is to move authoritative activity, qualification, moderation,
and permissions into the backend.

------------------------------------------------------------------------

# Current technology direction

The prototype is intentionally lightweight.

### Frontend

-   HTML
-   CSS
-   JavaScript
-   Responsive layouts
-   Role-aware navigation
-   Local prototype data storage

### Authentication

**Supabase Auth** provides account creation, email/password login,
persistent sessions, authenticated identity, and profile association.

### Current prototype storage

Browser storage currently supports records such as:

-   notes,
-   classes,
-   questions and answers,
-   attendance,
-   prototype progress,
-   private quick notes.

Ownership is associated with the authenticated user's ID where
applicable.

This allows the product experience to be tested while the production
backend is developed.

------------------------------------------------------------------------

# Planned backend evolution

The intended backend should become the authoritative system for the
product.

``` text
Authentication
      ↓
User identity
      ↓
Profiles and capabilities
      ↓
Curriculum
      ↓
Classes and attendance
      ↓
Notes and knowledge sharing
      ↓
Questions and answers
      ↓
Contribution verification
      ↓
Tree qualification
      ↓
Recognition and moderation
```

The qualification system should ultimately be derived from authoritative
records. Class attendance, notes, answers, questions, moderation
decisions, and Tree eligibility should all be associated with real
account identity and protected by backend policies.

------------------------------------------------------------------------

# Curriculum vision

E-Leaf can support structured academic learning rather than a collection
of disconnected pages.

A possible curriculum structure is:

``` text
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

This creates a foundation for structured learning paths while keeping
the community layer flexible.

------------------------------------------------------------------------

# Classes

Classes are a major bridge between learning and teaching.

A Leaf can learn from a Tree. A Tree can teach a class.

The prototype demonstrates the class lifecycle and role-aware
experience, while real classroom infrastructure can be added later.

The planned production direction includes integrations such as Google
Meet through secure backend functions rather than exposing privileged
credentials in the browser.

------------------------------------------------------------------------

# Notes and knowledge sharing

A note can become part of the community's shared knowledge.

``` text
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

Future versions can add stronger moderation, review, file/PDF support,
storage, search, and quality controls.

------------------------------------------------------------------------

# Questions and helping

Questions create another contribution pathway.

A Tree can ask a question. A Leaf can answer.

The answer is valuable because it helps another person move forward, not
because it earns points.

This is central to E-Leaf:

**The learner gradually becomes useful to other learners.**

------------------------------------------------------------------------

# Recognition

Recognition should surface meaningful contribution, such as useful
answers, helpful notes, teaching, and learner support.

The intended principle is:

**appreciation without competition.**

------------------------------------------------------------------------

# Design philosophy

The interface is intentionally:

-   minimal,
-   calm,
-   personal,
-   readable,
-   responsive,
-   consistent,
-   and guidance-oriented.

E-Leaf should not look like a conventional gamified education
application.

The Leaf and Tree metaphor should remain understandable and restrained.
Animation should communicate transitions and state changes rather than
exist for decoration.

Mobile is treated as a first-class experience, not simply a smaller
desktop layout. The product should work across narrow phones, tall
phones, short-height phones, tablets, and desktop screens.

------------------------------------------------------------------------

# Product consistency

Semantic consistency is a core product principle.

The central relationship should remain stable:

**Leaf = Learner**\
**Tree = Teacher**

The wording can adapt to context, but the meaning should never become
ambiguous.

The authentication experience therefore introduces the relationship
directly:

**🍃 Come as a Learner.**\
**🌳 Grow into a Teacher.**

A locked Tree should communicate the future destination without
pretending that the user is already a Tree.

------------------------------------------------------------------------

# What E-Leaf is trying to become

E-Leaf has the potential to sit between an education platform and a
learning community.

It is not only a place where people consume courses. It is designed
around a cycle:

``` text
                    ┌───────────────┐
                    │    LEARN      │
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │    SHARE      │
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │     HELP      │
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │    TEACH      │
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │    LEARN      │
                    └───────────────┘
```

The cycle has no real final step.

A Tree can become a Leaf again. A learner can continue growing. A
teacher can continue learning.

The community grows when knowledge moves between people.

------------------------------------------------------------------------

# Long-term potential

The foundation can eventually support:

-   structured curricula,
-   academic programs,
-   live and recorded classes,
-   community notes,
-   collaborative learning,
-   question and answer systems,
-   mentor and teacher profiles,
-   moderation,
-   contribution verification,
-   meaningful recognition,
-   notifications,
-   search,
-   analytics,
-   secure file storage,
-   and increasingly sophisticated qualification systems.

The long-term opportunity is not simply to build another course
catalogue.

It is to build an environment where **learning naturally turns into
contribution, and contribution naturally turns into teaching**.

That is the core idea behind E-Leaf.

------------------------------------------------------------------------

## The simplest explanation

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

**E-Leaf: Come as a learner. Grow into a teacher.**
