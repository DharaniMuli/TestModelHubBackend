const express =require('express');
const kerasfitRoute = express.Router();
const kerasfitmodel = require('../models/kerasfitmodel');
var request = require("request");


let GridFsStorage = require('multer-gridfs-storage');
var mongoose = require('mongoose');
let multer = require('multer');
var Grid = require('gridfs-stream');
require('../resources/db');


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


// Method for Getting Experiment with experiment ID and posting the details to remoteDB
kerasfitRoute.get('/getParams/:expID', function (req, res, next) {
    try{
        kerasfitmodel.findOne({"experiment_id": req.params.expID},{'_id':0}, function (err, data) {
            console.log(data);
            if (err || data==null){
                console.log(err);
                console.log("Experiment doesn't exists");
                res.status(204).json({message: 'Result:Experiment doesn\'t exists' });
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



//Method to get experiment details by experiment id
kerasfitRoute.get('/getExperimentbyID/:expID', function (req, res, next) {
    try{

        // var URLs = []
        kerasfitmodel.findOne({"experiment_id": req.params.expID},{'_id':0}, function (err, data) {
            var result  = data.toObject();
            // console.log(result)
            var completed = 0;
            var complete = function() {
                // completed++;
                // if (completed === result.fileIDs.length - 1) {
                //     console.log("hai")
                //      console.log(URLs)
                    res.json({experiment:result});
                // }
            }


            // console.log(data.fileIDs);
            // console.log(data);
            // res.json(data.fileIDs);;
            // if (err || data==null){
            //     // console.log(err);
            //     // console.log("Experiment doesn't exists");
            //     res.status(204).json({message: 'Result:Experiment doesn\'t exists' });
            // }
            // else {
                var fileURLs = null;
                var fileIDs=[];
                fileIDs= result.fileIDs;
                // console.log(fileIDs);
                var conn = mongoose.connection;
                var gfs = Grid(conn.db, mongoose.mongo);
                gfs.collection('uploadFiles'); // set the collection to look up into
                var types = mongoose.Types;
                var innerCount = 0;
                // console.log(innerCount);
                for(let i = 0; i < fileIDs.length; i++)
                {
                    console.log(innerCount);
                        gfs.files.findOne({_id: types.ObjectId(fileIDs[i] )}, (err, file) => {
                            // console.log(innerCount)
                            // console.log(fileIDs.length)
                            if(file.filename.match( /\S.log/g)){
                                result["logfile"] = 'http://localhost:4000/kerasfitparameters/chunks/'+file._id;
                            }
                            else if(file.filename.match( /\S.hdf5/g)){
                                result["h5"] = 'http://localhost:4000/kerasfitparameters/chunks/'+file._id
                            }
                            else if(file.filename.match( /\S.jpeg|\S.jpg|\S.png/g)){
                                result["architecture"] = 'http://localhost:4000/kerasfitparameters/chunks/'+file._id
                            }
                            else if(file.filename.match( /\S.py/g)){
                                result["predict"] = 'http://localhost:4000/kerasfitparameters/chunks/'+ file._id
                            }
                            else{

                            }


                            if(innerCount == fileIDs.length-1){
                                // console.log(innerCount)
                                // console.log(fileIDs.length)
                                complete();
                            }
                            innerCount++;

                        });


                }
                // console.log(innerCount)
                // console.log(fileIDs.length)
                // if(innerCount == fileIDs.length-1){
                //     // console.log(innerCount)
                //     // console.log(fileIDs.length)
                //     complete();
                // }
            // }

        });
            //.lean().exec();



    }
    catch(ex){
        console.log(ex)
    }
});


// Get File chunks  by Filename from "uploadFiles.chunks" table
kerasfitRoute.get('/chunks/:fileid', function(req, res, next){
    var conn = mongoose.connection;
    var gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploadFiles'); // set the collection to look up into
// In order to find file with file id  we should explicitly tell the mongo about the type of "ObjectId" is
    var types = mongoose.Types;

    gfs.files.findOne({_id: types.ObjectId(req.params.fileid )}, (err, file) => {
        console.log("Received requested file id",req.params.fileid);
        // Check if the input is a valid image or not
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }else {
            const readstream = gfs.createReadStream({_id: req.params.fileid});
            console.log("file content ====================")
            console.log(file);
            res.set('Content-Type', file.contentType)
            readstream.pipe(res);
            // console.log(file.filename);
            // res.json(file);

        }
    });

});


module.exports = kerasfitRoute;
