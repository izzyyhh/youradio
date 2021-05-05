import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Button from './Button'

const postSubscription = (setIsSubscribed) => {
    fetch('/subscriptions', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('[name=csrf-token]').content,
        },
        body: JSON.stringify({ serverId: document
                                    .getElementById("server-id")
                                    .getAttribute("data-server-id")
                            }),
    })
    .then(() => {
        setIsSubscribed(true)
    })
}

const deleteSubscription = (setIsSubscribed) => {
    fetch(`/subscriptions/${document.getElementById("server-id").getAttribute("data-server-id")}`, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('[name=csrf-token]').content,
        },
        body: JSON.stringify({ serverId: document
                                    .getElementById("server-id")
                                    .getAttribute("data-server-id")
                            }),
    })
    .then(() => {
        setIsSubscribed(false)
    })
}

const Topbar = ({userName, ppImgUrl, logOutConfirmation="Are you sure, you want to logout?", isServerPresentAndPublic=false}) => {
    const [isSubscribed, setIsSubscribed] = useState()

    useEffect(()=> {
        if(isServerPresentAndPublic){
            fetch(`/subscriptions/${document.getElementById("server-id").getAttribute("data-server-id")}`)
            .then(response => response.json())
            .then(result => setIsSubscribed(result.subscribed))
        }
    }, [])

  return(
      <section>
        <div className='topbar__user'>
                <div className='topbar__userpic'><img src={ppImgUrl}></img></div>
            <span>{userName}</span>
            <div className='topbar__actions'>
                <a href='/users/edit'><i className="fas fa-cog"></i></a>
                <a href='/users/sign_out' data-confirm={logOutConfirmation} className='topbar__logout' rel='nofollow' data-method="delete"><i className='fas fa-sign-out-alt'></i></a>
                {
                    isServerPresentAndPublic ?
                    (
                        isSubscribed ? <Button onClick={() => {deleteSubscription(setIsSubscribed)}}>Unsubscribe</Button> :<Button onClick={()=> {postSubscription(setIsSubscribed)}}>Subscribe</Button> 
                    ) : (<></>)
                }
            </div>
        </div>
    </section>
  )
};

Topbar.propTypes = {
   userName: PropTypes.string.isRequired,
   ppImgUrl: PropTypes.string.isRequired
};

export default Topbar;
