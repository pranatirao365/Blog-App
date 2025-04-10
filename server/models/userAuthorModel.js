const mongoose = require('mongoose');

//defining schema (user / author)
const userAuthorSchema = new mongoose.Schema({
    role:{
        type:String,
        required : true,
    },
    firstName:{
        type:String,
        required : true,
    },
    lastName:{
        type:String,
        //required : true,
    },
    email :{
        type:String,
        required : true,
    },
    profileImageUrl :{
        type:String,
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{"strict":"throw"})

//create model for (user/author schema)
// Static method to check if a user is an admin
userAuthorSchema.statics.isAdminEmail = async function (email) {
    const admin = await this.findOne({ email, role: "admin" });
    return !!admin; // Returns true if an admin exists
};

const UserAuthor = mongoose.model('userAuthor',userAuthorSchema)

//export 
module.exports = UserAuthor;