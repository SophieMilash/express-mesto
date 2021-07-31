const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  setLikeCard,
  removeLikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.put('/:cardId/likes', setLikeCard);
router.delete('/:cardId/likes', removeLikeCard);
router.delete('/:cardId', deleteCard);

module.exports = router;
