import React from 'react';
import PropTypes from 'prop-types';
import Card from './Card';

function Player(props) {
  const className = props.active ? 'player-title--active' : 'player-title';
  return (
    <div>
      <h2 className={className} >{props.name}</h2>
      <ul className="player-card">
        {props.cards.map((c, i) => (
          <li key={i} onClick={() => props.onPlay(c, props.name)}>
            <Card type={c.type} color={c.color} open={props.name !== "Bot"} />
          </li>
        ))}
      </ul>
    </div>
  )
}

Player.propTypes = {
  name: PropTypes.string.isRequired,
  cards: PropTypes.arrayOf(PropTypes.shape({
    color: PropTypes.string,
    type: PropTypes.string
  })).isRequired,
  onPlay: PropTypes.func.isRequired
}


export default Player; 
