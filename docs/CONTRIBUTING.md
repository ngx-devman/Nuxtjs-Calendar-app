# Contributing

## Issues
Issues are the main 'todo list' for the developers and should be actionable things. This means only things that actually need to get done should be added to the issues list. Things like suggestions or discussions should be made in the "Discussions" tab in github.

Issues should have a short title that breifly describes what it is regarding and a descriptive summary. 

Only leads should select assignees for issues.

Issues with the label "help wanted" can be picked up by anyone. Just comment asking to be assigned it.

Anyone with the permissions to do so can make a issue.

### Issue Milestone
The milestone selected on issues determine what release it is slated/planned for. It also determines the release branch that the update branch should be created from and where the pull request should be merged with.

#### Example
Issue #0 as the milestone `v0.7` assigned to it.

This means:
- The release branch will be `release/v0.7`
- The update branch will be `[type]/v0.7/[short-title-or-issue-id]`
- The pull request will merge back into `release/v0.7` and have the milestone `v0.7`

### Issues With Projects
Issues that are assigned to a project should not have their status updated. We only have the `Tracker` project on github now and it is automated so updating the status is not needed. 

### Working on Issues
Github keywords should be used in pull request or commit messages to link issues to their actual code updates.

## Pull Requests
