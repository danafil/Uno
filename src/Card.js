import React from 'react';
import PropTypes from 'prop-types';

function Card(props) {

  let cardClass = props.color && props.open ? `card card--${props.color}` : 'card';
  cardClass += props.vertical ? ' card--vertical' : '';
  const pClass = props.open ? 'card-type' : 'backside-card';
  const content = props.open ? getContent(props.type) : 'UNO' ;

  return (
    <li className={cardClass} onClick={props.onClick}>
      <p className={pClass}>
        <span className="card-icon-top">{content}</span>
        <span className="card-icon-center">{content}</span>
        <span className="card-icon-bottom">{content}</span>
      </p>
    </li>
  )
}

Card.propTypes = {
  open: PropTypes.bool.isRequired, //show face of the card
  color: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  type: PropTypes.string.isRequired
}

function getContent(type) {
  switch (type) {
    case 'r':
     return <i className="icon-blocked"></i>;
    case 'o':
      return <i className="icon-loop2"></i>;
    default:
      return type;
  }
}

export default Card; 
