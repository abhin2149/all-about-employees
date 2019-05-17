var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CompanySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },


    owner: {type: Schema.Types.ObjectId, ref: 'employee'},

    employees: [{type: Schema.Types.ObjectId, ref: 'employee'}],

    past_employees: [{type: Schema.Types.ObjectId, ref: 'employee'}]
});

module.exports = mongoose.model('company', CompanySchema);
