const { celebrate, Joi } = require('celebrate');

const minLength = 2;
const maxLength = 30;
const minPasswordLength = 6;
const idLength = 24;

const stringValidation = Joi.string().min(minLength).max(maxLength);
// eslint-disable-next-line no-useless-escape
const linkValidation = Joi.string().pattern(/https?:\/\/(www\.)?[a-zA-Z\d\-.]{1,}\.[a-z]{1,6}([\/a-z0-9\-._~:?#[\]@!$&'()*+,;=]*)/);
const emailValidation = Joi.string().required().email();
const passwordValidation = Joi.string().required().min(minPasswordLength);

const userKeys = {
  name: stringValidation.required(),
  about: stringValidation.required(),
};
const avatarKeys = {
  avatar: linkValidation.required(),
};
const loginKeys = {
  email: emailValidation,
  password: passwordValidation,
};
const registrationKeys = {
  ...loginKeys,
  name: stringValidation,
  about: stringValidation,
  avatar: linkValidation,
};
const cardKeys = {
  name: stringValidation.required(),
  link: linkValidation.required(),
};
const cardIdKeys = {
  cardId: Joi.string().required().hex().length(idLength),
};
const userIdKeys = {
  userId: Joi.string().required().hex().length(idLength),
};

function setJoyValidation(keys) {
  celebrate({
    body: Joi.object().keys(keys),
  });
}

function setIdValidation(keys) {
  celebrate({
    params: Joi.object().keys(keys),
  });
}

const loginValidation = () => setJoyValidation(loginKeys);
const registrationValidation = () => setJoyValidation(registrationKeys);
const cardValidation = () => setJoyValidation(cardKeys);
const avatarValidation = () => setJoyValidation(avatarKeys);
const userValidation = () => setJoyValidation(userKeys);
const cardIdValidation = () => setIdValidation(cardIdKeys);
const userIdValidation = () => setIdValidation(userIdKeys);

module.exports = {
  cardValidation,
  avatarValidation,
  userValidation,
  cardIdValidation,
  userIdValidation,
  loginValidation,
  registrationValidation,
};
