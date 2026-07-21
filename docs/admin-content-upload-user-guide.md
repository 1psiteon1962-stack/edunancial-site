# Admin Content Upload User Guide

## 1. Download files from Claude
In Claude, use the download controls next to each generated file and save them to a folder on your computer.
If Claude gives you multiple files, keep them together in one folder so they are easy to review before upload.

## 2. Zip multiple Claude files
Select the files you want to upload, right-click, and create a ZIP archive.
Use one ZIP when you want Claude output to stay grouped as a single review batch.
A representative Edunancial course ZIP should contain multiple files such as lesson markdown files, quiz JSON files, worksheets, and supplemental readings.

## 3. Log into Edunancial Admin
Open `/admin/login` on the site.
Enter the owner email and password that match the secure server-side admin environment variables.

## 4. Configure course metadata before upload
Go to `/admin/content/upload`.

Before adding files, complete the **Content Destination** and course assignment fields:

| Field | Purpose |
|---|---|
| Content Destination | Choose **COURSES** or **MARKETPLACE** |
| Color Track | Red (Real Estate), White (Paper Assets), or Blue (Business) |
| Course Level | Level 1 through Level 5 |
| Language | English, Spanish, French, or French (Canada) |
| Membership Access | Free, Basic, Premium, or Elite |
| Title | Course or batch title |
| Description | Short description used in the course catalog |

These values are applied to every file extracted from the ZIP and determine the course directory path.

## 5. Upload the ZIP
Drag the ZIP into the drop zone or use **Choose files**, then click **Upload batch**.
The portal validates, extracts, and classifies every file in the archive automatically.

## 6. Review extractions and course assignment
After upload, the batch review page lists every extracted file with:

- **File preview** — first portion of content
- **Course Assignment panel** — editable dropdowns for Color Track, Academy Level, Language, and Region
- **Destination path** — the exact path where the file will be stored after publishing
- **Duplicate and conflict warnings**

### Reassigning individual files
Each file card has a **Course Assignment** panel with dropdown selectors for:
- **Color Track (Pillar)** – red, white, blue, academy, or uncategorized
- **Academy Level** – Level 1 through Level 5
- **Language** – en, es, fr, fr-CA
- **Region** – Global or a specific region (north-america, latin-america, etc.)

Changing any of these dropdowns automatically recalculates and displays the resolved destination path.

Use the **Destination (override)** text field if you need to specify an exact custom path.

## 7. Approve or reject files
Approve only the files you want included in the export or PR.
Reject unsupported, duplicate, incorrect, or low-confidence files.
You can also bulk approve or bulk reject selected files.

Nothing becomes publicly visible until after the pull request is reviewed and merged.

## 8. Publish to Course
After approving files, scroll to the **Publish to Course** section at the bottom of the batch review page.

Click **Publish Approved Files to Course →**. This:
1. Creates an export ZIP containing approved files at their resolved destination paths
2. Opens a GitHub pull request on a branch named like `content-upload/YYYY-MM-DD-batch-slug`
3. Displays the pull request URL

The pull request places each approved file in its correct course directory:
```
content/courses/{track}/{level}/{language}/{filename}
```

## 9. Review the Netlify deploy preview
Open the deploy preview linked from the pull request checks.
Verify that uploaded content appears where expected and that existing site functionality still works.

## 10. Merge only after checking the preview
Do not merge based on upload success alone.
Merge only after the PR diff, validation output, and Netlify preview all look correct.

---

## Course directory structure

Uploaded course files are stored at:

```
content/courses/
  red/          ← Real Estate track
    level-1/
      en/       ← English content
      es/       ← Spanish content
    level-2/
      ...
  white/        ← Paper Assets track
    ...
  blue/         ← Business track
    ...
```

Marketplace files are stored at:

```
content/marketplace/
  books/
  ebooks/
  pdf-guides/
  ...
```
