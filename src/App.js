import React, { Component } from 'react';
import { connect } from 'react-redux';
import { play, takeCard, pickColor } from './actions';
import Player from './Player';
import Card from './Card';

class App extends Component {

  render() {
    const {player, bot, table, turnIndex, players} = this.props;
    return (
      <div className="App">
        <section className="bot-deck">
          <Player 
            name={bot.name} 
            cards={bot.cards}
            onPlay={this.props.play}
          />
        </section>
        <section className="table">
          <div className="deck-cards card backside-card" onClick={
              () => this.props.takeCard(turnIndex, players)
            }>
            Take card
          </div>
          <div>
            <Card type={table[table.length-1].type} color={table[table.length-1].color} open={true} />
          </div>
          {(table[table.length-1].type === "+4") && (
            <ul className="color-selector" onClick={(e) => {this.props.pickColor(e.target.innerText)}}>
              <li className="card--red">red</li>
              <li className="card--green">green</li>
              <li className="card--yellow">yellow</li>
              <li className="card--blue">blue</li>
            </ul>
          )}
        </section>
        <section className="players-deck">
          <Player 
            name={player.name} 
            cards={player.cards}
            onPlay={this.props.play}
          />
        </section> 
      </div>
    );
  }
}

const mapStateToProps = state => ({
  player: state.players[0],
  bot: state.players[1],
  table: state.table,
  turnIndex: state.turnIndex,
  players: state.players
});

const mapDispatchToProps = dispatch => ({
  play: (card, name) => dispatch(play(card, name)),
  takeCard: (turnIndex, players) => dispatch(takeCard(turnIndex, players)),
  pickColor: (color) => dispatch(pickColor(color))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
