import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import ReactionChannel, { server_id } from '../../../channels/reactions_channel'
import displayReaction from '../../../packs/display_reaction'
import Reaction from '../../../packs/reaction_class'
import Button from './Button'
import Counter from './Counter'
import ActiveUser from './ActiveUser'
import { unescapeComponent } from 'uri-js';


// mvp version of reactions, counters are not saved in backend
// thus users, will have different counters, when joined on different times
let likes = 0;
let dislikes = 0;
let heart = 0;
let fire = 0;
let list = [];
const LIKE_REACTION = 'LIKE'
const DISLIKE_REACTION = 'DISLIKE'
const HEART_REACTION = 'HEART'
const FIRE_REACTION = 'FIRE'
const RESET_REACTION = 'RESET'

const reactionInstance = new Reaction(likes, dislikes, heart, fire)

const UserReactions = () => {
	const [reaction, setReaction] = useState(reactionInstance)
	const [userList, setUserList] = useState(list)

	useEffect(() => {
		ReactionChannel.received = (data) => {
			switch(data.reactionType) {
				case LIKE_REACTION:
					likes +=1
					reactionInstance.likeCounter = likes
					setReaction(Object.assign({}, reactionInstance))
					displayReaction(data)
					break;
				case DISLIKE_REACTION:
					dislikes+=1
					reactionInstance.dislikeCounter = dislikes
					setReaction(Object.assign({}, reactionInstance))
					displayReaction(data)
					break;
				case HEART_REACTION:
					heart +=1
					reactionInstance.heartCounter = heart
					setReaction(Object.assign({}, reactionInstance))
					displayReaction(data)
					break;
				case FIRE_REACTION:
					fire +=1
					reactionInstance.fireCounter = fire
					setReaction(Object.assign({}, reactionInstance))
					displayReaction(data)
					break;
				case RESET_REACTION:
					// a broadcast is sent, when video finishes, then
					// reaction counters must be reset
					likes = 0, dislikes = 0, heart = 0, fire = 0
					reactionInstance.reset()
					setReaction(Object.assign({}, reactionInstance))
					break;
				case "active":
					getUser()
					break;
			}
		}
	}, [likes, dislikes, heart, fire, userList])

	useEffect(() => {
		getUser()
	}, [])

	const getUser = async () => {
		const data = await fetch(`/servers/${server_id}/userlist/`)
		const userlist = await data.json()
		setUserList(userlist)
	}

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
						<div className='counterleft-wrapper'>
							<Counter id='heartCounter' className='counter-box'>{reaction.heartCounter} <i className="fas fa-heart"></i></Counter>
							<Counter id='fireCounter' className='counter-box'>{reaction.fireCounter} <i className="fas fa-fire-alt"></i></Counter>
						</div>
							<Button onClick={() => handleReaction(HEART_REACTION)}><i className="fas fa-heart"></i></Button>
							<Button onClick={() => handleReaction(FIRE_REACTION)}><i className ="fas fa-fire-alt"></i></Button>
							<Button onClick={() => handleReaction(LIKE_REACTION)}><i className="fas fa-thumbs-up"></i></Button>
							<Button onClick={() => handleReaction(DISLIKE_REACTION)}><i className="fas fa-thumbs-down"></i></Button>
						<div className="counterright-wrapper">
							<Counter id='likeCounter' className='counter-box'>{reaction.likeCounter} <i className="fas fa-thumbs-up"></i></Counter>
							<Counter id='dislikeCounter' className='counter-box'>{reaction.dislikeCounter} <i className="fas fa-thumbs-down"></i></Counter>
						</div>
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