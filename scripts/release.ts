/**
 * Release script for RTS (Runtime Transformer System)
 *
 * This script automates the release process for the RTS package.
 * It handles version bumping, changelog generation, and publishing.
 *
 * Usage:
 * ```bash
 * # Release a patch version (1.0.0 -> 1.0.1)
 * npm run release:patch
 *
 * # Release a minor version (1.0.0 -> 1.1.0)
 * npm run release:minor
 *
 * # Release a major version (1.0.0 -> 2.0.0)
 * npm run release:major
 * ```
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

/**
 * Release configuration
 */
interface ReleaseConfig {
  /** Current version from package.json */
  currentVersion: string;
  /** New version to release */
  newVersion: string;
  /** Release type: patch, minor, or major */
  releaseType: "patch" | "minor" | "major";
  /** Whether this is a dry run (no actual changes) */
  dryRun: boolean;
}

/**
 * Get current version from package.json
 */
function getCurrentVersion(): string {
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
  return packageJson.version;
}

/**
 * Update version in package.json
 */
function updateVersion(newVersion: string): void {
  const packageJsonPath = "package.json";
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  packageJson.version = newVersion;
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + "\n",
  );
  console.log(`✅ Updated version to ${newVersion} in package.json`);
}

/**
 * Generate changelog entry
 */
function generateChangelogEntry(config: ReleaseConfig): string {
  const date = new Date().toISOString().split("T")[0];
  return `## [${config.newVersion}] - ${date}

### Added
- New features and improvements

### Changed
- Changes in existing functionality

### Fixed
- Bug fixes and patches

### Breaking Changes
- Breaking changes (if any)

---
`;
}

/**
 * Update CHANGELOG.md
 */
function updateChangelog(config: ReleaseConfig): void {
  const changelogPath = "CHANGELOG.md";
  let changelog = "";

  // Create changelog file if it doesn't exist
  if (!fs.existsSync(changelogPath)) {
    changelog = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

`;
  } else {
    changelog = fs.readFileSync(changelogPath, "utf8");
  }

  const entry = generateChangelogEntry(config);
  const newChangelog = changelog.replace(
    "# Changelog",
    `# Changelog\n\n${entry}`,
  );
  fs.writeFileSync(changelogPath, newChangelog);
  console.log("✅ Updated CHANGELOG.md");
}

/**
 * Run tests to ensure everything works
 */
function runTests(): void {
  console.log("🧪 Running tests...");
  try {
    execSync("npm test", { stdio: "inherit" });
    console.log("✅ Tests passed");
  } catch (error) {
    console.error("❌ Tests failed");
    process.exit(1);
  }
}

/**
 * Build the project
 */
function buildProject(): void {
  console.log("🔨 Building project...");
  try {
    execSync("npm run build", { stdio: "inherit" });
    console.log("✅ Build completed");
  } catch (error) {
    console.error("❌ Build failed");
    process.exit(1);
  }
}

/**
 * Publish to npm
 */
function publishToNpm(config: ReleaseConfig): void {
  if (config.dryRun) {
    console.log("🔍 Dry run: Would publish to npm");
    return;
  }

  console.log("📦 Publishing to npm...");
  try {
    execSync("npm publish", { stdio: "inherit" });
    console.log("✅ Published to npm");
  } catch (error) {
    console.error("❌ Failed to publish to npm");
    process.exit(1);
  }
}

/**
 * Create git tag
 */
function createGitTag(config: ReleaseConfig): void {
  if (config.dryRun) {
    console.log(`🔍 Dry run: Would create git tag v${config.newVersion}`);
    return;
  }

  console.log(`🏷️  Creating git tag v${config.newVersion}...`);
  try {
    execSync(`git tag v${config.newVersion}`, { stdio: "inherit" });
    execSync(`git push origin v${config.newVersion}`, { stdio: "inherit" });
    console.log("✅ Git tag created and pushed");
  } catch (error) {
    console.error("❌ Failed to create git tag");
    process.exit(1);
  }
}

/**
 * Main release function
 */
function release(
  releaseType: "patch" | "minor" | "major",
  dryRun = false,
): void {
  const currentVersion = getCurrentVersion();
  const [major, minor, patch] = currentVersion.split(".").map(Number);

  let newVersion: string;
  switch (releaseType) {
    case "patch":
      newVersion = `${major}.${minor}.${patch + 1}`;
      break;
    case "minor":
      newVersion = `${major}.${minor + 1}.0`;
      break;
    case "major":
      newVersion = `${major + 1}.0.0`;
      break;
    default:
      throw new Error(`Invalid release type: ${releaseType}`);
  }

  const config: ReleaseConfig = {
    currentVersion,
    newVersion,
    releaseType,
    dryRun,
  };

  console.log(
    `🚀 Starting ${releaseType} release: ${currentVersion} -> ${newVersion}`,
  );
  if (dryRun) {
    console.log("🔍 DRY RUN MODE - No actual changes will be made");
  }

  // Run the release process
  try {
    if (!dryRun) {
      updateVersion(newVersion);
      updateChangelog(config);
    }

    runTests();
    buildProject();
    publishToNpm(config);
    createGitTag(config);

    console.log(`🎉 Release ${newVersion} completed successfully!`);
  } catch (error) {
    console.error("❌ Release failed:", error);
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
const releaseType = args[0] as "patch" | "minor" | "major";
const dryRun = args.includes("--dry-run");

if (!releaseType || !["patch", "minor", "major"].includes(releaseType)) {
  console.error("Usage: npm run release <patch|minor|major> [--dry-run]");
  process.exit(1);
}

release(releaseType, dryRun);
