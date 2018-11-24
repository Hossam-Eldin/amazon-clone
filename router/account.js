const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../modules/user');
const config = require('../config');


router.post('/signup', (req, res, next) => {
    var user = new User();

    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    user.picture = user.gravatar();
    user.isSeller = req.body.isSeller;

    console.log(req.body.email);
    console.log(req.body.name);
    console.log(req.body.password);
    //console.log(user.gravatar());

    User.findOne({ email: req.body.email }, function (err, existingUser) {

        if (existingUser) {
            res.json({
                success: false,
                message: 'Account with that email address already exists'
            })
            //req.flash('errors', 'Account with that email address already exists');
            //return res.redirect('/signup');
        } else {
            user.save();
            //generet token
            var token = jwt.sign({
                user: user
            }, config.secret, { expiresIn: '7d' });

            res.json({
                success: true,
                message: 'enjoy your token',
                token: token
            });
        }
    });
});



router.post('/login', (req, res, next) => {

    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) throw err;

        if (!user) {
            res.json({
                success: false,
                message: 'Authenticeted failed, user not found'
            });
        } else if (user) {

            let validPassowrd = user.comparePassword(req.body.password);
            if (!validPassowrd) {
                res.json({
                    success: false,
                    message: 'Authenticeted failed , Wrong Password'
                });
            } else {
                //generet token
                var token = jwt.sign({
                    user: user
                }, config.secret, { expiresIn: '7d' });

                res.json({
                    success: true,
                    message: 'Enjoy your token',
                    token: token
                });
            }
        }
    })
})

module.exports = router;