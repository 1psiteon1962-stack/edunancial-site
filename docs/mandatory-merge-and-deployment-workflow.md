# Mandatory Merge and Deployment Workflow

This policy applies immediately to the North American website and shall become the standard for every Edunancial repository worldwide.

## Workflow

1. Agent accepts assigned task.
2. Agent completes development.
3. Agent performs self-review.
4. Agent fixes all identified issues.
5. Agent opens a Pull Request immediately upon completion.
6. The Pull Request shall never remain in Draft status unless the work is genuinely incomplete.
7. Once review requirements are satisfied, convert the Pull Request from Draft to Ready for Review immediately.
8. Complete all required reviews.
9. Resolve all comments.
10. Merge the Pull Request into the main branch as soon as approval is obtained.
11. Confirm that the merge completed successfully.
12. Verify that Netlify deployment is automatically triggered.
13. Monitor the deployment until it completes successfully.
14. Verify that the live website reflects the merged changes.
15. Mark the GitHub task as Completed only after:
   - the merge is complete,
   - the Netlify deployment succeeds,
   - and the production website has been verified.

## Mandatory Standards

- No completed work shall remain in Draft status.
- No approved Pull Request shall remain unmerged without a documented reason.
- All completed work shall be deployed to the live development environment as soon as practical.

This workflow becomes the mandatory repository governance standard for all current and future Edunancial websites.
