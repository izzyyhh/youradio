import React from 'react'

const Counter = ({className, id, children}) => {
    return (
        <div id={id} className={className}>
            {children}
        </div>
    )
}

export default Counter