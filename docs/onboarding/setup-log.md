# PREIshare setup log

**Learner:** Ammon Swenson
**Date:** 2026-09-05
**OS:** Linux Ubuntu 24.04.4 LTS (Noble Numbat), kernel 6.12.94+
**Team repo (upstream):** https://github.com/EdTechForLearning/PREIShare-org-repo
**Orientation notes used:** `docs/onboarding/team-orientation-notes.md`

## 1. Accounts and fork

| Check | Result | Notes |
| --- | --- | --- |
| GitHub sign-in works | PASS | Account username: @AmmonSwenson. Confirmed with `gh auth status` after GitHub device login in this Cloud Agent. |
| Can view team repo https://github.com/EdTechForLearning/PREIShare-org-repo | PASS | Public HTTPS GET returned HTTP 200. Default branch `main`. |
| Fork created in my account | PASS | My fork URL: https://github.com/AmmonSwenson/PREIShare-org-repo |

## 2. Git install and identity

```text
git version 2.43.0

Cursor Agent
cursoragent@cursor.com
```

Identity configured: PASS

This VM’s global Git identity is the Cloud Agent identity above. GitHub account used for remotes and `gh` is **AmmonSwenson**.

## 3. Clone (of MY fork)

- Parent directory used: `/home/ubuntu/src`
- Clone command used: `git clone https://github.com/AmmonSwenson/PREIShare-org-repo.git /home/ubuntu/src/PREIShare-org-repo`
- Cloned my fork (not the team repo): PASS
- Clone completed without error: PASS
- Local project path: `/home/ubuntu/src/PREIShare-org-repo`

## 4. Remotes (run inside the repo)

- `git remote add upstream https://github.com/EdTechForLearning/PREIShare-org-repo.git` run: PASS

### git remote -v

```text
origin	https://github.com/AmmonSwenson/PREIShare-org-repo.git (fetch)
origin	https://github.com/AmmonSwenson/PREIShare-org-repo.git (push)
upstream	https://github.com/EdTechForLearning/PREIShare-org-repo.git (fetch)
upstream	https://github.com/EdTechForLearning/PREIShare-org-repo.git (push)
```

origin points at MY fork: PASS
upstream points at the team repo: PASS

## 5. Post-clone verification

### git status

```text
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

### Default branch

```text
main
```

Default branch name: `main`
Working tree clean after clone: PASS

Tip commit on the cloned fork: `20d98f9 Merge pull request #1 from thortek/onboarding/first-pr`.

## 6. Auth notes (no secrets)

- Clone method: HTTPS
- Auth method used (if prompted): GitHub CLI device flow (`gh auth login` → https://github.com/login/device)
- Auth succeeded: PASS
- **Do not paste tokens or private keys here**

## 7. Issues and fixes

| Issue | What I tried | Outcome |
| --- | --- | --- |
| First Cloud Agent pass had no GitHub login, so the team repo was cloned instead of the fork | Signed in with `gh auth login` device code on the learner’s browser; re-cloned https://github.com/AmmonSwenson/PREIShare-org-repo.git | origin now points at the fork; upstream points at the team repo. |

## 8. Ready for next step

I have a fork I own, a local clone of it with origin and upstream set, and a setup log another teammate could audit: YES
