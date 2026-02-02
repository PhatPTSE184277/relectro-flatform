import { useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';

export function useNotificationHub({
    onAssignCompleted,
    token,
    userId
}: {
    onAssignCompleted: (data: any) => void;
    token: string;
    userId: string;
}) {
    const connectionRef = useRef<signalR.HubConnection | null>(null);

    useEffect(() => {
        if (!token || !userId) return;

        let isActive = true;
        const hubUrl = process.env.NEXT_PUBLIC_NOTIFICATION_HUB_URL;
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl as string, {
                accessTokenFactory: () => token,
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets
            })
            .withAutomaticReconnect()
            .build();

        connection.on('ReceiveNotification', (data) => {
            console.log('SignalR ReceiveNotification:', data);
            // Trigger callback cho tất cả notification, không filter theo action
            onAssignCompleted(data);
        });

        let started = false;
        connection.start()
            .then(() => {
                started = true;
                if (!isActive) {
                    connection.stop();
                }
            })
            .catch((err) => {
                console.log('SignalR connection error:', err);
            });
        connectionRef.current = connection;

        return () => {
            isActive = false;
            if (started) {
                connection.stop();
            }
        };
    }, [token, userId, onAssignCompleted]);
}
