module.exports = async function (ctx, next) {
    try {
        await next();
    } catch (e) {
        if (e.name === 'ValidationError') {
            ctx.status = 400;
            if (e.hasOwnProperty('details')) {
                ctx.body = { 'error': e.details[0].message };
            } else {
                const errorMessages = [];
                for (let errKey in e.errors) {
                    if (e.errors.hasOwnProperty(errKey)) {
                        errorMessages.push(e.errors[errKey].message);
                    }
                }
                ctx.body = { errors: errorMessages };
            }
        } else {
            ctx.status = e.status || 500;
            ctx.body = {
                success: false,
                message: e.message
            };
        }

    }
};
