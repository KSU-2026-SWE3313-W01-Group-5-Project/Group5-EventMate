import {ActionableNotification, ToastNotification} from "@carbon/react";

export const ToastNotificationWrapper = ({ notification, onClose}) => {
    const { kind, title, subtitle, actionLabel, onActionClick } = notification;

    if (actionLabel) {
        return (
            <ActionableNotification
                kind={kind}
                title={title}
                subtitle={subtitle}
                actionButton={actionLabel}
                onActionButtonClick={onActionClick}
                onClose={onClose}
                lowContrast={true}
            />
        );
    }

    return (
        <ToastNotification
            kind={kind}
            title={title}
            subtitle={subtitle}
            onClose={onClose}
            role={kind === 'error' || kind === 'warning' ? 'alert' : 'status'}
            lowContrast={true}
        />
    );
};