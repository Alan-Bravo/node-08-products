const { check } = require('express-validator');
const AppError = require('../../errors/appError');
const userService = require('../../services/userService');
const { ROLES, ADMIN_ROLE } = require('../../constants');
const { validResult } = require('../commons');
const { validJWT, hasRole } = require('../auth');

const _nameRequired = check('name', 'Name required').not().isEmpty();
const _lastNameRequired = check('lastName', 'Last Name required')
  .not()
  .isEmpty();
const _emailRequired = check('email', 'E-mail required').not().isEmpty();
const _emailValid = check('email', 'E-mail is invalid').isEmail();
const _emailExists = check('email').custom(async (email = '') => {
  const userFound = await userService.findByEmail(email);
  if (userFound) {
    throw new AppError('Email already exists in DB', 400);
  }
});
const _optionalEmailValid = check('email', 'E-mail is invalid')
  .optional()
  .isEmail();
const _optionalEmailExists = check('email')
  .optional()
  .custom(async (email = '') => {
    const userFound = await userService.findByEmail(email);
    if (userFound) {
      throw new AppError('Email already exists in DB', 400);
    }
  });
const _passwordRequired = check('password', 'Password required')
  .not()
  .isEmpty();
const _roleValid = check('role')
  .optional()
  .custom(async (role = '') => {
    if (!ROLES.includes(role)) {
      throw new AppError('Invalid Role', 400);
    }
  });
const _dateValid = check('birthdate').optional().isDate('MM-DD-YYYY');

const _idRequired = check('id').not().isEmpty();
const _idIsMongoDB = check('id').isMongoId();
const _idExists = check('id').custom(async (id = '') => {
  const userFound = await userService.findById(id);
  if (!userFound) {
    throw new AppError('The id does not exists in DB', 400);
  }
});

const postRequestValidations = [
  validJWT,
  hasRole(ADMIN_ROLE),
  _nameRequired,
  _lastNameRequired,
  _emailRequired,
  _emailValid,
  _emailExists,
  _passwordRequired,
  _dateValid,
  _roleValid,
  validResult,
];

const putRequestValidations = [
  validJWT,
  hasRole(ADMIN_ROLE),
  _idRequired,
  _idIsMongoDB,
  _idExists,
  _optionalEmailValid,
  _optionalEmailExists,
  _roleValid,
  _dateValid,
  validResult,
];

const deleteRequestValidations = [
  validJWT,
  hasRole(ADMIN_ROLE),
  _idRequired,
  _idIsMongoDB,
  _idExists,
  validResult,
];

const getAllRequestValidation = [validJWT];

const getRequestValidation = [
  validJWT,
  _idRequired,
  _idIsMongoDB,
  _idExists,
  validResult,
];

module.exports = {
  postRequestValidations,
  putRequestValidations,
  getAllRequestValidation,
  getRequestValidation,
  deleteRequestValidations,
};
