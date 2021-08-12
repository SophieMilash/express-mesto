require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const usersRoute = require('./routes/user');
const cardsRoute = require('./routes/card');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const error = require('./middlewares/error');

const NotFoundError = require('./errors/not-found-err');

const { PORT = 3000 } = process.env;
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(helmet());
app.use(limiter);
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().required().pattern(/https?:\/\/(www\.)?[a-zA-Z\d\-.]{1,}\.[a-z]{1,6}([\/a-z0-9\-._~:?#[\]@!$&'()*+,;=]*)/),
  }),
}), createUser);

app.use(auth);

app.use('/users', usersRoute);
app.use('/cards', cardsRoute);

app.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errors());
app.use(error);

app.listen(PORT);
