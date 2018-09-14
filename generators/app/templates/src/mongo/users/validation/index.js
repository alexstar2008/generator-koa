const {
    object,
    string,
    boolean
} = require('koa-context-validator');


module.exports = {
    register: {
        body: object().keys({
            fullName: string().required(),
            email: string().required(),
            password: string().min(6).required()
        })
    },
    auth: {
        body: object().keys({
            email: string().required(),
            password: string().required()
        })
    },
    recoverPassword: {
        body: object().keys({
            email: string().required()
        })
    },
    setPassword: {
        body: object().keys({
            password: string().min(6).required()
        })
    },
    updatePassword: {
        body: object().keys({
            oldPassword: string().required(),
            newPassword: string().min(6).required(),
            newPasswordConfirmation: string().min(6).required()
        })
    }
};
