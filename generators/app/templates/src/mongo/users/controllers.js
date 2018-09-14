const passport = require('koa-passport');

const User = require('./models/user');
const sendEmail = require('../utils/sendEmail');



exports.register = async function (ctx) {
    const { fullName, email, password } = ctx.request.body;
    const user = await User.create({
        fullName,
        email: email.toLowerCase(),
        password
    });
    ctx.body = user.getAuthData();
};


exports.auth = async function (ctx, next) {
    await passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            ctx.throw(err);
        }
        if (user) {
            ctx.body = user.getAuthData();
            return;
        }
        ctx.status = 400;
        ctx.body = { error: info && info.message || 'Invalid credentials' };
    })(ctx, next);
};

exports.googleAuth = async function (ctx, next) {
    await passport.authenticate('google', { session: false }, (err, user) => {
        if (err) {
            ctx.throw(err);
        }
        if (user) {
            ctx.body = user.getAuthData();
            return;
        }
        ctx.status = 400;
        ctx.body = { error: err };
    })(ctx, next);
};

exports.facebookAuth = async function (ctx, next) {
    await passport.authenticate('facebook', { session: false }, (err, user) => {
        if (err) {
            ctx.throw(err);
        }
        if (user) {
            ctx.body = user.getAuthData();
            return;
        }
        ctx.status = 400;
        ctx.body = { error: err };
    })(ctx, next);
};


exports.setPassword = async function (ctx) {
    const { user } = ctx.state;
    user.password = ctx.request.body.password;
    await user.save();
    ctx.body = { success: true };
};

exports.recoverPassword = async function (ctx) {
    const { email } = ctx.request.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
        ctx.status = 404;
        ctx.body = { error: 'User with this email doesn\'t exist!' };
        return;
    }

    const newPassword = Math.random().toString(36).slice(-6);
    user.password = newPassword;
    await user.save();

    await sendEmail('recover-password', { newPassword }, email);

    ctx.body = { success: true };
};

exports.updatePassword = async function (ctx) {
    const { oldPassword, newPassword, newPasswordConfirmation } = ctx.request.body;
    const { user } = ctx.state;
    if (newPassword !== newPasswordConfirmation) {
        ctx.status = 400;
        ctx.body = { error: 'New password and password confirmation do not match!' };
        return;
    }
    if (user.checkPassword(oldPassword)) {
        user.password = newPassword;
        await user.save();
        ctx.body = { success: true };
        return;
    }
    ctx.status = 400;
    ctx.body = { error: 'Incorrect old password!' };
};



exports.facebookDisconnect = async function (ctx) {
    const { user } = ctx.state;
    user.facebookId = null;
    await user.save();
    ctx.body = { success: true };
};

exports.googleDisconnect = async function (ctx) {
    const { user } = ctx.state;
    user.googleId = null;
    await user.save();
    ctx.body = { success: true };
};
