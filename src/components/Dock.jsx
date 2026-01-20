import { dockApps } from '#constants';
import React, { useRef } from 'react'

const Dock = () => {

    const dockRef = useRef(null);

    return (
        <section id="dock">
            <div ref={dockRef} className='dock-container'>
                {dockApps.map(({ id, name, icon, canOpen }) => (
                    <div key={id} className="relative flex justify-center">
                        <button
                            type="button"
                            className="dock-icon"
                            aria-label={name}
                            data-tooltip-id="dock-tooltip"
                            data-tooltip-content={name}
                            data-tooltip-delay-show={150}
                            disabled={!canOpen}
                        >
                            <img
                                src={`/images/${icon}`}
                                alt={name}
                                loading="lazy"
                                className={canOpen ? "" : "opacity-60"}
                            />
                        </button>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Dock