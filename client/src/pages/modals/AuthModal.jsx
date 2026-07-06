/**
 * AuthModal Wrapper
 *
 * Controls which authentication modal (Login or Register) is displayed based on the URL query parameter "modal"
 *
 * This component acts as a routing layer for authentication modals, allowing modal states to be controller via the URL
 * instead of a local component state. This does a couple of important things:
 * - Allows deep routing between pages (ie: sharing /?modal=login)
 * - Ensures modal state persists across refreshes and navigation
 * - Renders the generic Modal component (see components/Modal.jsx) and allows LoginModal and RegisterModal to swap between
 *      each other based on the current query value. This is important because it allows the modals to still animate
 *      correctly while swapping between each other (at least that was one of the main reasons I initially researched this solution).
 * - Provides the functions that Modal.jsx takes as props to allow modals to switch between each other or close them by
 *      updating the URL
 */

import RegisterModal from "./RegisterModal.jsx";
import LoginModal from "./LoginModal.jsx";
import Modal from "../../components/Modal.jsx";
import {useSearchParams} from "react-router-dom";

export function AuthModal({ modal, isOpen }) {
    const [searchParams, setSearchParams] = useSearchParams();

    if (!isOpen) return null;

    // Responsible for switching which query parameter is in the search bar
    const switchModal = (modalName) => {
        setSearchParams(prev => {
            const params = new URLSearchParams(prev);
            params.set("modal", modalName);
            return params;
        });
    };

    // Responsible for removing any modal query parameter from the search bar
    const closeModal = () => {
        setSearchParams(prev => {
            const params = new URLSearchParams(prev);
            params.delete("modal");
            return params;
        });
    };

    return (
        <Modal onClose={closeModal} isOpen={isOpen}>
            {modal === "login" ? (
                <LoginModal
                    onSwitch={() => switchModal("register")}
                />
            ) : modal === "register" ? (
                <RegisterModal
                    onSwitch={() => switchModal("login")}
                />
            ) : null}
        </Modal>
    );
}