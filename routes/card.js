const router = require('express').Router();

const {
  getCards, createCard, deleteCard, setLikeCard, removeLikeCard,
} = require('../controllers/cards');
const { cardValidation, setIdValidation } = require('../middlewares/validation');

router.get('/', getCards);
router.post('/', cardValidation, createCard);
router.put('/:cardId/likes', setIdValidation, setLikeCard);
router.delete('/:cardId/likes', setIdValidation, removeLikeCard);
router.delete('/:cardId', setIdValidation, deleteCard);

module.exports = router;
