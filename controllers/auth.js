const User = require('../models/user');
const {errorHandler} = require('../helpers/dbErrorHandler')
const jwt = require('jsonwebtoken'); // generate signed token
const expressJwt = require('express-jwt'); // for authorization check


exports.signup = (req, res) =>{
    console.log("req.body", req.body);
    const user = new User(req.body)

    user.save((err, user) => {
        if(err) {
            return res.status(400).json({
                err: errorHandler(err)
            })
        }
        user.salt = undefined; // so as to not include into the response
        user.hashed_password = undefined; // same as above
        res.json({
            status: "success",
            user
        });
    })
};

exports.signin = (req, res) => {

    const {email, password} = req.body;
    User.findOne({email}, (err, user) =>{

        if(err || !user){
            return res.status(400).json({
                err: "User with given e-mail does not exist. Please Sign up"
            });
        }

        // if user exists, check for valid password

        //use created authenticate method in user model
        if(!user.authenticate(password)){
            return res.status(401).json({
                error: 'Email and Password donot match'
            });
        }

        //generate a signed token with user id and secret
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);

        // persist the token as 't' in cookie with expiry date
        res.cookie('t', token, {expire: new Date() + 600});

        const {_id, name, email, role} = user;
        // console.log({token, user: {_id, email, name, role}});
        return res.json({token, user: {_id, email, name, role}});
    });

};

exports.signout = (req, res) => {

    res.clearCookie('t');
    res.json({message: "Signout Succesful"});

}

// authenticates token
exports.requireSignin = expressJwt({ //needs cookie parser middleware

    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], // added later
    userProperty: "auth",
    
});

// checks if given /:userId matches with _id decoded from token i.e currently logged in user can only see his own info
// req.auth (declared in userProperty: auth) gives decoded document from which token was genereated , here token was generated using _id of a user 
exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id.toString() === req.auth._id.toString();

    if(!user){
        return res.status(403).json({
            error: "Acces denied",
        });
    }

    next();
};

// checks if user is an admin
exports.isAdmin = (req, res, next) => {

    if(req.profile.role === 0){
        return res.status(403).json({
            error: "Admin Acces denied",
        });
    }
    next();

};