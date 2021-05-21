import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import ReactionChannel, { server_id } from '../../../channels/reactions_channel'
import displayReaction from '../../../packs/display_reaction'
import Reaction from '../../../packs/reaction_class'
import Button from './Button'
import Counter from './Counter'
import ActiveUser from './ActiveUser'
import {LIKE_REACTION, DISLIKE_REACTION, RESET_REACTION, HEART_REACTION, FIRE_REACTION, ACTIVE_REACTION } from '../../../packs/constants'

const getUser = async (setUserList) => {
	const data = await fetch(`/servers/${server_id}/userlist/`)
	const userlist = await data.json()
	setUserList(userlist)
}

const useReactions = (setUserList, userList) => {
	const [reactions, setReactions] = useState(new Reaction())

	useEffect(() => {
		ReactionChannel.received = (data) => {
			if(data.reactionType === ACTIVE_REACTION) {
				getUser(setUserList)
			} else {
				reactions.handleReaction(data)
				console.log("reaction")
				console.log(reactions)
				setReactions({...reactions})
				displayReaction(data)
			}
		}
	}, [userList])

	return reactions
}

const UserReactions = () => {
	const [userList, setUserList] = useState([])

	const reaction = useReactions(setUserList, userList)

	useEffect(() => {
		getUser(setUserList)
	}, [])



	const handleReaction = async (reactionType) => {
		await fetch('/reactions', {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json',
			'X-CSRF-TOKEN': document.querySelector('[name=csrf-token]').content,
			},
			body: JSON.stringify({ reactionType, server_id}),
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
						<Button onClick={() => handleReaction(HEART_REACTION)}><Counter id='heartCounter' className='counter-box'>{reaction.heartCounter}<i className="fas fa-heart"></i></Counter></Button>
						<Button onClick={() => handleReaction(FIRE_REACTION)}><Counter id='fireCounter' className='counter-box'>{reaction.fireCounter} <i className="fas fa-fire-alt"></i></Counter></Button>
						<Button onClick={() => handleReaction(LIKE_REACTION)}><Counter id='likeCounter' className='counter-box'>{reaction.likeCounter} <i className="fas fa-thumbs-up"></i></Counter></Button>
						<Button onClick={() => handleReaction(DISLIKE_REACTION)}><Counter id='dislikeCounter' className='counter-box'>{reaction.dislikeCounter} <i className="fas fa-thumbs-down"></i></Counter></Button>
					</div>
				</div>
			</div>
			<ul className="userlist">
				{userList.userlist.map(user => (
					<ActiveUser user={user}></ActiveUser>
				))}
			</ul>
		</>
	)
}

UserReactions.propTypes = {
};

export default UserReactions;