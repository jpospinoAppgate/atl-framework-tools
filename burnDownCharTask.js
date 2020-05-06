module.exports.requestBurnDown = (boardId, sprintIndex, callback) => {
    const dateFormat = require('dateFormat');
    const { config } = require('./_config/config');
    const axios = require('axios');
    const { dateHandler } = require('./_operation/datehandler');
    let { burnDownTemplate } = require('./_html/burndowTemplate');

    /*************** config.js file ***************/
    let authorization = config.authorization;
    let serverURL = config.serverURL;
    /**********************************************/

    const instance = axios.create({
        baseURL: serverURL,
        timeout: 5000,
        headers: {
            'Authorization': authorization,
            'Content-Type': 'application/json'
        }
    });

    let getActiveSprint = (callback) => {
        instance.get(`/rest/agile/1.0/board/${boardId}/sprint?state=active`)
            .then((response) => {
                callback(null, response.data.values.filter(sprint => sprint.state === 'active')[sprintIndex]);
            });
    }

    let getItemsBySprint = (sprintId, callback) => {
        let sprintItems = [];

        let getSprintItems = (indexStart) => {
            instance.post('/rest/api/2/search', {
                "jql": `sprint = ${sprintId} ORDER BY key DESC`,
                "startAt": indexStart,
                "maxResults": 50,
                "fields": ["key", "summary", "creator", "updated", "resolutiondate", "issuetype", "assignee", "status", "fields", "created", "priority"]
            }).then((itemResponse) => {
                itemResponse.data.issues.forEach(element => {
                    sprintItems.push(element);
                });

                if (itemResponse.data.issues.length != 0)
                    getSprintItems(indexStart + 50);
                else
                    callback(null, sprintItems);
            });
        }

        getSprintItems(0);
    }

    getActiveSprint((error, result) => {
        let resultDocument = {
            startDate: dateFormat(result.startDate, "isoDate"),
            endDate: dateFormat(result.endDate, "isoDate"),
            name: result.name,
            sprintGoal : result.goal,
            dates: [],
            idealTaskBurnDown: [],
            subTaskPerform: [],
            subTaskCreated: [],
            subTaskRate: 0,
            subTaskRateDiff: 0,
            idealstoryBurnDown : [],
            storyPerform: [],
            storyCreated: [],
            storyRate: 0,
            totalSubTask: 0,
            totalStory: 0,
            totalBugs: 0
        };
        

        let dateHandlerResult = dateHandler(result.startDate, result.endDate);
        getItemsBySprint(result.id, (error, result) => {

            let totalSubTask = result.filter(item => item.fields.issuetype.subtask).length
            resultDocument.totalSubTask = totalSubTask;

            let totalStory = result.filter(item => !item.fields.issuetype.subtask).length;
            resultDocument.totalStory = totalStory;

            let today = new Date();
            today.setDate(today.getDate() + 1);

            resultDocument.subTaskRate = (totalSubTask / (dateHandlerResult.length - 2));
            resultDocument.storyRate = (totalStory / (dateHandlerResult.length - 2));

            for (i in dateHandlerResult) {
                let dateItem = dateFormat(dateHandlerResult[i], "isoDate");
                resultDocument.dates.push(dateItem);
                resultDocument.idealTaskBurnDown.push(totalSubTask - (i * (totalSubTask / (dateHandlerResult.length - 1))));
                resultDocument.idealstoryBurnDown.push(totalStory - (i * (totalStory / (dateHandlerResult.length - 1))));

                let subTaskPerform = 0;
                let subTaskCreated = 0;
                result.filter(item => item.fields.issuetype.subtask)
                    .forEach(item => {
                        if (dateFormat(item.fields.created, "isoDate") == dateItem)
                            subTaskCreated++;

                        let query = item.fields.resolutiondate;

                        if ((typeof query !== 'undefined' && query) && (dateFormat(query, "isoDate") == dateItem))
                            subTaskPerform++;
                    });

                totalSubTask = totalSubTask - subTaskPerform + subTaskCreated;

                let storyPerform = 0;
                let storyCreated = 0;
                result.filter(item => !item.fields.issuetype.subtask)
                    .forEach(item => {
                        if (dateFormat(item.fields.created, "isoDate") == dateItem)
                            storyCreated++;

                        let query = item.fields.resolutiondate;

                        if ((typeof query !== 'undefined' && query) && (dateFormat(query, "isoDate") == dateItem))
                            storyPerform++;
                    });

                totalStory = totalStory - storyPerform + storyCreated;

                if (dateFormat(today, "isoDate") > dateItem) {
                    resultDocument.subTaskPerform.push(totalSubTask);
                    resultDocument.subTaskCreated.push(subTaskCreated);
                    resultDocument.storyPerform.push(totalStory);
                    resultDocument.storyCreated.push(storyCreated);
                }
            }

            let subTaskIndexPerform = resultDocument.subTaskPerform.length - 1;
            let storyIndexPerform = resultDocument.storyPerform.length - 1;

            resultDocument.subTaskRateDiff = resultDocument.subTaskPerform[subTaskIndexPerform] - resultDocument.idealTaskBurnDown[subTaskIndexPerform]
            resultDocument.storyRateDiff = resultDocument.storyPerform[storyIndexPerform] - resultDocument.idealstoryBurnDown[storyIndexPerform]
            
            callback(null, burnDownTemplate().replace(/{{jsonFile}}/g, JSON.stringify(resultDocument, null, 2))
            .replace(/{{subTaskRate}}/g, Math.round(resultDocument.subTaskRate))
            .replace(/{{subTaskRateDiff}}/g, Math.round(resultDocument.subTaskRateDiff))
            .replace(/{{storyRate}}/g, Math.round(resultDocument.storyRate))
            .replace(/{{storyRateDiff}}/g, Math.round(resultDocument.storyRateDiff))
            .replace(/{{sprintName}}/g, resultDocument.name)
            .replace(/{{sprintGoal}}/g, resultDocument.sprintGoal));
        })
    })
}