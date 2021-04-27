const { Router } = require('express');
const { login } = require('../controllers/auth');
const { postLoginRequestValidations } = require('../middlerwares/auth');

const routes = Router();

routes.post('/login', postLoginRequestValidations, login);

module.exports = routes;
