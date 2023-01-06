const UserSchema = require('../Schema/UserSchema')
const {comparePassword} = require('../ultis/token')


class UserAuth {
    async register(req,res) {
        const {email} = req.body

        // check if the user exists
        const userExists = await UserSchema.findOne({email})        
        if(userExists){
            return res.status(404).json({message:'USER ALREADY EXIST'})
        }
       
        const user = await UserSchema.create(req.body)
        const registerToken = user.createToken(process.env.time)

        res.status(200).json({user, registerToken})
    }


    async login (req,res) {
        const {email, password} = req.body 
      
        const user = await UserSchema.findOne({email}).select("+password")
        if(!user){
            return res.status(404).json({message:'USER DOES NOT EXIST'})
        }
        
        const isMatch = await comparePassword(password, user.password)   
        if(!isMatch){
            return res.status(400).json({message:"YOU HAVE ENTERED WRONG CREDENTIALS"})
        } 

        const loginToken = user.createToken(process.env.time)
        res.status(200).json({message:"USER LOGGED IN", user, loginToken})
    }
    

    async forgotPassword (req,res) {
        const {email} = req.body 
        const user = await UserSchema.findOne({email})
        
        if(!user){
            return res.status(404).json({message: 'EMAIL DOES NOT EXIST'})
        }
        
        const pin = user.send2FACode()
        await user.save()

        res.status(200).json({message:'RESET PASSWORD USING THIS PIN', pin})
    }

    async resendPin (req,res) {
        const {email} = req.body
        const user = await UserSchema.findOne({email})
        if(!user){
            return res.status(404).json({message:'ENTER YOUR SIGN IN EMAIL'})
        }

        const pin = user.send2FACode()
        await user.save()

        res.status(200).json({message: "PIN RESENT", pin})
    }

    async resetPassword (req,res) {
        const { password, pin } = req.body
        
        const user = await UserSchema.findOne({
            FACode:pin,
            FACodeExp:{ $gt: Date.now() }
        }).select('+password')
        
        if(!user){
            return res.status(200).json({message:"TOKEN EXPIRED"})
        }

        user.FACode = undefined
        user.FACodeExp = undefined
        user.password = password

        await user.save()

        res.status(200).json({message:'PASSWORD CHANGED'})
    }


    async resetCurrentPassword(req,res){
        const {currentPassword, newPassword, userId} = req.body
        
        const user = await UserSchema.findById(userId).select('+password')
        
        if(!user){
            return res.status(404).json({message: 'USER DOES NOT EXIST'})
        }
       
        const isMatch = await comparePassword(currentPassword,user.password)
        if(!isMatch){
            return res.status(404).json({message: 'INCORRECT PASSWORD'})
        }

        user.password = newPassword
        await user.save()

        res.status(200).json({message:"PASSWORD CHANGED", user})
    }



}

module.exports = new UserAuth()