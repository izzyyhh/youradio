const LIKE_REACTION = 'LIKE'
const DISLIKE_REACTION = 'DISLIKE'
const HEART_REACTION = 'HEART'
const FIRE_REACTION = 'FIRE'

const displayReaction = (data) => {
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

export default displayReaction