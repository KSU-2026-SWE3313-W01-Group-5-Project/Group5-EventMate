/**
 * Modal Component
 *
 * A reusable modal wrapper responsible for displaying any child components inside of a centered overlay
 * with open and close animations. The modal system might seem a bit confusing at first glance (especially with the amount of other files
 * that are interconnected with modals, but I will try my best to explain everything)
 *
 * The parent component (ex: pages/AuthModal.jsx) to this Modal.jsx component controls whether the modal should exist using the 'isOpen' prop,
 * while this component manages its own animation state.
 *
 * @param {React.ReactNode} props.children - The content displayed inside of this modal wrapper (the actual individual modal's display)
 *
 * @param {Function} props.onClose - Callback fired after the close animation has finished, tells the parent of this component to actually close the modal
 *
 * @param {boolean} props.isOpen - Tells this modal whether it is mounted or not
 */

import React, {useEffect, useState, cloneElement} from "react";
import {useSocket} from "../context/SocketContext.jsx";

export default function Modal({ children, onClose, isOpen }) {
    // Controls the opacity animation independently of the isOpen prop.
    // This allows the modal to animate itself out before being removed from the DOM.
    const [visible, setVisible] = useState(false);

    /**
     * Handles opening and closing animations.
     *
     * When opening, a short delay allows the browser to render the modal before applying the visible state, which lets the css transition
     * apply smoothly.
     *
     * When closing externally (from the parent telling the modal to close), immediately begin the fade-out animation. Without this, the modal will just disappear
     * with no animation, that is why we let this file handle the closing render instead of the parent.
     */
    useEffect(() => {
        if (isOpen) {

            // A delay that allows the transitions to animate correctly, honestly cannot remember why I chose 10 milliseconds as the timeout, probably eyeballed it
            setTimeout(() => {
                setVisible(true);
            }, 10)
        } else {
            setVisible(false);
        }
    }, [isOpen]);

    /**
     * Begins the closing animation BEFORE telling the parent that the modal is closing, this way it can animate before being unmounted
     */
    const handleClose = () => {

        // This starts the closing animation
        setVisible(false);

        // This tells the parent to unmount it (which physically removes the modal object from the page), waits the full 3 seconds
        setTimeout(() => {
            onClose();
        }, 300)
    }

    /**
     * Injects the onRequestClose prop into the modal's child component,
     * allowing any modal content to close itself without needing direct
     * access to the parent's state.
     *
     * This approach keeps the Modal component generic and reusable. Since the child component is rendered dynamically through the
     * `children` prop (rather than being explicitly rendered as something like `<LoginModal />`), props cannot be passed to it in the usual
     * way. `cloneElement` creates a copy of the child element with the additional `onRequestClose` prop, allowing every modal to receive
     * the close handler without requiring separate rendering logic for each modal type.
     */
    const childWithProps =
        React.isValidElement(children)
            ? cloneElement(children, {
                onRequestClose: handleClose,
            })
            : children;

    // Responsible for removing the modal from the DOM after the closing animation has completed.
    if (!isOpen && !visible) return null;

    return (
        // Full-screen overlay that allows the user to click anywhere on the page to close the modal. Probably could have used a ref like
        // we used in the LocationTypeahead dropdowns, but I coded this before that, so I had not learned about that yet
        <div
            className={`fixed inset-0 transition-colors duration-300 ease-in-out z-9999
                ${ visible ? 'bg-black/70' : 'bg-black/0'}`}
            onClick={handleClose}
        >
            <div className="h-full p-6 flex items-center justify-center transition-all duration-300 ease-in-out">

                {/* Prevents clicking inside the modal from closing it */}
                <div
                    className={`${
                        visible ? 'opacity-100' : 'opacity-0'}
                    `}
                    onClick={(e) => e.stopPropagation()}
                >
                    {childWithProps}
                </div>
            </div>
        </div>
    )
}