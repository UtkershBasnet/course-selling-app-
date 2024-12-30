const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");
function adminMiddleware(req,res,next){
    const token = req.headers.authorization;
    const verify = jwt.verify(token, JWT_ADMIN_PASSWORD);
    if(!verify){
        res.status(401).json({
            message: "unauthorized"
        })
    }else{
        req.adminId = verify.id;
        next();
    }
}



// function middleware(password) {
//     return function(req, res, next) {
//         const token = req.headers.token;
//         const decoded = jwt.verify(token, password);

//         if (decoded) {
//             req.userId = decoded.id;
//             next()
//         } else {
//             res.status(403).json({
//                 message: "You are not signed in"
//             })
//         }    
//     }
// }


module.exports = {
    adminMiddleware: adminMiddleware
}