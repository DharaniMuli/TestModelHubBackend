const express =require('express');
const projectRoute = express.Router();
const projectModel = require('../models/projects');


// Method for Posting Projects
projectRoute.post('/', function (req, res, next) {

    let projectparameters = new projectModel(req.body);
    console.log(req.body);
    projectModel.create(projectparameters)
        .then(projectparameters => {
            res.status(200).json({projectparameters,message: 'Result: Project added successfully'});
            console.log('project parameters after storing in DB', projectparameters);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});
// Method for Getting Projects
projectRoute.get('/getParams/:projectID', function (req, res, next) {
    projectModel.find({"projectID": req.params.projectID}, function (err, data) {
        if (err) console.log(err);
        // console.log(req.params.modelID);
        res.json(data);
    }).lean().exec();
});
module.exports = projectRoute;
