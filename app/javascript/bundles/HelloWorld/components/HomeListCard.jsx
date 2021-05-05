import React from 'react'
import PropTypes from 'prop-types'

const HomeListCard = ({serverName, serverOwner, serverPic}) => {
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
        </div>
    )
}

HomeListCard.propTypes = {
    currentUserName: PropTypes.string,
}

export default HomeListCard