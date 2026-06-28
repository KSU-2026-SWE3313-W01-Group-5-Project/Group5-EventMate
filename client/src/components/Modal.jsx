import {useEffect, useState} from "react";

export default function Modal({ children, onClose, isOpen }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [isOpen]);

    const handleClose = () => {
        setVisible(false);

        setTimeout(() => {
            onClose();
        }, 300)
    }

    if (!isOpen && !visible) return null;

    return (
        <div
            className={`fixed inset-0 transition-colors duration-300 ease-in-out ${
                visible ? 'bg-black/60' : 'bg-black/0'
            }`}
            onClick={handleClose}
        >
            <div className="h-full p-6 flex items-center justify-center transition-all duration-300 ease-in-out">
                <div
                    className={`w-full max-w-md ${
                        visible ? 'opacity-100' : 'opacity-0'}
                    `}
                    onClick={(e) => e.stopPropagation()}
                >
                    {children}
                </div>
            </div>
        </div>
    )
}