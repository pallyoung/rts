# Changeset

This directory contains changeset files that describe changes to be released.

## What is a changeset?

A changeset is a markdown file that describes changes to be made in a release. It includes:
- Which packages have changed
- What type of changes (patch, minor, major)
- A description of the changes

## Creating a changeset

Run the following command to create a new changeset:

```bash
pnpm changeset
```

This will:
1. Ask you which packages have changed
2. Ask you what type of changes (patch, minor, major)
3. Ask you to write a description of the changes
4. Create a markdown file in this directory

## Changeset file format

A changeset file looks like this:

```markdown
---
"rts": patch
---

Description of changes
```

## Release types

- **patch**: Bug fixes and minor changes (0.0.1)
- **minor**: New features (0.1.0)
- **major**: Breaking changes (1.0.0)

## Best practices

1. Create changesets as you make changes, not just before release
2. Write clear, descriptive changelog entries
3. Use conventional commit-style descriptions
4. Include issue/PR references when relevant

## Releasing

When ready to release:

```bash
pnpm run release
```

This will:
1. Update versions based on changesets
2. Generate changelog
3. Publish to npm
4. Clean up changeset files

## More information

- [Changesets documentation](https://github.com/changesets/changesets)
- [Release guide](../../docs/en/release-guide.md) 