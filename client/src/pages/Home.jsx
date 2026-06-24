import {Link, useNavigate, useSearchParams} from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import LoginModal from "./modals/LoginModal.jsx";
import Modal from "../components/Modal.jsx";
import RegisterModal from "./modals/RegisterModal.jsx";

/*
    Home PAGE

    This is a very basic example of a page. Obviously we will fill this home page out with a lot more in the future.
    See below for an example of how JSX looks.
*/

export default function Home() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const modal = searchParams.get("modal");

    return (
        <>
            <Navbar />
            <div>
                <h1>Home</h1>
                <p>Welcome to the home page for this website!</p>

                {modal === "login" && (
                    <Modal onClose={() => navigate("/")}>
                        <LoginModal />
                    </Modal>
                )}
                {modal === "register" && (
                    <Modal onClose={() => navigate("/")}>
                        <RegisterModal />
                    </Modal>
                )}

                <button className={"bg-gray-500"} onClick={() => navigate("/?modal=login")}>Open Login Modal</button>
                <button className={"bg-gray-500"} onClick={() => navigate("/?modal=register")}>Open Register Modal</button>
            </div>
        </>
    )
}