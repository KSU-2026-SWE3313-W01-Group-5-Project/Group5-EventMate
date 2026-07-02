import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";

export default function DeleteAccountModal({ onRequestClose, onDeleted }) {
    const {
        deleteUser, user
    } = useAuth();

    const [username, setUsername] = useState("");

    const [validUsername, setValidUsername] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setValidUsername(username === user.username);
    }, [username]);

    const handleDeletion = async (e) => {
        e.preventDefault();

        try {
            await deleteUser();

            setSuccess(true);
            setErrorMessage("");

            onDeleted();
        } catch (err) {
            if (!err?.response) {
                setErrorMessage("No Server Response");
            } else {
                setErrorMessage("Account Deletion Failed");
            }
        }
    };

    return (
        <>
            <div
                className={`
                flex flex-col gap-6
                w-full max-w-md 
                rounded-xl 
                border border-stone-200 
                bg-stone-50 dark:bg-zinc-800 dark:border-zinc-900 
                shadow-lg p-8 
                transition-colors duration-300
                `} onClick={(e) => e.stopPropagation()}
            >
                {success && (
                    <h1 className={"w-full px-4 py-3 rounded-md border border-green-200 bg-green-50 text-green-700 text-sm"}>
                        Account deleted successfully.
                    </h1>
                )}

                {errorMessage && (
                    <p className={`
                    w-full 
                    px-4 py-3  
                    rounded-md 
                    border border-red-200 bg-red-50
                    text-red-700
                    text-sm
                    `}>
                        {errorMessage}
                    </p>
                )}

                <h1 className={"text-center text-2xl font-bold text-stone-700 dark:text-white"}>
                    Delete Account
                </h1>

                <form onSubmit={handleDeletion}>
                    <fieldset disabled={success} className={"flex flex-col gap-4"}>
                        <p className="text-center text-xl font-bold uppercase tracking-wide text-red-600">
                            Permanently Delete Your Account
                        </p>

                        <p className="mt-3 text-center text-sm leading-6 text-gray-600 dark:text-gray-300">
                            This action <span className="font-semibold text-red-500">cannot be undone.</span>
                            Once your account is deleted, all of your data will be permanently removed.
                            If you are absolutely sure you want to continue, type your username,
                            <span className="mx-1 font-bold text-red-600">{user.username}</span>,
                            below to confirm.
                        </p>

                        <div
                            className={`
                            flex flex-wrap 
                            px-4 py-3 
                            gap-x-6 gap-y-2 
                            rounded-md 
                            border border-stone-300 bg-white 
                            text-stone-700 placeholder:text-stone-400 
                            focus-within:outline-none focus-within:ring-2 focus-within:ring-stone-500 
                            transition-colors duration-300
                            `}
                        >
                            <input
                                type={"text"}
                                placeholder={user.username}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete={"off"}
                                required={true}
                                className={"focus:outline-none"}
                            />
                        </div>

                        <button
                            type={"submit"}
                            disabled={!validUsername}
                            className={`
                            px-4 py-3
                            mt-2 rounded-md 
                            bg-stone-800 dark:bg-zinc-950/50 
                            hover:bg-stone-700 dark:hover:bg-white/5 disabled:bg-stone-700/50 dark:disabled:bg-zinc-950/25 
                            text-stone-50 font-medium
                            transition-color
                            `}
                        >
                            Delete Account
                        </button>
                    </fieldset>
                </form>
            </div>
        </>
    )
}