var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var EmployeeSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    company: {type: Schema.Types.ObjectId, ref: 'company'},

    past_companies: [{type: Schema.Types.ObjectId, ref: 'company'}],

    duration: [{type: String}]


});

EmployeeSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();


    this.password = this.encryptPassword(this.password);
    next();
})

EmployeeSchema.methods = {
    // check the passwords on signin
    authenticate: function (plainTextPword) {
        return bcrypt.compareSync(plainTextPword, this.password);
    },
    // hash the passwords
    encryptPassword: function (plainTextPword) {
        if (!plainTextPword) {
            return ''
        } else {
            var salt = bcrypt.genSaltSync(10);
            return bcrypt.hashSync(plainTextPword, salt);
        }
    },

    toJson: function () {
        var obj = this.toObject()
        delete obj.password;
        return obj;
    }
};


module.exports = mongoose.model('employee', EmployeeSchema);
