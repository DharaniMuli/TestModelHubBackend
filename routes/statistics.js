const express =require('express');
const kerasfitRoute = express.Router();
const kerasfitmodel = require('../models/kerasfitmodel');
var request = require("request");
require('../resources/db');

// Find the number of experiments of the specific user (from overall projects)
kerasfitRoute.get('/getExpCountByusername/:username', function (req, res, next) {
    kerasfitmodel.aggregate(
        [
            {
                $match:{
                    'user_name':req.params.username,
                }
            },
            {
                $group : {
                    _id : "$user_name",
                    total_experiments : {$sum : 1},
                }
            }
        ],  function (err, data){
            if (err) console.log(err);
            res.json(data);
        });

})

// Find the number of experiments for each project of the specific user
kerasfitRoute.get('/getExpCountByProject/:username', function (req, res, next) {
    parameters = new kerasfitmodel(req.body)
    kerasfitmodel.aggregate(
        [
            {
                $match:{
                    'user_name':req.params.username,


                }
            },
            {
                $group : {
                    _id : {
                        user_name:  "$user_name",
                        project_name:"$project_name"
                    },
                    total_experiements : {$sum : 1},

                }
            }
        ],  function (err, data){
            if (err) console.log(err);
            res.json(data);
        });

})

//Find number of Projects - In progress

kerasfitRoute.get('/getProjectCountByusername/:username', function (req, res, next) {
    parameters = new kerasfitmodel(req.body)
    kerasfitmodel.aggregate(
        [
            {
                $match:{
                    'user_name':req.params.username,


                }
            },
            {
                $group : {
                    _id: '$user_name',


                }


            },
            {
                $group : {
                    _id: "$project_name",
                    Count : {$sum : 1},


                }


            },

        ],  function (err, data){
            if (err) console.log(err);
            res.json(data);
        });

})

// kerasfitRoute.get('/getProjectCountByusername/:username', function (req, res, next) {
//     kerasfitmodel.countDocuments({ user_name: { $eq:req.params.username  } },  function (err, data){
//         if (err) console.log(err);
//         res.json(data);
//     });
//
// })
module.exports = kerasfitRoute;
