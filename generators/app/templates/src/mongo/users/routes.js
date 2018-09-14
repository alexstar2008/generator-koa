const passport = require('koa-passport');
const Router = require('koa-router');
const { default: validator } = require('koa-context-validator');

const UserController = require('./controllers');
const validation = require('./validation');

const router = new Router({
    prefix: '/users'
});

router.post('/auth', validator(validation.auth), UserController.auth);
router.post('/register', validator(validation.register), UserController.register);
router.post('/recover-password', validator(validation.recoverPassword), UserController.recoverPassword);

router.get('/google/auth', UserController.googleAuth);
router.get('/facebook/auth', UserController.facebookAuth);

router.use(passport.authenticate('jwt', { session: false }));
router.post('/password', validator(validation.setPassword), UserController.setPassword);
router.put('/password', validator(validation.updatePassword), UserController.updatePassword);

router.get('/google/connect', UserController.googleAuth);
router.get('/google/disconnect', UserController.googleDisconnect)
router.get('/facebook/connect', UserController.facebookCodeAuth);
router.get('/facebook/disconnect', UserController.facebookDisconnect);




module.exports = router;
