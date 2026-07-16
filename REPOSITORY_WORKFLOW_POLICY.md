# Repository Workflow Policy

Effective immediately, all coding agents working in this repository must follow this workflow for every task.

1. Create a dedicated feature branch for the assigned task.
2. Complete the implementation.
3. Run all builds, linting, unit tests, integration tests, and deployment checks.
4. Resolve any merge conflicts with the latest main branch before requesting review.
5. Open a Pull Request immediately upon task completion.
6. Mark the Pull Request as Ready for Review. Do **not** leave completed work in Draft status unless actively blocked by a documented technical issue.
7. Include in the Pull Request:
   - Summary of changes
   - Files modified
   - Screenshots where applicable
   - Test results
   - Known issues
   - Rollback considerations
8. Review the Pull Request as soon as possible.
9. If approved:
   - Merge immediately.
   - Delete the feature branch.
   - Verify the merge succeeded.
   - Verify the deployment pipeline starts.
   - Verify the deployed site is functioning correctly.
10. No completed task should remain unmerged without a documented reason.
11. Keep the main branch continuously releasable.
12. If another task depends on an open Pull Request, prioritize reviewing and merging that Pull Request before beginning additional dependent work.
13. At the completion of every coding task, provide a deployment report including:
   - Branch name
   - Pull Request number
   - Merge commit
   - Deployment status
   - Live URL tested
   - Remaining issues
