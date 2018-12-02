const fs = require("fs");
const https = require("https");

const configText = fs.readFileSync("config.json", "utf8");
const configObj = JSON.parse(configText);

new Promise((resolve, reject) => {
    const errMsg = `Unable to get profile data`;

    https.get(
        {
            host: "toggl.com",
            path: `/api/v8/me?with_related_data=true`,
            auth: `${configObj.token}:api_token`
        },
        res => {
            if (res.statusCode === 200) {
                res.setEncoding("utf8");
                let content = "";

                res.on("data", c => {
                    content += c;
                });

                res.on("end", () => {
                    resolve(JSON.parse(content));
                });
            } else {
                reject(new Error(errMsg));
            }
        }
    );
})
    .then(profileData => {
        const projectHash = {};
        profileData.data.projects.forEach(project => {
            projectHash[project.id] = { ...project };
        });

        // const workspaceHash = {}
        // profileData.data.workspaces.forEach((workspace) => {
        //     workspaceHash[workspace.id] = {...workspace}
        // })

        const entryList = profileData.data.time_entries.map(entry => {
            // const workspaceId = entry.wid.toString()
            const projectId = entry.pid.toString();
            const copyEntry = { ...entry };

            copyEntry["project"] = projectHash[projectId];
            // copyEntry['workspace'] = workspaceHash[workspaceId]

            return copyEntry;
        });

        return Promise.resolve(entryList);
    })
    .then(entryList => {
        configObj.validators.forEach(validator => {
            validator.description = new RegExp(validator.description);
        });

        const invalidEntryDescription = [];

        entryList.forEach(entry => {
            if (invalidEntryDescription.indexOf(entry.description) === -1) {
                configObj.validators.forEach(validator => {
                    if (validator.description.test(entry.description)) {
                        if (entry.project.name !== validator.project_name) {
                            invalidEntryDescription.push(entry.description);
                            console.error(
                                `Found problem with "${
                                    entry.description
                                }"! \nProject name is "${
                                    entry.project.name
                                }", should be "${validator.project_name}"!`
                            );
                        }
                    }
                });
            }
        });

        console.info("Check finished");
    })
    .catch(err => {
        console.error(err);
    });
