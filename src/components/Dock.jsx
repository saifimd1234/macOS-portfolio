import { dockApps, locations } from '#constants';
import { useWindows } from '#store';
import { Tooltip } from 'react-tooltip'
import React, { useRef } from 'react'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Dock = () => {

    const dockRef = useRef(null);
    const { open, isOpen } = useWindows();

    useGSAP(() => {
        const dock = dockRef.current;
        if (!dock) return;

        const icons = dock.querySelectorAll(".dock-icon");

        const animateIcons = (mouseX) => {
            const { left } = dock.getBoundingClientRect();

            icons.forEach(icon => {
                const { left: iconLeft, width } = icon.getBoundingClientRect();
                const center = iconLeft - left + width / 2;
                const distance = Math.abs(mouseX - center);
                const intensity = Math.exp(-(distance ** 2) / 2000);

                gsap.to(icon, {
                    scale: 1 + 0.25 * intensity,
                    y: -15 * intensity,
                    duration: 0.2,
                    ease: "power1.out"
                })
            })
        }

        const handleMouseMove = (e) => {
            const { left } = dock.getBoundingClientRect();
            const mouseX = e.clientX - left;
            animateIcons(mouseX);
        }

        const resetIcons = () => {
            icons.forEach(icon => {
                gsap.to(icon, {
                    scale: 1,
                    y: 0,
                    duration: 0.2,
                    ease: "power1.out"
                })
            })
        }
        dock.addEventListener("mousemove", handleMouseMove);
        dock.addEventListener("mouseleave", resetIcons);

        return () => {
            dock.removeEventListener("mousemove", handleMouseMove);
            dock.removeEventListener("mouseleave", resetIcons);
        }
    }, []);

const toggleApp = (app, e) => {
    if (!app.canOpen) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const origin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };

    if (app.id === "finder") {
        open("finder", {
            singleton: true,
            data: locations.work,
            title: "Portfolio",
            origin,
        });
        return;
    }

    open(app.id, { singleton: true, title: app.name, origin });
}

return (
    <section id="dock">
        <div ref={dockRef} className='dock-container'>
            {dockApps.map((app) => (
                <div key={app.id} className="relative flex flex-col items-center">
                    <button
                        type="button"
                        className="dock-icon"
                        aria-label={app.name}
                        data-tooltip-id="dock-tooltip"
                        data-tooltip-content={app.name}
                        data-tooltip-delay-show={150}
                        disabled={!app.canOpen}
                        onClick={(e) => toggleApp(app, e)}
                    >
                        <img
                            src={`/images/${app.icon}`}
                            alt={app.name}
                            loading="lazy"
                            className={app.canOpen ? "" : "opacity-60"}
                        />
                    </button>
                    <span
                        className={`dock-dot ${isOpen(app.id) ? "is-open" : ""}`}
                    />
                </div>
            ))}
            <Tooltip id="dock-tooltip" place="top" className="tooltip" />
        </div>
    </section>
)
}

export default Dock