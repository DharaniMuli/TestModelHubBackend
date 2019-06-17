const mongoose = require ('mongoose');
const projectSchema = new mongoose.Schema({
    projectID : {
        type: String
    },
    projectName :{
        type: String
    },
    experimentID:{
        type: String
    },
    userName:{
        type: String
    }
});

const projectmodel = mongoose.model('projectmodel', projectSchema);
module.exports = projectmodel;
