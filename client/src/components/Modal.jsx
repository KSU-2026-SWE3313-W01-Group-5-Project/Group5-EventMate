import {useEffect, useState} from "react";

export default function Modal({ children, onClose }) {
    const [visible, setVisible] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => {
            setMounted(true);
            setTimeout(() => {
                setVisible(true);
            }, 10);
        })
    }, [])

    const handleClose = () => {
        setVisible(false);

        setTimeout(() => {
            setMounted(false);
            onClose();
        }, 300)
    }

    if (!mounted) return null;

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