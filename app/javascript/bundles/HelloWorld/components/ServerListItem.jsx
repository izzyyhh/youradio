import PropTypes from 'prop-types';
import React from 'react';

const ServerListItem = ({name, imgUrl}) => {
  return(
    <div className='serverbar__dot'>
    <a href='#'>
        <span className='serverbar__servername-span'>{name.toUpperCase()[0]}</span>
    </a>
    </div>
  )
};

ServerListItem.propTypes = {
   name: PropTypes.string.isRequired,
//   updateName: PropTypes.func.isRequired,
};

export default ServerListItem;