export const play = (card, name) => ({
  type: 'PLAYER_PLAYED',
  card,
  name
})

export const takeCard = (turnIndex, players) => ({
  type: 'TAKE_CARD',
  player: players[turnIndex]
})

export const pickColor = (color) => ({
  type: 'COLOR_PICKED',
  color
})
