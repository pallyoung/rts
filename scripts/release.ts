/**
 * Release script for RTS (Runtime Transformer System) using Changeset
 *
 * This script automates the release process using @changesets/cli.
 * It handles version bumping, changelog generation, and publishing.
 *
 * Prerequisites:
 * - @changesets/cli installed globally or locally
 * - Changeset files created with `pnpm changeset`
 *
 * Usage:
 * ```bash
 * # Create a changeset (interactive)
 * pnpm changeset
 *
 * # Build the project
 * pnpm run build
 *
 * # Release with changeset
 * pnpm run release
 *
 * # Dry run (no actual changes)
 * pnpm run release --dry-run
 * ```
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

/**
 * Release configuration
 */
interface ReleaseConfig {
  /** Whether this is a dry run (no actual changes) */
  dryRun: boolean;
  /** Whether to skip build process */
  skipBuild: boolean;
  /** Whether to skip tests */
  skipTests: boolean;
}

/**
 * Check if changeset is installed
 */
function checkChangesetInstalled(): void {
  try {
    execSync("pnpm changeset --version", { stdio: "pipe" });
  } catch (error) {
    console.error("❌ @changesets/cli is not installed");
    console.error("Please install it with: pnpm add -D @changesets/cli");
    process.exit(1);
  }
}

/**
 * Check if there are any changeset files
 */
function checkChangesetFiles(): void {
  const changesetDir = ".changeset";
  if (!fs.existsSync(changesetDir)) {
    console.error("❌ .changeset directory not found");
    console.error("Please initialize changeset with: pnpm changeset init");
    process.exit(1);
  }

  const changesetFiles = fs
    .readdirSync(changesetDir)
    .filter((file) => file.endsWith(".md") && file !== "README.md");

  if (changesetFiles.length === 0) {
    console.error("❌ No changeset files found");
    console.error("Please create changesets with: pnpm changeset");
    process.exit(1);
  }

  console.log(`✅ Found ${changesetFiles.length} changeset(s)`);
}

/**
 * Run tests to ensure everything works
 */
function runTests(): void {
  console.log("🧪 Running tests...");
  try {
    execSync("pnpm test", { stdio: "inherit" });
    console.log("✅ Tests passed");
  } catch (error) {
    console.error("❌ Tests failed");
    process.exit(1);
  }
}

/**
 * Build the project
 *
 * This function calls the build script that you will implement.
 * The build process should:
 * - Compile TypeScript to JavaScript
 * - Generate type definitions
 * - Create distribution files
 * - Validate build output
 */
function buildProject(): void {
  console.log("🔨 Building project...");
  try {
    // Call the build script that you will implement
    execSync("pnpm run build", { stdio: "inherit" });
    console.log("✅ Build completed");
  } catch (error) {
    console.error("❌ Build failed");
    console.error("Please implement the build script in package.json");
    process.exit(1);
  }
}

/**
 * Validate build output
 *
 * This function validates that the build process produced the expected files.
 * You can customize this based on your build output structure.
 */
function validateBuildOutput(): void {
  console.log("🔍 Validating build output...");

  const expectedFiles = [
    "dist/index.js",
    "dist/index.d.ts",
    "dist/resolver/index.js",
    "dist/resolver/index.d.ts",
    "dist/transformer/ts.js",
    "dist/transformer/ts.d.ts",
    "dist/config/index.js",
    "dist/config/index.d.ts",
  ];

  const missingFiles = expectedFiles.filter((file) => !fs.existsSync(file));

  if (missingFiles.length > 0) {
    console.error("❌ Build validation failed. Missing files:");
    missingFiles.forEach((file) => console.error(`  - ${file}`));
    process.exit(1);
  }

  console.log("✅ Build output validated");
}

/**
 * Run changeset version command
 */
function runChangesetVersion(): void {
  console.log("📝 Running changeset version...");
  try {
    execSync("pnpm changeset version", { stdio: "inherit" });
    console.log("✅ Version updated");
  } catch (error) {
    console.error("❌ Failed to update version");
    process.exit(1);
  }
}

