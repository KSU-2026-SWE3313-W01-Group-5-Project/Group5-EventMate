import {ActionableNotification, ToastNotification} from "@carbon/react";

export const ToastNotificationWrapper = ({ notification, onClose}) => {
    const { kind, title, subtitle, actionButtonLabel, onActionButtonClick, lowContrast } = notification;

    if (actionButtonLabel) {
        return (
            <ActionableNotification
                kind={kind}
                title={title}
                subtitle={
                    <span className="line-clamp-2">
                        {subtitle}
                    </span>
                }
                actionButtonLabel={actionButtonLabel}
                onActionButtonClick={onActionButtonClick}
                onClose={onClose}
                lowContrast={lowContrast}
            />
        );
    }

    return (
        <ToastNotification
            kind={kind}
            title={title}
            subtitle={
                <span className="line-clamp-2">
                        {subtitle}
                </span>
            }
            onClose={onClose}
            role={kind === 'error' || kind === 'warning' ? 'alert' : 'status'}
            lowContrast={lowContrast}
        />
    );
};