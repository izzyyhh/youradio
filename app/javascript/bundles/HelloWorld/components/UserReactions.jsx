import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import ReactionChannel from '../../../channels/reactions_channel'

// mvp version of reactions, counters are not saved in backend
// thus users, will have different counters, when joined on different times
let likes = 0;
let dislikes = 0;
const LIKE_REACTION = 'LIKE'
const DISLIKE_REACTION = 'DISLIKE'

const UserReactions = () => {
  const [likeCounter, setLikeCounter] = useState(likes)
  const [dislikeCounter, setDislikeCounter] = useState(dislikes)
  
  useEffect(() => { 
    ReactionChannel.received = (data) => {
      switch(data.reactionType) {
        case LIKE_REACTION:
          likes +=1
          setLikeCounter(likeCounter + 1)
          break;
        case DISLIKE_REACTION:
          dislikes+=1
          setDislikeCounter(dislikeCounter +1)
          break;
      }
    }}, [likes, dislikes])

  const handleReaction = async (reactionType) => {

    await fetch('http://localhost:3000/reactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('[name=csrf-token]').content,
      },
      body: JSON.stringify({ reactionType }),
    })}

  return(
  <div>
    <div id='likeCounter'>{likeCounter}Likes</div>
      <button onClick={() => handleReaction(LIKE_REACTION)}>Like {likeCounter}</button>
      <button onClick={() => handleReaction(DISLIKE_REACTION)}>Dislike {dislikeCounter}</button>
  </div>
  )
}

UserReactions.propTypes = {
//   name: PropTypes.string.isRequired,
//   updateName: PropTypes.func.isRequired,
};

export default UserReactions;