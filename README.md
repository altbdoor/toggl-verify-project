# toggl-verify-project

Basic validation of [toggl](https://toggl.com/) entries, based on the time entry description and project


### Why

- Working on project
- Use "start timer" button on JIRA with [toggl Chrome extension](https://chrome.google.com/webstore/detail/toggl-button-productivity/oejgccbfbmkkpaidnkphaiaecficdnfn?hl=en)
- toggl randomly auto assigns weird projects to time entry
- Get warning from superior
- Twice


### Usage

1. Download ZIP archive and extract somewhere.
1. Login into [toggl](https://toggl.com/login/) and view your Profile.
1. Find the API token and put it into `config.json`.
1. Write your validators:
    1. `description` is a Regular Expression field.
    1. `project_name` is what the project should be.
1. Run `node runner.js`.
1. Check if there are any error messages.
1. Fix them.
