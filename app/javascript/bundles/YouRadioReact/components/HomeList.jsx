import React from 'react'
import PropTypes from 'prop-types'
import HomeListCard from './HomeListCard'

const HomeList = ({serverList}) => {
    return (
        <section className='home__explore'>
            <h2 className='home__heading'>Explore</h2>

        <ul className='explore__list'>
            {
                serverList.map((server) => (
                    <li key={server.url}>
                        <a href={server.url} data-method='get'>
                            {<HomeListCard serverName={server.name} serverPic={server.imageUrl} serverOwner={server.owner} serverId={server.id} />}
                        </a>
                    </li>
                ))
            }
        </ul>

        </section>
    )
}

HomeList.propTypes = {
    serverList: PropTypes.array,
}

export default HomeList