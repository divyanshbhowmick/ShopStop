const JWT = require('jsonwebtoken');
const createError = require('http-errors');

const signAccessToken = (userID) =>
  new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.ACCESS_TOKEN_KEY;
    const options = {
      expiresIn: '1h',
      issuer: 'shopstop.live',
      audience: userID,
    };
    JWT.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err.message);
        return reject(createError.InternalServerError());
      }
      return resolve(token);
    });
  });

const verifyAccessToken = (req, res, next) => {
  try {
    if (!req.headers.authorization) return next(createError.Unauthorized());
    const accessToken = req.headers.authorization.split(' ')[1];
    JWT.verify(accessToken, process.env.ACCESS_TOKEN_KEY, (err, payload) => {
      if (err) return next(createError.Unauthorized());
      req.payload = payload;
      next();
    });
  } catch (error) {
    return next(createError.Unauthorized());
  }
};

module.exports = { signAccessToken, verifyAccessToken };
