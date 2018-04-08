import React from 'react';
import PropTypes from 'prop-types';
import Card from './Card';

function Player(props) {
  const cardsClassName = props.vertical ? 'player-cards player-cards--vertical' : 'player-cards';
  const titleClassName = props.active ? 'player-title--active' : 'player-title';
  return (
    <div className="player">
      <h2 className={titleClassName} >{props.name}</h2>
      <ul className={cardsClassName}>
        {props.cards.map((c, i) => (
          <Card
            key={i}
            type={c.type}
            color={c.color}
            open={props.name === "You"}
            onClick={() => props.onPlay(c, props.name)}
            vertical={props.vertical}
          />
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
