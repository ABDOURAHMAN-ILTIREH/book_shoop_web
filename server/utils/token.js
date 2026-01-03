const jwt = require("jsonwebtoken");

const create_Token = (id) =>{
    return jwt.sign({_id:id}, process.env.SECRET , {expiresIn: "1h"});
}


module.exports = { create_Token };
