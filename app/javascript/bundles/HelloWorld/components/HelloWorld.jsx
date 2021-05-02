import PropTypes from 'prop-types';
import React, { useState } from 'react';
import consumer from '../../../../javascript/channels/consumer'

console.log(consumer)

const HelloWorld = ({givenName}) => {
  const [name, setName] = useState(givenName);

  return (
    <div>
      <h3>Hello, {name}!</h3>
      <hr />
      <form>
        <label htmlFor="name">
          Say hello to:
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
      </form>
    </div>
  );
};

HelloWorld.propTypes = {
  givenName: PropTypes.string.isRequired, // this is passed from the Rails view
};

export default HelloWorld;
