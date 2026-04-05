'use client';

import Toast from '@/components/ui/Toast';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { clearNotificationMessage } from '@/redux/reducers/authReducer';

export default function NotificationDisplay() {
    const dispatch = useAppDispatch();
    const message = useAppSelector((state) => state.auth.notificationMessage);

    return (
        <Toast
            open={Boolean(message)}
            type="error"
            message={message || ''}
            onClose={() => dispatch(clearNotificationMessage())}
        />
    );
}
