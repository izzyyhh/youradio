import PropTypes from 'prop-types';
import React from 'react';

const Button = ({onClick, children, className}) => {
  return(
    <button className={className} onClick={onClick}>
      {children}
    </button>
  )
};

Button.propTypes = {
   onClick: PropTypes.func,
};

export default Button;
