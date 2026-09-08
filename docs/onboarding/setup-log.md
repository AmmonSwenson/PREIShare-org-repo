# Setup log — PREIshare onboarding

Author: Ammon Swenson (`AmmonSwenson`)  
Date recorded: 2026-09-08  
Honest scope: this log records what was verified in the Cursor Cloud agent workspace used for onboarding. It does **not** claim a personal laptop install.

## Accounts

- GitHub account: `AmmonSwenson` (`gh auth status` 2026-09-06: logged in; scopes `repo`, `read:org`, `workflow`)
- Fork: https://github.com/AmmonSwenson/PREIShare-org-repo (parent `EdTechForLearning/PREIShare-org-repo`)
- Team repo: https://github.com/EdTechForLearning/PREIShare-org-repo (pull yes, push no)

## Clone and remotes (this workspace)

- Working copy: Cursor Cloud `/workspace` on branch `docs/first-contribution-ammonswenson`
- `origin` in this VM points at the Cursor git host, not the GitHub fork
- Pushable GitHub remote is named `github`: https://github.com/AmmonSwenson/PREIShare-org-repo.git
- Team (upstream) URL: https://github.com/EdTechForLearning/PREIShare-org-repo
- Learner laptop clone path: TODO (never recorded in this tutorial run)

## Git identity (this VM only)

- `user.name`: Cursor Agent
- `user.email`: cursoragent@cursor.com
- Learner laptop `user.name` / `user.email`: TODO (never recorded)

## Toolchain (this VM only)

- OS: Linux 6.12.94+ x86_64
- Node: v22.14.0 (`node -v` on 2026-09-08)
- Package manager expected by repo: npm (`package.json` scripts: `dev`, `build`, `preview`, `generate-routes`)
- Learner laptop OS / Node / npm versions: TODO

## Install / build / test

- `npm install`: not run during this onboarding (docs-only contribution)
- `npm run dev` / `npm run build` / `npm run preview`: not run (plan and notes: skip UI verification)
- There is no `test` script in `package.json` (`docs/onboarding/repo-map.md`)

## Blockers and resolutions

- Cannot push to `EdTechForLearning/PREIShare-org-repo` (403 / pull-only). Resolved by pushing to the fork and opening a cross-fork PR.
- GitHub device login was required in this VM (`gh auth login --web`); completed as `AmmonSwenson`.
