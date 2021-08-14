const router = require('express').Router();

const {
  getCards, createCard, deleteCard, setLikeCard, removeLikeCard,
} = require('../controllers/cards');
const { cardValidation, cardIdValidation } = require('../middlewares/validation');

router.get('/', getCards);
router.post('/', cardValidation, createCard);
router.put('/:cardId/likes', cardIdValidation, setLikeCard);
router.delete('/:cardId/likes', cardIdValidation, removeLikeCard);
router.delete('/:cardId', cardIdValidation, deleteCard);

module.exports = router;
