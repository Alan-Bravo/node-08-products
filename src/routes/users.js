const { Router } = require('express');
const {
  getAllUsers,
  createUser,
  updateUser,
  getById,
  deleteUser,
} = require('../controllers/users');
const {
  postRequestValidations,
  putRequestValidations,
  getAllRequestValidation,
  getRequestValidation,
  deleteRequestValidations,
} = require('../middlerwares/users');

const routes = Router();

routes.get('/', getAllRequestValidation, getAllUsers);
routes.post('/', postRequestValidations, createUser);
routes.put('/:id', putRequestValidations, updateUser);
routes.get('/:id', getRequestValidation, getById);
routes.delete('/:id', deleteRequestValidations, deleteUser);

module.exports = routes;
