import React, { Component } from 'react';
import { connect } from 'react-redux';
import { play, takeCards, takeNewCard } from './actions';
import Player from './Player';
import Card from './Card';
import Winner from './winner';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pickColor: false,
      name: '',
      card: null
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      player,
      table,
      lastPlayerIndex,
      mustTakeCards,
      players,
      winner
    } = this.props;
    const nextPlayer = this.getNextPlayer(lastPlayerIndex, players);
    if (mustTakeCards) {
      setTimeout(() => this.props.takeCards(nextPlayer), 1500);
    } else if (nextPlayer !== player && !winner) {
      setTimeout(() => this.playNext(nextPlayer, table, lastPlayerIndex), 1500)
    }
  }

  playNext(player, table, lastPlayerIndex) {
    const tableCard = table[table.length - 1];
    const botCard = this.getBotCard(tableCard, player.cards);
    if (botCard) {
      this.props.play(botCard, player.name);
    } else {
      this.props.takeNewCard(player);
    }
  }

  getBotCard(tableCard, cards) {
    const card = cards.find(c => c.type === tableCard.type ||
      c.color === tableCard.color ||
      c.type === '+4');

    if (card && card.type === '+4') {
      card.color = this.getBotColor(cards);
    }
    return card || null;
  }

  getBotColor(cards) {
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

  getNextPlayer(lastPlayerIndex, players) {
    const move = this.props.direction === 'cw' ? 1 : -1;
    const jump = this.props.skipTurn ? 2 : 1;
    const nextTurnIndex = (lastPlayerIndex + players.length + move*jump) % players.length;
    return players[nextTurnIndex];
  }

  play = (card, name) => {
    if (card.type === '+4') {
      //show picker
      this.setState({
        pickColor: true,
        name,
        card
      });
    } else {
      this.props.play(card, name);
    }
  }

  pickColor = (color) => {
    const { card, name } = this.state;
    this.setState({
      pickColor: false,
      card: null,
      name: ''
    });
    this.props.play(card, name, color);
  }

  render() {
    const {
      player,
      table,
      lastPlayerIndex,
      players,
      winner
    } = this.props;
    const [bot1, bot2, bot3] = [players[1], players[2], players[3]];
    const nextPlayer = this.getNextPlayer(lastPlayerIndex, players);
    return (
      <div className="App">
        {winner && <Winner name={nextPlayer.name} />}
        <div className="col-1">
          <Player
            name={bot1.name}
            cards={bot1.cards}
            onPlay={this.props.play}
            active={bot1 === nextPlayer}
            vertical
          />
        </div>
        <div className="col-2">
          <Player
            name={bot2.name}
            cards={bot2.cards}
            onPlay={this.props.play}
            active={bot2 === nextPlayer}
          />
          <ul className="deck-cards">
            <li className="card backside-card" onClick={
              () => this.props.takeNewCard(nextPlayer)
            }>Take card</li>
            <Card type={table[table.length - 1].type} color={table[table.length - 1].color} open={true} />
            {this.state.pickColor && (
              <ul className="color-selector" onClick={(e) => { this.pickColor(e.target.innerText) }}>
                <li className="card--red">red</li>
                <li className="card--green">green</li>
                <li className="card--yellow">yellow</li>
                <li className="card--blue">blue</li>
              </ul>
            )}
          </ul>
          <Player
            name={player.name}
            cards={player.cards}
            onPlay={this.play}
            active={player === nextPlayer}
          />
        </div>
        <div className="col-3">
          <Player
            name={bot3.name}
            cards={bot3.cards}
            onPlay={this.props.play}
            active={bot3 === nextPlayer}
            vertical
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  player: state.players[0],
  table: state.table,
  turnIndex: state.turnIndex,
  lastPlayerIndex: state.lastPlayerIndex,
  mustTakeCards: state.mustTakeCards,
  skipTurn: state.skipTurn,
  players: state.players,
  direction: state.direction,
  winner: state.winner
});

const mapDispatchToProps = dispatch => ({
  play: (card, name, color) => dispatch(play(card, name, color)),
  takeCards: player => dispatch(takeCards(player)),
  takeNewCard: player => dispatch(takeNewCard(player))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
