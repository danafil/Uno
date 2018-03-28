import { PLAYER_PLAYED, TAKE_CARDS, TAKE_NEW_CARD } from './actions';

const reducer = (state, action) => {
  switch (action.type) {
    case PLAYER_PLAYED:
      return handlePlay(state, action);
    case TAKE_CARDS:
      return handleTakeCards(state, action.player);
    case TAKE_NEW_CARD:
      return handelTakeNewCard(state, action.player);
    default:
      return state;
  }
}

function handleTakeCards(state, player) {
  const { table, deck, players } = state;
  const card = getLastTableCard(table);
  if (card.type[0] === '+') {
    const count = +card.type[1];
    const cardsToTake = deck.slice(0, count);
    const nextDeck = deck.slice(count);

    const index = players.indexOf(player);
    const nextPlayer = {
      name: players[index].name,
      cards: players[index].cards.concat(cardsToTake)
    };

    const nextPlayers = [
      ...players.slice(0, index),
      nextPlayer,
      ...players.slice(index + 1)
    ];

    return {
      ...state,
      deck: nextDeck,
      players: nextPlayers,
      lastPlayerIndex: index,
      mustTakeCards: false,
      skipTurn: false
    }
  } else {
    console.error('Last card is not a + card');
  }
}

function handlePlay(state, action) {
  //check if we have a winner before
  if (state.winner) {
    return state;
  }

  const { card, name, color } = action;
  const player = state.players.find(p => p.name === name);
  if (!isCardValid(card, state.table)) {
    console.log(`Player ${name} played Invalid ${card.type}${card.color}`);
    return state;
  } else {
    if (card.type === '+4' && color) {
      card.setColor(color);
    }
    return playCard(state, card, player);
  }
}

function playCard(state, card, player) {
  const { players, table, lastPlayerIndex, skipTurn } = state;
  const nextPlayer = getNextPlayerIndex(lastPlayerIndex, players, skipTurn);
  
  if (nextPlayer === player) {
    const playerIndex = players.indexOf(player);
    const cardIndex = player.cards.indexOf(card);
    const playerCard = player.cards[cardIndex];
    const nextTable = table.concat(playerCard);

    const currPlayer = {
      name: player.name,
      cards: [
        ...player.cards.slice(0, cardIndex),
        ...player.cards.slice(cardIndex + 1)
      ]
    }

    let nextPlayers = [
      ...players.slice(0, playerIndex),
      currPlayer,
      ...players.slice(playerIndex + 1)
    ]

    if (currPlayer.cards.length === 0) {
      return {
        ...state,
        table: nextTable,
        players: nextPlayers,
        winner: currPlayer
      }
    }

    return {
      ...state,
      players: nextPlayers,
      table: nextTable,
      lastPlayerIndex: playerIndex,
      mustTakeCards: card.type[0] === '+',
      skipTurn: card.type === 'o' || card.type === 'r'
    }
  } else {
    return state;
  } 
}

function handelTakeNewCard(state, player) {
  const { deck, players, lastPlayerIndex, skipTurn } = state;
  const nextPlayer = getNextPlayerIndex(lastPlayerIndex, players, skipTurn);
  const index = players.indexOf(player);
  if (nextPlayer === player) {
    const cardToTake = deck.slice(0, 1);
    const nextDeck = deck.slice(1);
    const currPlayer = {
      name: player.name,
      cards: player.cards.concat(cardToTake)
    };
    const nextPlayers = [
      ...players.slice(0, index),
      currPlayer,
      ...players.slice(index + 1)
    ];
    return {
      ...state,
      players: nextPlayers,
      deck: nextDeck,
      lastPlayerIndex: index,
      mustTakeCards: false,
      skipTurn: false
    }
  } else { 
    return state;
  }
}

function getLastTableCard(table) {
  return table[table.length - 1];
}

function isCardValid(card, table) {
  const tableCard = getLastTableCard(table);
  return card.type === tableCard.type ||
    card.color === tableCard.color ||
    card.type === '+4'
}

function getNextPlayerIndex(lastPlayerIndex, players, skipTurn) {
  let nextTurnIndex = lastPlayerIndex < players.length - 1 ? lastPlayerIndex + 1 : 0;
  if (skipTurn) {
    nextTurnIndex = nextTurnIndex < players.length - 1 ? nextTurnIndex + 1 : 0;
  }
  return players[nextTurnIndex];
}

export default reducer;