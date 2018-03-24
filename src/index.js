import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const types = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "+2", "+4", "r", "o"].map( t => t + '');
const colors = ["yellow", "blue", "green", "red"];

class Card {
  constructor(type, color) {
    this.type = type;
    this.color = color;
  }

  toString() {
    return this.type + this.color;
  }
}

function createCards() {
  return types.reduce(
    (acc, next) => 
        acc.concat(colors.map( c => {
          if (next === '+4') {
            return new Card(next, null)
          } else { 
            return new Card(next, c) 
          } 
        }
      )), []);
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

const initializeDeck = () => {
  const recShuffle = (deck) => {
    shuffle(deck);
    if (deck[14].type[0] === '+' ) {
      recShuffle(deck);
    } 
  };

  const deck = createCards();
  recShuffle(deck);
  return deck;
};

const deck = initializeDeck();

const players = [
  {name: 'You', cards: deck.splice(0, 7)},
  {name: 'Bot', cards: deck.splice(0, 7)}
];

const table = [deck.shift()];

const InitialState = {
  deck,
  players,
  table,
  turnIndex: 0,
  coloredCard: false,
  winner: null
};

const getBotCard = (tableCard, cards) => {
  const card = cards.find(c => c.type === tableCard.type ||
    c.color === tableCard.color || 
    c.type === '+4');
  
  if (card && card.type === '+4') {
    card.color = getBotColor(cards);
  }
  return card || null;
};

const getBotColor = cards => {
  const colors = {
    red: 0,
    blue: 0,
    green: 0,
    yellow: 0
  }
  const m = cards.reduce((acc, card) => {
    if (card.color) {
      acc[card.color]++
    }
    return acc;
  }, colors);

  return Object.keys(m).reduce((prev, next) => m[prev] < m[next] ? next : prev);
}

const isCardValid = (card, table) => {
  return card.type === table[table.length - 1].type || 
  card.color === table[table.length - 1].color || 
  card.type === '+4'
};

const getNextIndex = (turnIndex, players) => {
  return turnIndex < players.length - 1 ? turnIndex + 1 : 0;
}

const playCard = (state, card, player) => {
  console.log(state, card, player);
  const { deck, players, table, turnIndex } = state;
  const playerIndex = players.indexOf(player);
  const cardIndex = player.cards.indexOf(card);
  let nextTurnIndex = getNextIndex(turnIndex, players);
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

  // if (card.type[0] === 'r') {
  //   nextTurnIndex = getNextIndex(nextTurnIndex, players);
  // }

  // if (card.type[0] === 'o') {
  //   nextTurnIndex = getNextIndex(nextTurnIndex, players);  
  // }

  let nextDeck = deck;
  if (card.type[0] === '+') {
    const count = +card.type[1];
    const cardsToTake = deck.slice(0, count);
    nextDeck = deck.slice(count)
    const nextPlayer = {
      name: players[nextTurnIndex].name,
      cards: players[nextTurnIndex].cards.concat(cardsToTake)
    }

    nextPlayers = [
      ...nextPlayers.slice(0, nextTurnIndex),
      nextPlayer,
      ...nextPlayers.slice(nextTurnIndex + 1)
    ]
    nextTurnIndex = getNextIndex(nextTurnIndex, players);
  }
  
  //if (card.type === '+4') {
    //alert('pick a color!');
    //const tableCard = nextTable(nextTable.length - 1);
  //}

  return {
    ...state,
    deck: nextDeck,
    players: nextPlayers,
    table: nextTable,
    turnIndex: nextTurnIndex
  }
}

const takeCard = (player, state) => {
  const { deck, turnIndex, players } = state;
  const playerIndex = players.indexOf(player);
  const cardToTake = deck.slice(0, 1);
  const nextDeck = deck.slice(1);
  const currPlayer = {
    name: player.name,
    cards: player.cards.concat(cardToTake)
  };
  const nextPlayers = [
    ...players.slice(0, playerIndex),
    currPlayer,
    ...players.slice(playerIndex + 1)
  ];
  const nextTurnIndex = getNextIndex(turnIndex, players);

  return {
    ...state,
    deck: nextDeck,
    turnIndex: nextTurnIndex,
    players: nextPlayers
  }
}

const handlePlay = (state, action) => {
  const { card, name } = action;
  const player = state.players.find(p => p.name === name);
  const recPlay = (state, card, p) => {
    if (state.winner) {
      return state;
    }
    const playerIndex = state.players.indexOf(p);
    const nextState = playCard(state, card, p);
    const newTable = nextState.table;
    const nextPlayer = nextState.players[nextState.turnIndex];
    if (playerIndex !== 0 && card.type[0] === '+') {
      console.log(`${p.name} plays ${card.toString()}`);
      const botCard = getBotCard(newTable[newTable.length - 1], nextPlayer.cards);
      return botCard ? recPlay(nextState, botCard, nextPlayer) : takeCard(nextPlayer, nextState);
    } else if (playerIndex === 0 && card.type[0] !== '+') {
      console.log(`${p.name} plays ${card.toString()}`);
      const botCard = getBotCard(newTable[newTable.length - 1], nextPlayer.cards);
      return botCard ? recPlay(nextState, botCard, nextPlayer) : takeCard(nextPlayer, nextState);
    } else {
      console.log(`${p.name} plays ${card.toString()}`);
      return nextState;
    }
  };

  const { players, table, turnIndex } = state;
  const playerIndex = players.indexOf(player);
  if (playerIndex === turnIndex && isCardValid(card, table)) {
    return recPlay(state, card, player);
  }

  return state;
}

const pickColor = (state, action) => {
  const { table, turnIndex } = state;
  console.log(turnIndex);
  const { color } = action;
  console.log(color);
  const lastTableCard = new Card(table[table.length - 1].type, color);
  console.log(lastTableCard);
  const nextState = {
    ...state,
    table: table.slice(0, table.length - 1).concat(lastTableCard)
  }
  return nextState;
}

const reducer = function (state, action) {
  switch (action.type) {
    case 'PLAYER_PLAYED':
      return handlePlay(state, action);  
    case 'TAKE_CARD':
      const { player } = action;
      console.log(player);
      const nextState = takeCard(player, state);
      const nextPlayer = nextState.players[nextState.turnIndex];
      const tableCard = nextState.table[table.length - 1];
      const botCard = getBotCard(tableCard, nextPlayer.cards);
      return botCard ? handlePlay(nextState, {name: nextPlayer.name, card: botCard}) : takeCard(nextPlayer, nextState);
    case 'COLOR_PICKED':
      return pickColor(state, action);
    default:
    return state;
  };
};

const store = createStore(reducer, InitialState);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, 
  document.getElementById('root'));

registerServiceWorker();