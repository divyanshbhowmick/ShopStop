const router = require('express').Router();
const createError = require('http-errors');
const User = require('../models/User');
const { registerSchema, loginSchema } = require('../utils/helpers/validator');
const {
  signAccessToken,
  signRefreshToken,
} = require('../utils/helpers/jwtHelper');

router.post('/register', async (req, res, next) => {
  try {
    const validatedData = await registerSchema.validateAsync(req.body);
    const { email, password, name } = validatedData;
    const doesExists = await User.findOne({ email });

    if (doesExists) throw createError.Conflict(`${email} already exists!`);
    const user = new User({ email, name, password });
    const savedUser = await user.save();
    const accessToken = await signAccessToken(savedUser.id);
    const refreshToken = await signRefreshToken(savedUser.id);
    res.send({ accessToken, refreshToken });
  } catch (error) {
    if (error.isJoi) error.status = 422;
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const validatedData = await loginSchema.validateAsync(req.body);
    const { email, password } = validatedData;
    const user = await User.findOne({ email });
    if (!user) throw createError.NotFound('User not registered!');
    const isAuthenticated = user.isValidPassword(password);
    if (!isAuthenticated)
      throw createError.Unauthorized('Username/Password not valid!');
    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);
    res.send({ accessToken, refreshToken });
  } catch (error) {
    if (error.isJoi) next(createError.BadRequest('Invalid Username/Password!'));

    next(error);
  }
});

router.post('/refresh-token', (req, res) => {
  res.send('refresh token!');
});

router.post('/logout', (req, res) => {
  res.send('logout');
});

module.exports = router;
