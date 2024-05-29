
const jwt = require("jsonwebtoken");

exports.isAdmin = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return next({ message: "Authorization header is missing", status: 401 });
    }
    
    const [, token] = authorization.split(" ");
    if (!token) {
      return next({ message: "Token is missing", status: 401 });
    }

    const privateKey = process.env.JWT_SECRET || "JWT_SECRET";
    const decodedToken = jwt.verify(token, privateKey);
    
    if (decodedToken.role === "admin") {
      return next();
    } else {
      return next({
        message: "Access denied. Only administrators can access this resource.",
        status: 403,
      });
    }
  } catch (err) {
    return next({ message: err.message, status: 401 });
  }
};
