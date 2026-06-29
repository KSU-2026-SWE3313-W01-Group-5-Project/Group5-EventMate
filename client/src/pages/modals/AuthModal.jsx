import RegisterModal from "./RegisterModal.jsx";
import LoginModal from "./LoginModal.jsx";
import Modal from "../../components/Modal.jsx";
import {useSearchParams} from "react-router-dom";

export function AuthModal({ modal, isOpen }) {
    const [searchParams, setSearchParams] = useSearchParams();

    if (!isOpen) return null;

    const switchModal = (modalName) => {
        setSearchParams(prev => {
            const params = new URLSearchParams(prev);
            params.set("modal", modalName);
            return params;
        });
    };

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