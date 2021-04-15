import React from 'react'
import './Loader.css'

function Loader({additionalInfo}) {

    return (
        <div className="Loader">
            {!additionalInfo?
            <span>
                Loading...
            </span>
            :
            <span className="spinner"/>
            }
        </div>
    )
}

export default Loader
