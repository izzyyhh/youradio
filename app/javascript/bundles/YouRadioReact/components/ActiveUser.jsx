import React from 'react'

const ActiveUser = ({user}) => {
    return (    
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
    )
}

export default ActiveUser