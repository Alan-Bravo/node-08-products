const { check } = require('express-validator');
const { validResult } = require('../commons');
const { validToken, validRole } = require('../../services/authService');

const _emailRequired = check('email', 'E-mail required').not().isEmpty();
const _emailValid = check('email', 'E-mail is invalid').isEmail();
const _passwordRequired = check('password', 'Password required')
  .not()
  .isEmpty();

const postLoginRequestValidations = [
  _emailRequired,
  _emailValid,
  _passwordRequired,
  validResult,
];

const validJWT = async (req, rest, next) => {
  try {
    const token = req.header('Authorization');
    const user = await validToken(token);

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

const hasRole = (...roles) => {
  return (req, res, next) => {
    try {
      validRole(req.user, ...roles);
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = {
  postLoginRequestValidations,
  validJWT,
  hasRole,
};
