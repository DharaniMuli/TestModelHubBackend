const express =require('express');
const kerasfitRoute = express.Router();
const kerasfitmodel = require('../models/kerasfitmodel');


// Method for Posting Experiment
kerasfitRoute.post('/', function (req, res, next) {

    let kerasFitparameters = new kerasfitmodel(req.body);
    console.log(req.body);
    // kerasFitparameters.expRunDate = new Date();
    kerasfitmodel.create(kerasFitparameters)
        .then(kerasFitparameters => {
            res.status(200).json({kerasFitparameters,message: 'Result: Experiment for kerasFit parameters added successfully'});
            console.log('kerasFitparameters after storing into DB', kerasFitparameters);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});
// Method for Getting Experiment with experiment ID
kerasfitRoute.get('/getParams/:expID', function (req, res, next) {
    kerasfitmodel.find({"experimentID": req.params.expID}, function (err, data) {
        if (err) console.log(err);
        // console.log(req.params.modelID);
        var comments = data;
        // console.log(comments);
        res.json(data);
    }).lean().exec();
});
module.exports = kerasfitRoute;
