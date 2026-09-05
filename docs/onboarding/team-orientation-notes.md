# PREIshare team orientation notes

Author: Ammon Swenson
Date: 2026-09-05

## 0. Team repository of record

- **Team repo (upstream):** https://github.com/EdTechForLearning/PREIShare-org-repo
- **My fork:** https://github.com/AmmonSwenson/PREIShare-org-repo
- **Contribution model:** fork the team repo, clone *that fork*, add the team repo as `upstream`, then open pull requests from a feature branch. Do not push to the team default branch.

## 1. Product mission (my words)

PREIshare is a web product that helps people make better real-estate decisions from property and market data. Today the shared repo is a blank TanStack Start app (React, TypeScript, Vite, Tailwind). The intended product direction also names Supabase, PostgreSQL, and pgvector, but those are not in the current scaffold. A new contributor’s job is to join the shipping loop safely: small, reviewable changes, not a rewrite on day one.

## 2. Everyday collaboration → engineering workflow

| Everyday picture | PREIshare engineering parallel |
| --- | --- |
| Shared final document | Shared default branch on the team repository |
| My draft copy | My feature branch with a small change |
| Save history / version notes | Commits with clear messages |
| Ask a peer to review before publish | Open a pull request (PR) for review |
| Peer approves, then we publish | Review passes, then the PR can merge |

## 3. Actors in a pull-request workflow

- **Contributor (me):** picks a tiny safe change, works on a branch of *my fork*, describes the change, and responds to feedback.
- **Reviewer (teammate or simulated reviewer):** checks correctness, scope, and clarity before merge.
- **Shared repository:** the team’s source of truth at `EdTechForLearning/PREIShare-org-repo`. Process treats `main` as protected even when tools would allow a direct edit.
- **Automation (later):** checks such as GitHub Actions may run on the PR; failing checks are blockers, not noise.

## 4. First-PR definition of done (beginner-safe)

A first reviewed PR is done only when all of the following are true:

1. **Scoped:** The change is intentionally small (onboarding docs or a contributors list), not a multi-feature rewrite.
2. **Isolated:** Work happened on a feature branch of a personal fork, not by editing the shared default branch directly.
3. **Described:** The PR states why the change exists, what files changed, and how a reviewer can verify it.
4. **Reviewable:** A teammate can understand the diff without a meeting; notes capture decisions or follow-ups.
5. **Verified:** The author re-read the diff and fixed obvious mistakes before asking for review.
6. **Aligned:** The change matches team conventions (repo map, AI rules, best practices) learned in later steps.

## 5. Out of scope for the first PR

- Large refactors, dependency upgrades, or database schema changes
- Secrets, production credentials, or real customer data
- “While I was here” unrelated edits that enlarge review risk
- Inventing a data layer (Supabase, PostgreSQL, pgvector) that is not in the current tree

## 6. How I will use AI on this team

I will prompt agents in small cycles: understand → plan → prompt → review → refine.
I will not paste secrets into agents. I will not accept agent output I cannot explain.
Orientation complete means I can tell a human what PREIshare is, who is in the
PR loop, and what “first PR done” means—before I configure tools or write product code.
