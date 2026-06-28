import RegisterModal from "./RegisterModal.jsx";
import LoginModal from "./LoginModal.jsx";
import Modal from "../../components/Modal.jsx";

export function AuthModal({ modal, isOpen, navigate }) {
    if (!isOpen) return null;

    return (
        <Modal onClose={() => navigate("/")} isOpen={isOpen}>
            {modal === "login" && (
                <LoginModal
                    onSwitch={() => navigate("/?modal=register")}
                />
            )}

            {modal === "register" && (
                <RegisterModal
                    onSwitch={() => navigate("/?modal=login")}
                />
            )}
        </Modal>
    );
}