import PropTypes from 'prop-types';
import React from 'react';
import UserReactions from './UserReactions'
import UserPresence from './UserPresence'

const ServerContent = ({serverName}) => {
    return (
    <div className='content'>
        {/* <h2>Welcome to {serverName}</h2> */}
        <UserReactions/>
        {/* <UserPresence/> */}
    </div>
)};

ServerContent.propTypes = {
   serverName: PropTypes.string.isRequired,
};

export default ServerContent;
