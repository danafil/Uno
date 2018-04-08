import { PLAYER_PLAYED, TAKE_CARDS, TAKE_NEW_CARD } from './actions';
import Card from './models';

const reducer = (state, action) => {
  switch (action.type) {
    case PLAYER_PLAYED:
      return handlePlay(state, action);
    case TAKE_CARDS:
      return handleTakeCards(state, action.player);
    case TAKE_NEW_CARD:
      return handleTakeNewCard(state, action.player);
    default:
      return state;
  }
}

function handleTakeCards(state, player) {
  const { table, deck, players } = state;
  const card = getLastTableCard(table);
  if (card.type[0] === '+') {
    const count = +card.type[1];
    const {
      cards: cardsToTake, 
      deck: nextDeck,
      table: nextTable
    } = takeCards(count, deck, table);

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
      table: nextTable,
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
  const { players, table, lastPlayerIndex, skipTurn, direction } = state;
  const nextPlayer = getNextPlayerIndex(lastPlayerIndex, players, skipTurn, direction);
  
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
      skipTurn: card.type === 'o',
      direction: card.type === 'r' ? reverse(direction) : direction
    }
  } else {
    return state;
  } 
}

function handleTakeNewCard(state, player) {
  const { deck, table, players, lastPlayerIndex, skipTurn, direction } = state;
  const nextPlayer = getNextPlayerIndex(lastPlayerIndex, players, skipTurn, direction);
  const index = players.indexOf(player);
  if (nextPlayer === player) {
    const {
      cards: cardsToTake, 
      deck: nextDeck,
      table: nextTable
    } = takeCards(1, deck, table);
    const currPlayer = {
      name: player.name,
      cards: player.cards.concat(cardsToTake)
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
      table: nextTable,
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

function getNextPlayerIndex(lastPlayerIndex, players, skipTurn, direction) {
  const move = direction === 'cw' ? 1 : -1;
  const jump = skipTurn ? 2 : 1;
  const nextTurnIndex = (lastPlayerIndex + players.length + move*jump) % players.length;
  return players[nextTurnIndex];
}

function reverse(direction) {
  return direction === 'cw' ? 'ccw' : 'cw' ;
}

function takeCards(n, deck, table) {
  if (deck.length > n) {
    return {
      cards: deck.slice(0, n),
      deck: deck.slice(n),
      table
    }
  } else {
    const { deck: nextDeck, table: nextTable } = renewDeck(deck, table);
    console.log('RENEW', nextDeck, nextTable);
    return takeCards(n, nextDeck, nextTable);
  }
}

function renewDeck(deck, table) {
  const cards = resetCards(shuffle(table.slice(0, table.length - 1)));
  return {
    deck: deck.concat(cards),
    table: table.slice(table.length - 1)
  }
}

function resetCards(deck) {
  return deck.map( c => {
    if (c.type === '+4') {
      return new Card(c.type, null)
    }

    return c;
  })
}

function shuffle(arr) {
  var i = 0
    , j = 0
    , temp = null;
  for (i = arr.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
  return arr;
};

export default reducer;