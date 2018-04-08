export default class Card {
  constructor(type, color) {
    this.type = type;
    this.color = color;
  }

  setColor(color) {
    this.color = color;
  }

  toString() {
    return this.type + this.color;
  }
}

const types = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "+2", "+4", "r", "o"].map( t => t + '');
const colors = ["yellow", "blue", "green", "red"];

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
    if (deck[28].type[0] === '+' ) {
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
  {name: 'Bot1', cards: deck.splice(0, 7)},
  {name: 'Bot2', cards: deck.splice(0, 7)},
  {name: 'Bot3', cards: deck.splice(0, 7)}
];

const table = [deck.shift()];

export const InitialState = {
  deck,
  players,
  table,
  lastPlayerIndex: 3,
  mustTakeCards: false,
  skipTurn: false,
  direction: 'cw',
  winner: null
};

