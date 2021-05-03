import PropTypes from 'prop-types';
import React from 'react';
import UserReactions from './UserReactions'

const ServerContent = ({serverName}) => {
    return (
    <div className='content'>
        <h2>Welcome to {serverName}</h2>
        <UserReactions/>        
    </div>
)};

export default ServerContent;
