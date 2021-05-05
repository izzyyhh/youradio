import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import ReactionChannel, { server_id } from '../../../channels/reactions_channel'

// mvp version of reactions, counters are not saved in backend
// thus users, will have different counters, when joined on different times
let likes = 0;
let dislikes = 0;
let list = [];
const LIKE_REACTION = 'LIKE'
const DISLIKE_REACTION = 'DISLIKE'
const RESET_REACTION = 'RESET'


const UserReactions = () => {
	const [reaction, setReaction] = useState({
		likeCounter: likes,
		dislikeCounter: dislikes
	})
	const [userList, setUserList] = useState(list)

	useEffect(() => {
	ReactionChannel.received = (data) => {
		switch(data.reactionType) {
			case LIKE_REACTION:
				likes +=1
				setReaction({
					likeCounter: reaction.likeCounter + 1,
					dislikeCounter: reaction.dislikeCounter
				})
				break;
			case DISLIKE_REACTION:
				dislikes+=1
				setReaction({
					likeCounter: reaction.likeCounter,
					dislikeCounter: reaction.dislikeCounter + 1
				})
				break;
			case RESET_REACTION:
				// a broadcast is sent, when video finishes, then
				// reaction counters must be reset
				likes = 0
				dislikes = 0
				setReaction({
					likeCounter: 0,
					dislikeCounter: 0
				})
				break;
			case "active":
				getUser()
				break;
		}
		
	}}, [likes, dislikes, userList])

	useEffect(() => {
		getUser()
	}, [])


	const getUser = async () => {
		const data = await fetch(`/servers/${server_id}/userlist/`)
		const userlist = await data.json()
		console.log(userlist)
		setUserList(userlist)
	}

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

	if (userList.length == 0) {
		return (
			<h1>no user</h1>
		)
	}

	return(
		<>
			<div className='player-complete'>
				<div className='player-space'></div>
				<div className="action-wrapper">
					<div className='content_reactionbuttonline'>
						<button onClick={() => handleReaction(LIKE_REACTION)}><i className="fas fa-thumbs-up"></i></button>
						<button onClick={() => handleReaction(DISLIKE_REACTION)}><i className="fas fa-thumbs-down"></i></button>
					</div>
					<div className='content_counterline'>
						<div id='likeCounter' className='counter-box'>{reaction.likeCounter} <i className="fas fa-thumbs-up"></i></div>
						<div id='dislikeCounter' className='counter-box'>{reaction.dislikeCounter} <i className="fas fa-thumbs-down"></i></div>
					</div>
				</div>
			</div>
			<ul className="userlist">
				{userList.userlist.map(user => (
					<li key={user.id}><img className="presence-img"src={user.url}></img><span>{user.name}</span></li>
				))}
			</ul>
		</>
	)
	}

UserReactions.propTypes = {
};

export default UserReactions;