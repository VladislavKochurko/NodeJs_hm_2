import { NextFunction, Request, Response } from "express";
import * as uuid from 'uuid';

import User from '../models/User';

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { login, password, age } = req.body;

  const user = new User({
    id: uuid.v4(),
    login,
    password,
    age,
    isDeleted: false,
  });

  return user.save()
    .then(user => res.status(201).json({ user }))
    .catch(error => res.status(500).json({ error }));
};

export const readUser = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.userId;

  return User.findOne({ id: userId })
    .then(user => user ? res.status(200).json({ user }) : res.status(404).json({ message: 'Not Found' }))
    .catch(error => res.status(500).json({ error }));
};

export const readAllUser = (req: Request, res: Response, next: NextFunction) => {
  return User.find({})
    .then(users => res.status(200).json({ users }))
    .catch(error => res.status(500).json({ error }));
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.userId;

  return User.findOne({
    id: userId
  })
    .then(user => {
      if (user != null) {
        user.set(req.body);

        return user.save()
          .then(user => res.status(201).json({ user }))
          .catch(error => res.status(500).json({ error }));
      }
      res.status(404).json({ message: 'Not Found' })
    })
    .catch(error => res.status(500).json({ error }));
};

export const deleteUser = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.userId;

  return User.deleteOne({
    id: userId
  })
    .then(user => user ? res.status(201).json({ message: 'deleted' }) : res.status(404).json({ message: 'Not Found' }))
    .catch(error => res.status(500).json({ error }));
};

export const deleteSoftUser = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.userId;

  return User.findOne({ id: userId })
    .then(user => {
      if (user != null) {
        user.set('isDeleted', true);

        return user.save()
          .then(() => res.status(201).json({ message: 'Soft deleted' }))
          .catch(error => res.status(500).json({ error }));
      }
      res.status(404).json({ message: 'Not Found' })
    })
    .catch(error => res.status(500).json({ error }));
};

export const getAutoSuggestUsers = (req: Request, res: Response, next: NextFunction) => {
  const { loginSubstring, limit } = req.body;
  return User.find({
    login: { $regex: `${loginSubstring}`, $options: 'i'},
  })
    .sort('login')
    .limit(limit || 10)
    .then(users => users.length > 0 ? res.status(200).json({ users }) : res.status(200).json({ users: [] }))
    .catch(error => res.status(500).json({ error }));
}

export default  { createUser, readUser, readAllUser, updateUser, deleteUser, deleteSoftUser, getAutoSuggestUsers };