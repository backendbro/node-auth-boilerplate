const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

function customCreateToken(payload, time){
    const token = jwt.sign({payload}, process.env.SECRET_KEY, { expiresIn: time });
    return token;
}


function decryptJwt(token){
   try {
    const userId = jwt.verify(token, process.env.SECRET_KEY)
    return userId.payload
   } catch (error) {
    return
   }
}

const comparePassword = async (password, hashedPassword) => {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid;
  };

module.exports = {customCreateToken, decryptJwt, comparePassword}