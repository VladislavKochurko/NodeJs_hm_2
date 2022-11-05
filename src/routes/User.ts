import express from "express";

import controllers from '../controllers/User';
import { userValidator } from '../middleware/validateUser';

const router = express.Router();

router.post('/', userValidator, controllers.createUser);
router.patch('/:userId', userValidator, controllers.updateUser);
router.delete('/:userId', controllers.deleteUser);
router.delete('/soft/:userId', controllers.deleteSoftUser);
router.get('/all', controllers.readAllUser);
router.get('/:userId', controllers.readUser);
router.post('/autosuggest', controllers.getAutoSuggestUsers);

export = router;