import {createContext, useCallback, useContext, useState} from 'react';
import {ToastNotificationWrapper} from "../components/notification_components/ToastNotificationWrapper.jsx";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback(({ kind, title, subtitle, timeout = 5000, lowContrast = true }) => {
        const id = Date.now();
        setNotifications((prevState) => [...prevState, {id, kind, title, subtitle}])

        if (timeout) {
            setTimeout(() => {
                removeNotification(id);
            }, timeout);
        }
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications((prevState) => prevState.filter((notification) => notification.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}

            <div className={`fixed top-4 right-4 z-9999 flex flex-col gap-2 max-w-sm w-full pointer-events-none`}>
                {notifications.map((notification) => (
                    <div key={notification.id} className={`pointer-events-auto shadow-lg animate-slide-in `}>
                        <ToastNotificationWrapper
                            notification={notification}
                            onClose={() => removeNotification(notification.id)}
                        />
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    )
}

export const useNotifications = () => useContext(NotificationContext);