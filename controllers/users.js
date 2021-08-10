const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_SECRET } = process.env;

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id }, JWT_SECRET, { expiresIn: '7d' },
      );

      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: `Произошла ошибка: ${err.message}` });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err.message}` }));
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => {
      const error = new Error('Пользователь по указанному _id не найден.');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Пользователь по указанному _id не найден.' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err.message}` });
      }
    });
};

module.exports.getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail(() => {
      const error = new Error('Пользователь по указанному _id не найден.');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Пользователь по указанному _id не найден.' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err.message}` });
      }
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err.message}` });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  const { userId } = req.params;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      const error = new Error('Пользователь с указанным _id не найден.');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Пользователь с указанным _id не найден.' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err.message}` });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const { userId } = req.params;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      const error = new Error('Пользователь с указанным _id не найден.');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Пользователь с указанным _id не найден.' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err.message}` });
      }
    });
};
