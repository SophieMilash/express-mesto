const { celebrate, Joi } = require('celebrate');

const minLength = 2;
const maxLength = 30;
const minPasswordLength = 6;
const idLength = 24;

const stringValidationWithLength = Joi.string().required().min(minLength).max(maxLength);
// eslint-disable-next-line no-useless-escape
const linkValidation = Joi.string().required().pattern(/https?:\/\/(www\.)?[a-zA-Z\d\-.]{1,}\.[a-z]{1,6}([\/a-z0-9\-._~:?#[\]@!$&'()*+,;=]*)/);
const emailValidation = Joi.string().required().email();
const passwordValidation = Joi.string().required().min(minPasswordLength);

const userKeys = {
  name: stringValidationWithLength,
  about: stringValidationWithLength,
};
const avatarKeys = {
  avatar: linkValidation,
};
const loginKeys = {
  email: emailValidation,
  password: passwordValidation,
};
const registrationKeys = {
  ...loginKeys,
  ...userKeys,
  ...avatarKeys,
};
const cardKeys = {
  name: stringValidationWithLength,
  link: linkValidation,
};

function setJoyValidation(keys) {
  celebrate({
    body: Joi.object().keys(keys),
  });
}

function setIdValidation() {
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().hex().length(idLength),
    }),
  });
}

const loginValidation = setJoyValidation(loginKeys);
const registrationValidation = setJoyValidation(registrationKeys);
const cardValidation = setJoyValidation(cardKeys);
const avatarValidation = setJoyValidation(avatarKeys);
const userValidation = setJoyValidation(userKeys);

module.exports = {
  loginValidation,
  registrationValidation,
  setIdValidation,
  cardValidation,
  avatarValidation,
  userValidation,
};
