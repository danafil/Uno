import React from 'react';
import PropTypes from 'prop-types';

function Card(props) {
  if (!props.open) {
    return (
      <div className="card">
        <p className="backside-card">UNO</p>
      </div>
    )
  } else {
    return (
      <div className={`card card--${props.color}`}>
        <p className={`card-item card--${props.color}`}>{props.type}</p>
      </div>
    )
  }
}

Card.propTypes = {
  open: PropTypes.bool.isRequired, //show face of the card
  color: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  type: PropTypes.string.isRequired
}

export default Card; 