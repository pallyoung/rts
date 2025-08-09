---
"rts.js": patch
---

CI/CD
Replace manual Changesets version/publish with changesets/action@v1
Trigger release when a PR is merged into master; keep workflow_dispatch
Update permissions: contents: write, pull-requests: write, id-token: write
Step order: Checkout → pnpm (v10) → Node 20 → Install → Test → Build → Changesets Action
Tests
Use system temporary directory via os.tmpdir() for all temp files (cross-platform)
Unify cleanup with fs.rmSync(..., { recursive: true, force: true })
Remove test/temp directory and related references
Update ava.config.js (remove exclude for test/temp/**/*.ts)
Docs
Update test/README.md to document the new temp file strategy
Config/Misc
Set .changeset/config.json baseBranch to master and enable commit: true
Allow committing Changeset entries by adjusting .gitignore
Keep Node 20 and pnpm cache configuration for faster installs and builds
