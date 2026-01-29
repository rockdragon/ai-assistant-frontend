"use client";

import {createContext, useContext, useEffect, useRef, useState} from "react";
import {Utils} from "@/lib/libUtils";
import {clearTimeout} from "node:timers";
import {supabase} from "@/lib/supabaseClient";
import {UserResponse} from "@supabase/auth-js";
import {redirect} from "next/navigation";
import {AudioMessage, Geolocation} from "@/config/Constants";

const WebSocketContext = createContext<{
    socket: WebSocket | null;
    isConnected: boolean;
    reconnect: () => void;
} | null>(null);

export const WebSocketContextProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const reconnectAttempts = useRef(0);
    const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

    const MAX_RECONNECT_ATTEMPTS = 5;
    const RECONNECT_INTERVAL = 3000;

    const connect = () => {
        const ws = new WebSocket(Utils.webSocketServiceURL());

        ws.onopen = () => {
            console.log("✅ WebSocket connected");
            setIsConnected(true);
            reconnectAttempts.current = 0;

            // get geolocation
            Utils.getLocation().then((locationResult) => {
                // get user info, and then send an initial message
                supabase.auth.getUser().then((userResult: UserResponse) => {
                    if (userResult.data.user && userResult.data.user.identities!.length > 0) {
                        const userIdentity = Utils.extractUserIdentity(userResult.data.user.identities!);
                        console.log('[userInfo]\n', userResult.data.user);
                        console.log('[userIdentity]\n', userIdentity);

                        const loc: Geolocation = { longitude:0, latitude:0};
                        if (locationResult.ok) {
                            loc.latitude = locationResult.coords?.latitude!;
                            loc.longitude = locationResult.coords?.longitude!;
                        }

                        const message: AudioMessage = {
                            user_id: userIdentity?.identity_id || '',
                            platform: userIdentity?.provider || '',
                            audio_chunk: '',
                            location: loc,
                        };

                        ws.send(JSON.stringify(message));
                    } else
                        redirect('/auth/login');
                })
                    .catch((error: Error) => {
                        redirect('/auth/login');
                    });
            });

        }

        ws.onerror = (err) => {
            console.error(Utils.webSocketServiceURL());
            console.error("⚠️ WebSocket error", err);
        }

        ws.onclose = () => {
            console.warn("❌ WebSocket closed");
            setIsConnected(false);
            if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
                reconnectAttempts.current += 1;
                reconnectTimeout.current = setTimeout(() => {
                    console.log(`🔄 Reconnecting... (${reconnectAttempts.current})`);
                    connect();
                }, RECONNECT_INTERVAL);
            }
        }

        setSocket(ws);
    }

    const reconnect = () => {
        if (socket) socket.close();
        reconnectAttempts.current = 0;
        if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
        connect();
    };

    useEffect(() => {
        connect();
        if (socket) socket.close();
        if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    }, []);

    return (
        <WebSocketContext.Provider value={{socket, isConnected, reconnect}}>
            {children}
        </WebSocketContext.Provider>
    );
};

export function useWebSocket() {
    const ctx = useContext(WebSocketContext);
    if (!ctx) throw new Error("useWebSocket must be used within WebSocketProvider");
    return ctx;
}