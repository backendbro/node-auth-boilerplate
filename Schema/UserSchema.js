const { Schema, model } = require('mongoose')
const {customCreateToken} = require('../ultis/token')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const UserSchema = new Schema ({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
          ]
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    FACode:String,
    FACodeExp:Date,
}, {timestamps:true})


UserSchema.pre('save', async function(next) {
    if(!this.isModified('password')){
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createToken = function(time){
    const token = customCreateToken(this._id, time)
    return token
}

UserSchema.methods.send2FACode = function(){
    const token = crypto.randomBytes(3).toString('hex')
    this.FACode = token

    this.FACodeExp = Date.now() + 100 * 60 * 1000
    return token
}

module.exports = model('User', UserSchema)