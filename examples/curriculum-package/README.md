# Example Curriculum Package

This folder contains reference curriculum assets for contributors.

## Files

- `RED-L1-001-sample.md` — sample lesson with valid lesson front matter
- `RED-L1-MANIFEST-sample.md` — sample track-level manifest

## Usage

1. Copy the sample that matches your asset type.
2. Replace metadata and body content with real curriculum content.
3. Keep the ID and taxonomy format canonical.
4. Import the finished files with:

```bash
npm run curriculum:import -- path/to/file-or-folder
```

These examples are not automatically registered; they exist purely as contributor templates.
