module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    if (e.name === 'ValidationError') {
      ctx.status = 400;
      if (e.details) {
        ctx.body = { error: e.details[0].message };
      } else {
        ctx.body = {
          errors: e.errors.map(errKey => e.errors[errKey].message),
        };
      }
    } else {
      ctx.status = e.status || 500;
      ctx.body = {
        success: false,
        message: e.message,
      };
    }
  }
};
