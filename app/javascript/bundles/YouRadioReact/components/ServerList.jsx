import PropTypes from 'prop-types';
import React from 'react';
import ServerListItem from './ServerListItem'

// not finished
const ServerList = ({servers, serverpics}) => {
  return(
  <div>
      <h3>Hello ServerList</h3>
      <ul>
        {
          servers.map(server => (
            <ServerListItem name={server.name}/>
          ))
        }
      </ul>
  </div>
  )
};

ServerList.propTypes = {
//   name: PropTypes.string.isRequired,
//   updateName: PropTypes.func.isRequired,
};

export default ServerList;