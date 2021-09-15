const express = require('express');
const router = express.Router();


const {
    requireSignin,
    isAuth,
    isAdmin
} = require('../controllers/auth');
const {
    userById,
    read,
    update,
    readNameOnly
} = require('../controllers/user');

//'/secret/:userId', requireSignin, isAuth, isAdmin,
router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req, res) => {

    console.log("auth: ", req.auth);

    res.json({
        user: req.profile
    });
});

router.get("/user/get/:userId", requireSignin, isAuth, read);
router.get("/user/getname/:userId", readNameOnly);

router.put("/user/update/:userId", requireSignin, isAuth, update);


router.param('userId', userById);

module.exports = router;