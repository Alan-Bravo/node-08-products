const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const AppError = require('../errors/appError');
const userService = require('../services/userService');
const config = require('../config');
const logger = require('../loaders/logger');

const login = async (email, password) => {
  try {
    //validación de email
    const user = await userService.findByEmail(email);
    if (!user) {
      throw new AppError(
        'Authentication failed! Email / password does not correct.',
        400
      );
    }

    // Validación de usuario habilitado
    if (!user.enable) {
      throw new AppError('Authentication failed! User disabled.', 400);
    }

    //validación de password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new AppError(
        'Authentication failed! Email / password does not correct.',
        400
      );
    }

    //Generar JWT

    const token = _encrypt(user._id);

    return {
      token,
      user: user.name,
      role: user.role,
    };
  } catch (error) {
    throw error;
  }
};

const validToken = async (token) => {
  try {
    // validar que el token venga como parametro
    if (!token) {
      throw new AppError('Authentication failed! Token required', 401);
    }

    logger.info(`Token received: ${token}`);

    // validar que el token sea integro
    let id;
    try {
      const obj = jwt.verify(token, config.auth.secret);
      id = obj.id;
    } catch (verifyError) {
      throw new AppError('Authentication failed! Invalid Token', 401);
    }

    logger.info(`User id in the token: ${id}`);

    // validar si hay usuario en db
    const user = await userService.findById(id);
    if (!user) {
      throw new AppError(
        'Authentication failed! Invalid Token - User not found',
        401
      );
    }

    // validar si el usuario está habilitado
    if (!user.enable) {
      throw new AppError('Authentication failed! User disabled', 401);
    }

    // retornar el usuario
    return user;
  } catch (error) {
    throw error;
  }
};

const validRole = (user, ...roles) => {
  if (!roles.includes(user.role)) {
    throw new AppError(
      'Authorization failed! User without the privileges',
      403
    );
  }
  return true;
};

_encrypt = (id) => {
  return jwt.sign({ id }, config.auth.secret, { expiresIn: config.auth.ttl });
};

module.exports = {
  login,
  validToken,
  validRole,
};
