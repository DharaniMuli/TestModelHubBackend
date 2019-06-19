const express =require('express');
const kerasfitRoute = express.Router();
const kerasfitmodel = require('../models/kerasfitmodel');
var request = require("request");


// Method for Posting Experiment
kerasfitRoute.post('/', function (req, res, next) {

    let kerasFitparameters = new kerasfitmodel(req.body);
    console.log(req.body);
    // kerasFitparameters.expRunDate = new Date();
    kerasfitmodel.create(kerasFitparameters)
        .then(kerasFitparameters => {
            res.json({kerasFitparameters,message: 'Result: Experiment for kerasFit parameters added successfully'});
            console.log('kerasFitparameters after storing into DB', kerasFitparameters);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});


// Method for Getting Experiment with experiment ID
kerasfitRoute.get('/getParams/:expID', function (req, res, next) {
    try{
        kerasfitmodel.findOne({"experiment_id": req.params.expID}, function (err, data) {
            console.log(data);
            if (err){
                console.log(err);
            }
            else {
                console.log(JSON.stringify(data))
                request.post({
                    "headers": {"content-type": "application/json"},
                    "url": "https://testmodelhubbackend.herokuapp.com/kerasfitparameters",
                    "body": JSON.stringify(data)
                }, (error, dat) => {
                    if (error) {
                        res.json(error);
                    }
                    else{
                        res.json(dat);
                    }

                });
            }
        }).lean().exec();

    }
    catch{
        console.log("Error")
    }
});


// Method for Getting Experiment with experiment ID
kerasfitRoute.get('/getallexperiments', function(req,res,next){

    try{
        kerasfitmodel.find({},function (err, data) {
            if (err){
                console.log(err);
            }
            else {
                console.log(JSON.stringify(data));
                res.json(data);

            }
        }).lean().exec();

    }
    catch{
        console.log("Error")
    }

});

module.exports = kerasfitRoute;
