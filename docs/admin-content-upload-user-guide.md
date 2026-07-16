# Admin Content Upload User Guide

## 1. Download files from Claude
In Claude, use the download controls next to each generated file and save them to a folder on your computer.
If Claude gives you multiple files, keep them together in one folder so they are easy to review before upload.

## 2. Zip multiple Claude files
Select the files you want to upload, right-click, and create a ZIP archive.
Use one ZIP when you want Claude output to stay grouped as a single review batch.

## 3. Log into Edunancial Admin
Open `/admin/login` on the site.
Enter the owner email and password that match the secure server-side admin environment variables.

## 4. Upload the ZIP
Go to `/admin/content/upload`.
Drag the ZIP into the drop zone or use **Choose files**.
Add a batch name, source, and optional notes, then click **Upload batch**.

## 5. Review classifications
After upload, the batch review page lists every extracted file.
Check the file preview, proposed category, pillar, language, academy level, confidence, and duplicate/conflict warnings.

## 6. Correct a destination
Use the **Destination** field on the batch review page.
If a file should go somewhere else, change the path and click **Save**.

## 7. Approve or reject files
Approve only the files you want included in the export or PR.
Reject unsupported, duplicate, incorrect, or low-confidence files.
You can also bulk approve or bulk reject selected files.

## 8. Create the GitHub PR
Click **Create GitHub PR** after you have approved the right files.
The portal creates a branch named like `content-upload/YYYY-MM-DD-batch-slug`, commits only approved files plus the manifest, and opens a pull request.

## 9. Review the Netlify deploy preview
Open the deploy preview linked from the pull request checks.
Verify that uploaded content appears where expected and that existing site functionality still works.

## 10. Merge only after checking the preview
Do not merge based on upload success alone.
Merge only after the PR diff, validation output, and Netlify preview all look correct.
