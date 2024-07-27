const authorizationMiddleware = (requiredRole) => {
  return (req, res, next) => {
    const { role } = req.user;

    if (role === requiredRole || role === 0) {
      next();
    } else {
      res
        .status(403)
        .send({ code: 1, mess: "You cannot access to these functions" });
    }
  };
};

module.exports = authorizationMiddleware;