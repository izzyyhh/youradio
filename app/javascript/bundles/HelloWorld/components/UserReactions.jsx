import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import ReactionChannel, { server_id } from '../../../channels/reactions_channel'

// mvp version of reactions, counters are not saved in backend
// thus users, will have different counters, when joined on different times
let likes = 0;
let dislikes = 0;
const LIKE_REACTION = 'LIKE'
const DISLIKE_REACTION = 'DISLIKE'
const RESET_REACTION = 'RESET'

const UserReactions = () => {
  const [likeCounter, setLikeCounter] = useState(likes)
  const [dislikeCounter, setDislikeCounter] = useState(dislikes)
  
  useEffect(() => { // react testing library hooks
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
        case RESET_REACTION:
          // a broadcast is sent, when video finishes, then
          // reaction counters must be reset
          likes = 0, dislikes = 0
          setLikeCounter(likes)
          setDislikeCounter(dislikes)
          break;
      }
    }}, [likes, dislikes])

  const handleReaction = async (reactionType) => {

    await fetch('/reactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('[name=csrf-token]').content,
      },
      body: JSON.stringify({ reactionType, server_id }),
    })
  }

  return(
    <>
    <div className='content_counterline'>
      <div id='likeCounter' className='counter-box'>{likeCounter} <i className="fas fa-thumbs-up"></i></div>
      <div id='dislikeCounter' className='counter-box'>{dislikeCounter} <i className="fas fa-thumbs-down"></i></div>
    </div>
      <div className='content_reactionbuttonline'>
          <button onClick={() => handleReaction(LIKE_REACTION)}><i className="fas fa-thumbs-up"></i></button>
          <button onClick={() => handleReaction(DISLIKE_REACTION)}><i className="fas fa-thumbs-down"></i></button>
      </div>
    </>
  )
}

UserReactions.propTypes = {
};

export default UserReactions;