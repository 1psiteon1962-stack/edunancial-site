# Admin Content Upload User Guide

## Complete Production Content Workflow

```
Upload ZIP → Validate → Extract → Review → Assign → Approve → Publish → Verify
```

Nothing becomes publicly visible until you have approved the files **and** merged the GitHub pull request.

---

## Production Prerequisites

Before using the upload workflow in production, ensure the following are configured:

### 1. Supabase Storage Bucket

The upload system stores files in a Supabase Storage bucket named **`admin-content`**.

**Option A — Auto-create (recommended):** Set the `SUPABASE_SERVICE_ROLE_KEY` environment variable in your Netlify settings. The system will automatically create the bucket on first use.

**Option B — Manual setup:** Create the bucket manually in your Supabase dashboard:
1. Open your Supabase project → Storage → New bucket
2. Name it `admin-content`
3. Set it as **private** (not public)
4. Add an RLS INSERT policy allowing service-role uploads, or configure your service role key

Without one of these, the presign endpoint returns a descriptive `400` error: `"Bucket 'admin-content' does not exist"` rather than silently failing.

### 2. Environment Variables

Ensure these are set in Netlify (Site settings → Environment variables):

| Variable | Required | Purpose |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Recommended | Auto-creates bucket; enables signed upload URLs for files > 5 MB |
| `NEXT_PUBLIC_SUPABASE_URL` | Required | Supabase project URL (also used by CSP header for XHR access) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Required | Browser-side Supabase client |
| `EDUNANCIAL_GITHUB_TOKEN` | Required for publish | GitHub personal access token for opening course PRs |
| `EDUNANCIAL_GITHUB_OWNER` | Required for publish | GitHub repo owner (e.g. `1psiteon1962-stack`) |
| `EDUNANCIAL_GITHUB_REPO` | Required for publish | GitHub repo name (e.g. `edunancial-site`) |

---

## 1. Download files from Claude
In Claude, use the download controls next to each generated file and save them to a folder on your computer.
If Claude gives you multiple files, keep them together in one folder so they are easy to review before upload.

## 2. Zip multiple Claude files
Select the files you want to upload, right-click, and create a ZIP archive.
Use one ZIP when you want Claude output to stay grouped as a single review batch.

A standard Edunancial course ZIP should contain:

```
course-package.zip
├── course.json              ← Course metadata (title, path, level, language, region, membershipTier, modules)
├── lessons/
│   ├── lesson-01.md         ← Lesson content with YAML front matter
│   └── lesson-02.md
├── media/
│   ├── thumbnail.jpg        ← Course thumbnail image
│   ├── worksheet.pdf        ← Lesson worksheets or resources
│   └── intro-video.mp4      ← Optional video content
└── README.md                ← Optional description
```

## 3. Log into Edunancial Admin
Open `/admin/login` on the site.
Enter the owner email and password that match the secure server-side admin environment variables.

## 4. Upload the ZIP (once)
Go to `/admin/content/upload`.
Drag the ZIP into the drop zone or use **Choose files**.
Add a batch name, source, and optional notes.
Select the content destination (**Courses**), course color track (Red / White / Blue), level (Level 1–5), language, and membership tier.
Click **Upload batch**.

The system automatically:
- Validates the ZIP for security (path traversal, blocked file types, size limits)
- Extracts every supported file from the ZIP
- Classifies and previews each file
- Detects duplicates and conflicts

## 5. Review extracted content
After upload, the batch review page lists every extracted file.
Check the file preview, proposed category, pillar, language, academy level, confidence, and duplicate/conflict warnings.

## 6. Assign to Academy, Level, Color, Course, Language, Region, and Membership
Each file card shows a **Course assignment** panel with dropdowns:

| Field | Options |
|---|---|
| Academy (Color) | Red Academy, White Academy, Blue Academy |
| Level | Level 1 – Level 5 |
| Language | English, Español, Français, Français (CA) |
| Region | North America, Latin America, Caribbean, Europe, Africa, Asia, Middle East, Oceania, Global |
| Membership level | Free, Basic, Premium, Elite |

The **Resolved destination** path updates automatically as you make selections.
Click **Apply assignment** to save.

## 7. Correct a destination
Use the **Destination** field on the batch review page.
If a file should go somewhere else, change the path and click **Save**.
The system verifies the path and prevents directory traversal.

## 8. Approve or reject files
Approve only the files you want included in the export or PR.
Reject unsupported, duplicate, incorrect, or low-confidence files.
You can also bulk approve or bulk reject selected files.

**Nothing is published at this step.** Approving only stages files for the export.

## 9. Preview before publishing
Review the resolved destination paths in the **Publish to Course** section.
Verify that:
- Academy (Color) is correct
- Level is correct
- Language and Region are correct
- All files you expect appear in the list

## 10. Publish to Course
Click **Publish N approved files to course** in the **Publish to Course** section.
The portal:
- Exports all approved files into the production course structure
- Creates a GitHub branch named `content-upload/YYYY-MM-DD-batch-slug`
- Commits only approved files plus the manifest
- Opens a GitHub pull request

**Nothing is visible on the live website yet.**

## 11. Review the GitHub PR and Netlify deploy preview
Open the GitHub pull request.
Open the Netlify deploy preview linked from the PR checks.
Verify on the preview:
- The course appears in the correct Academy (Red / White / Blue)
- The correct Level is displayed
- The correct Color category is displayed
- All uploaded files are accessible
- Images, PDFs, videos, audio, and attachments work correctly
- Navigation links function correctly
- The course displays correctly on the live preview website

## 12. Merge only after all checks pass
Do not merge based on upload success alone.
Merge only after:
- The PR diff looks correct
- All GitHub checks pass
- The Netlify deploy preview is verified

## 13. Verify on the live production website
After merging and deploying, verify on the live production website:
- Course appears in the correct Academy
- Correct Level is displayed
- Correct Color category is shown
- All files are accessible
- Images, PDFs, videos, audio, and attachments work
- Navigation links function
- Course displays correctly on all devices (mobile, tablet, desktop)

---

## Post-publish verification checklist

- [ ] Course appears in correct Academy (Red / White / Blue)
- [ ] Correct Level is displayed
- [ ] Correct Color category is displayed
- [ ] All uploaded files are accessible
- [ ] Images display correctly
- [ ] PDFs open correctly
- [ ] Videos play correctly
- [ ] Audio plays correctly
- [ ] Attachments download correctly
- [ ] Navigation links function correctly
- [ ] Course displays correctly on mobile
- [ ] Course displays correctly on desktop

