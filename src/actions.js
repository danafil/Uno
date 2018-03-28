export const PLAYER_PLAYED = 'PLAYER_PLAYED';
export const play = (card, name, color) => ({
  type: PLAYER_PLAYED,
  card,
  name,
  color
})

export const TAKE_CARDS = 'TAKE_CARDS';
export const takeCards = player => ({
  type: TAKE_CARDS,
  player
});

export const TAKE_NEW_CARD = 'TAKE_NEW_CARD';
export const takeNewCard = (player) => ({
  type: TAKE_NEW_CARD,
  player
})
