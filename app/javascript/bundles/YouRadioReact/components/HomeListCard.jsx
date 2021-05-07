import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

const fetchActiveUsers = (serverId, setActiveUserCounter) => {
    fetch(`/servers/${serverId}/userlist`)
    .then(response => response.json())
    .then(result => setActiveUserCounter(result.userlist.length))
}

const HomeListCard = ({serverName, serverOwner, serverPic, serverId}) => {
    const [activeUserCounter, setActiveUserCounter] = useState(0)

    useEffect(() => {
        fetchActiveUsers(serverId, setActiveUserCounter)
    }, [])

    return (    
        <div className='explore-card'>
            <div className='explore-card__overlay'>
                <i className="far fa-play-circle"></i>
            </div>
                <div className='explore-card__image-wrapper'>
                    <img src={serverPic}></img>
                </div>
                <h3 className='explore-card__heading'>{serverName}</h3>
                <p className='explore-card__owner'>{serverOwner}</p>
                <div className='active-user-counter'>{activeUserCounter}<i className='fas fa-eye'></i></div>
        </div>
    )
}

HomeListCard.propTypes = {
    serverName: PropTypes.string,
    serverPic: PropTypes.string,
    serverOwner: PropTypes.string,
    serverId: PropTypes.number
}

export default HomeListCard