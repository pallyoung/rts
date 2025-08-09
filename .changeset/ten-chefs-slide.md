---
"rts.js": patch
---

Ci (release): Triggering release when PR is merged into master; Test temporary files to use system temporary directory instead
-Ci: Modify. ithub/workflows/release. yml
-The triggering condition is changed to pull_dequest.clost to master, and only executed when merged==true
-Retain manual triggering of workflow_ispatch
-Change the workflow name to release
-Upgrade pnpm/action setup to v10 and adjust the installation order to match pnpm cache
-Test: Migration of temporary files to system temporary directory
-All use cases use the rts tests/* subdirectories under os. tpdir() uniformly, compatible with Windows/Linux
-Adjust file creation and cleanup to fs.rmSync (..., {recursive: true, force: true})
-Delete the test/temp directory and related dependency paths in the repository
-Chore (ava): Remove the exclusion of test/temp/* */*. ts in ava.cnfig.js
-Docs (test): Update temporary file policy instructions in test/README.md
