import React from 'react'
import PropTypes from 'prop-types'
import HomeListCard from './HomeListCard'

const HomeList = ({serverList, serverUrls, serverPics}) => {
    return (
        <section className='home__explore'>
            <h2 className='home__heading'>Explore</h2>

        <ul className='explore__list'>
            {
                serverList.map((server, index) => (
                    <li>
                        <a href={serverUrls[index]} data-method='get'>
                            {<HomeListCard serverName={server.name} serverPic={serverPics[index]} />}
                        </a>
                    </li>
                ))
            }
        </ul>

        </section>
    )
}

HomeList.propTypes = {
    currentUserName: PropTypes.string,
}

export default HomeList