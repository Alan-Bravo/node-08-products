const { Router } = require('express');
const {
  getAllUsers,
  createUser,
  updateUser,
  updatePartialUser,
  deleteUser,
} = require('../controllers/users');

const routes = Router();

routes.get('/', getAllUsers);
routes.post('/', createUser);
routes.put('/:id', updateUser);
routes.patch('/:id', updatePartialUser);
routes.delete('/:id', deleteUser);

module.exports = routes;