/**
 * Publish to npm using changeset
 */
function publishToNpm(config: ReleaseConfig): void {
  if (config.dryRun) {
    console.log("🔍 Dry run: Would publish to npm");
    return;
  }

  console.log("📦 Publishing to npm...");
  try {
    execSync("pnpm changeset publish", { stdio: "inherit" });
    console.log("✅ Published to npm");
  } catch (error) {
    console.error("❌ Failed to publish to npm");
    process.exit(1);
  }
}

/**
 * Push changes to git
 */
function pushToGit(): void {
  console.log("📤 Pushing changes to git...");
  try {
    execSync("git add .", { stdio: "inherit" });
    execSync('git commit -m "chore: release"', { stdio: "inherit" });
    execSync("git push", { stdio: "inherit" });
    console.log("✅ Changes pushed to git");
  } catch (error) {
    console.error("❌ Failed to push to git");
    process.exit(1);
  }
}

/**
 * Clean up changeset files
 */
function cleanupChangesetFiles(): void {
  console.log("🧹 Cleaning up changeset files...");
  try {
    const changesetDir = ".changeset";
    if (fs.existsSync(changesetDir)) {
      const files = fs
        .readdirSync(changesetDir)
        .filter((file) => file.endsWith(".md") && file !== "README.md");

      files.forEach((file) => {
        fs.unlinkSync(path.join(changesetDir, file));
      });
    }
    console.log("✅ Changeset files cleaned up");
  } catch (error) {
    console.error("❌ Failed to clean up changeset files");
    process.exit(1);
  }
}

/**
 * Main release function
 */
function release(config: ReleaseConfig): void {
  console.log("🚀 Starting release process...");

  if (config.dryRun) {
    console.log("🔍 DRY RUN MODE - No actual changes will be made");
  }

  try {
    // Check prerequisites
    checkChangesetInstalled();
    checkChangesetFiles();

    // Run tests (unless skipped)
    if (!config.skipTests) {
      runTests();
    }

    // Build project (unless skipped)
    if (!config.skipBuild) {
      buildProject();
      validateBuildOutput();
    }

    // Run changeset version (updates package.json and CHANGELOG.md)
    if (!config.dryRun) {
      runChangesetVersion();
    }

    // Publish to npm
    publishToNpm(config);

    // Push changes to git
    if (!config.dryRun) {
      pushToGit();
      cleanupChangesetFiles();
    }

    console.log("🎉 Release completed successfully!");
  } catch (error) {
    console.error("❌ Release failed:", error);
    process.exit(1);
  }
}

/**
 * Initialize changeset (helper function)
 */
function initChangeset(): void {
  console.log("🔧 Initializing changeset...");
  try {
    execSync("pnpm changeset init", { stdio: "inherit" });
    console.log("✅ Changeset initialized");
  } catch (error) {
    console.error("❌ Failed to initialize changeset");
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
const command = args[0];

if (command === "init") {
  initChangeset();
  process.exit(0);
}

const config: ReleaseConfig = {
  dryRun: args.includes("--dry-run"),
  skipBuild: args.includes("--skip-build"),
  skipTests: args.includes("--skip-tests"),
};

// Show help if no command or invalid command
if (
  !command ||
  (command !== "init" && !["release", "build", "test"].includes(command))
) {
  console.log(`
Usage: pnpm run release [options]

Commands:
  release    Run the full release process
  init       Initialize changeset (first time setup)

Options:
  --dry-run      Run without making actual changes
  --skip-build   Skip the build process
  --skip-tests   Skip running tests

Examples:
  pnpm run release              # Full release
  pnpm run release --dry-run   # Dry run
  pnpm run release init        # Initialize changeset
  pnpm run release --skip-build # Skip build step
`);
  process.exit(1);
}

if (command === "release") {
  release(config);
} else if (command === "build") {
  buildProject();
  validateBuildOutput();
} else if (command === "test") {
  runTests();
}
