import React from 'react';
import PropTypes from 'prop-types';
import Refresh from './refresh.svg';
import Ban from './ban.svg';

function Card(props) {
  if (!props.open) {
    return (
      <div className="card">
        <p className="backside-card">UNO</p>
      </div>
    )
  } else if (props.type === "r") {
    return (
      <div className={`card card--${props.color}`}>
        <p className='card-item'>
          <img src={Refresh} alt="reverse" />
        </p>
      </div>
    )
  } else if (props.type === "o") {
    return (
      <div className={`card card--${props.color}`}>
        <p className='card-item'>
          <img src={Ban} alt="skip player" width="50" />
        </p>
      </div>
    )
  } else {
    return (
      <div className={`card card--${props.color}`}>
        <p className='card-item'>
          {props.type}
        </p>
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
