import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import ReactionChannel, { server_id } from '../../../channels/reactions_channel'
import { unescapeComponent } from 'uri-js';

// mvp version of reactions, counters are not saved in backend
// thus users, will have different counters, when joined on different times
let likes = 0;
let dislikes = 0;
let heart = 0;
let fire = 0;
let list = [];
let currentUser = ''
const LIKE_REACTION = 'LIKE'
const DISLIKE_REACTION = 'DISLIKE'
const HEART_REACTION = 'HEART'
const FIRE_REACTION = 'FIRE'
const RESET_REACTION = 'RESET'


const UserReactions = () => {
	const [reaction, setReaction] = useState({
		likeCounter: likes,
		dislikeCounter: dislikes,
		heartCounter: heart,
		fireCounter: fire
	})
	const [userList, setUserList] = useState(list)

	useEffect(() => {
	ReactionChannel.received = (data) => {
		switch(data.reactionType) {
			case LIKE_REACTION:
				likes +=1
				setReaction({
					likeCounter: reaction.likeCounter + 1,
					dislikeCounter: reaction.dislikeCounter,
					heartCounter: reaction.heartCounter,
					fireCounter: reaction.fireCounter
				})
				displayReaction(data)
				break;
			case DISLIKE_REACTION:
				dislikes+=1
				setReaction({
					likeCounter: reaction.likeCounter,
					dislikeCounter: reaction.dislikeCounter + 1,
					heartCounter: reaction.heartCounter,
					fireCounter: reaction.fireCounter
				})
				displayReaction(data)
				break;
			case HEART_REACTION:
				heart +=1
				setReaction({
					likeCounter: reaction.likeCounter,
					dislikeCounter: reaction.dislikeCounter,
					heartCounter: reaction.heartCounter + 1,
					fireCounter: reaction.fireCounter
				})
				displayReaction(data)
				break;
			case FIRE_REACTION:
				fire +=1
				setReaction({
					likeCounter: reaction.likeCounter,
					dislikeCounter: reaction.dislikeCounter,
					heartCounter: reaction.heartCounter,
					fireCounter: reaction.fireCounter + 1
				})
				displayReaction(data)
				break;
			case RESET_REACTION:
				// a broadcast is sent, when video finishes, then
				// reaction counters must be reset
				likes = 0
				dislikes = 0
				setReaction({
					likeCounter: 0,
					dislikeCounter: 0,
					heartCounter: 0,
					fireCounter: 0
				})
				break;
			case "active":
				getUser()
				break;
		}
		
	}}, [likes, dislikes, heart, fire, userList])

	useEffect(() => {
		getUser()
	}, [])


	const getUser = async () => {
		const data = await fetch(`/servers/${server_id}/userlist/`)
		const userlist = await data.json()
		currentUser = userlist.current_user.id
		setUserList(userlist)
	}

	const handleReaction = async (reactionType) => {
		await fetch('/reactions', {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json',
			'X-CSRF-TOKEN': document.querySelector('[name=csrf-token]').content,
			},
			body: JSON.stringify({ reactionType, server_id, currentUser }),
		})
	}

	const displayReaction = (data) => {
		console.log(data)
		switch (data.reactionType) {
			case LIKE_REACTION:
				let up = document.getElementById(data.userReacting).firstChild.children[0]
				up.classList.toggle('reactionLeftActive')
				setTimeout(() => {
					up.classList.toggle('reactionLeftActive')
				}, 1000)
				break;
			case DISLIKE_REACTION:
				let down = document.getElementById(data.userReacting).firstChild.children[1]
				down.classList.toggle('reactionLeftActive')
				setTimeout(() => {
					down.classList.toggle('reactionLeftActive')
				}, 1000)
			break;
			case HEART_REACTION:
				let h = document.getElementById(data.userReacting).firstChild.children[2]
				h.classList.toggle('reactionRightActive')
				setTimeout(() => {
					h.classList.toggle('reactionRightActive')
				}, 1000)
			break;
			case FIRE_REACTION:
				let f = document.getElementById(data.userReacting).firstChild.children[3]
				f.classList.toggle('reactionRightActive')
				setTimeout(() => {
					f.classList.toggle('reactionRightActive')
				}, 1000)
			break;
		}
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
							<div id='heartCounter' className='counter-box'>{reaction.heartCounter} <i className="fas fa-heart"></i></div>
							<div id='fireCounter' className='counter-box'>{reaction.fireCounter} <i className="fas fa-fire-alt"></i></div>
						</div>
						<button onClick={() => handleReaction(HEART_REACTION)}><i className="fas fa-heart"></i></button>
						<button onClick={() => handleReaction(FIRE_REACTION)}><i className="fas fa-fire-alt"></i></button>
						<button onClick={() => handleReaction(LIKE_REACTION)}><i className="fas fa-thumbs-up"></i></button>
						<button onClick={() => handleReaction(DISLIKE_REACTION)}><i className="fas fa-thumbs-down"></i></button>
						<div className="counterright-wrapper">
							<div id='likeCounter' className='counter-box'>{reaction.likeCounter} <i className="fas fa-thumbs-up"></i></div>
							<div id='dislikeCounter' className='counter-box'>{reaction.dislikeCounter} <i className="fas fa-thumbs-down"></i></div>
						</div>
					</div>
				</div>
			</div>
			<ul className="userlist">
				{userList.userlist.map(user => (
					<li id={user.id} key={user.id}>
						<span className="animation-wrapper">
							<i id="reaction-up" className="fas fa-thumbs-up reactionLeftActive"></i>
							<i id="reaction-down" className="fas fa-thumbs-down reactionLeftActive"></i>
							<i id="reaction-heart" className="fas fa-heart reactionRightActive"></i>
							<i id="reaction-fire" className="fas fa-fire-alt reactionRightActive"></i>
						</span>
						<img className="presence-img"src={user.url}></img>
						<span className="username">{user.name}</span>
					</li>
				))}
			</ul>
		</>
	)
	}

UserReactions.propTypes = {
};

export default UserReactions;