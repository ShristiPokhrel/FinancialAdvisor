const jwt=require('jsonwebtoken')
const generateToken = async(payload) => {
    return await jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn: "30d"
    });
};
module.exports = generateToken;