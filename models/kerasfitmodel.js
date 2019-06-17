const mongoose = require ('mongoose');
const kerasfitSchema = new mongoose.Schema({
    experimentID : {
        type: String
    },
    projectName:{
        type: String
    },
    x :{
        type: [String],
    },
    y :{
        type: [String],
    },
    batch_size :{
        type: String
    },
    epochs :{
        type:  String
    },
    callbacks :{
        type:  String
    },
    validation_split :{
        type:  String
    },
    validation_data :{
        type:  String
    },
    shuffle :{
        type:  String
    },
    class_weight :{
        type:  String
    },
    sample_weight :{
        type: [String]
    },
    initial_epoch :{
        type:  String
    },
    steps_per_epoch :{
        type: String
    },
    validation_steps :{
        type:  String
    },
});

const kerasfitmodel = mongoose.model('kerasfitmodel', kerasfitSchema);
module.exports = kerasfitmodel;
