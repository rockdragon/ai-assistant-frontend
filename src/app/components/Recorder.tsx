"use client";

import {useEffect, useRef, useState} from "react";
import {Mic, Square, Unplug} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/dialog";
import {useWebSocket} from "@/app/context/WebSocketContext";
import {AudioMessage, Geolocation, ResponseType, ServerResponseMessage} from "@/config/Constants";
import {Utils} from "@/lib/libUtils";
import {supabase} from "@/lib/supabaseClient";
import {UserResponse} from "@supabase/auth-js";

type Props = {
    onMessageAction: (data: ServerResponseMessage) => void;
    gotExistedCharacter: (character: string) => void;
}

export default function Recorder({onMessageAction, gotExistedCharacter}: Props) {
    const {socket, isConnected, reconnect} = useWebSocket();
    const [recording, setRecording] = useState(false);
    const [waitingResponse, setWaitingResponse] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!isConnected || !socket) return;

        socket?.addEventListener("message", handleMessage);
        console.log(`${Utils.getTimeStampByNow()} - after [addEventListener] message on socket.`)

        return () => socket?.removeEventListener("message", handleMessage);
    }, [isConnected, socket]);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true});
        if (!mediaRecorderRef.current) {
            mediaRecorderRef.current = new MediaRecorder(stream, {mimeType: "audio/webm"});
            mediaRecorderRef.current?.addEventListener("dataavailable", onDataAvailable);
        }

        mediaRecorderRef?.current?.start();
        setRecording(true);
    };

    const stopRecording = async () => {
        if (mediaRecorderRef.current) {
            // stop event listener
            mediaRecorderRef.current.addEventListener("stop", mediaRecorderOnStop);

            console.log("stop recording...");
            mediaRecorderRef.current.stop();
        }
    };

    // receive data from Server side
    const handleMessage = (event: MessageEvent) => {
        const data: ServerResponseMessage = JSON.parse(event.data);
        console.log("[handleMessage] get a message:", data);

        // at first, just ECHO
        if (data.response_type === ResponseType.ECHO) {
            console.log("[ECHO] respond by server!");
            gotExistedCharacter(data.character);
            return
        }
        // if there was an error, ALERT it!
        if (data.response_type === ResponseType.ERROR) {
            console.log("[ECHO] respond by server!");
            setErrorMessage(data.reply_text);
            setOpen(true);
            return
        }

        onMessageAction(data);

        // response from AI
        if (data.response_type === ResponseType.AI) {
            gotExistedCharacter(data.character);
            setWaitingResponse(false);
        }
    };

    // send data to Server side
    const onDataAvailable = async (e: BlobEvent) => {
        console.log("[onDataAvailable] socket?.readyState", socket?.readyState);
        if (e.data.size > 0 && socket?.readyState === WebSocket.OPEN) {
            console.log("[onDataAvailable] sent data size: ", e.data.size);

            const result = await supabase.auth.getUser();
            if (result.data.user && result.data.user.identities!.length > 0) {
                const userIdentity = Utils.extractUserIdentity(result.data.user.identities!);
                const blobData = await Utils.blobToBase64Raw(e.data);

                // get geolocation
                Utils.getLocation().then((locationResult) => {
                    const loc: Geolocation = { longitude:0, latitude:0};
                    if (locationResult.ok) {
                        loc.latitude = locationResult.coords?.latitude!;
                        loc.longitude = locationResult.coords?.longitude!;
                    }

                    const message: AudioMessage = {
                        user_id: userIdentity?.identity_id || '',
                        platform: userIdentity?.provider || '',
                        audio_chunk: blobData,
                        location: loc,
                    };

                    socket.send(JSON.stringify(message));

                    setWaitingResponse(true);
                });
            }

            // socket.send(e.data);
            //
            // setWaitingResponse(true);
        }
    };

    // stop event listener
    const mediaRecorderOnStop = () => {
        mediaRecorderRef.current?.removeEventListener("stop", mediaRecorderOnStop);
        // mediaRecorderRef.current?.removeEventListener("dataavailable", onDataAvailable);

        setRecording(false);
        console.log("recording stopped.");
    };

    return (
        <div>
            <div className="flex justify-center mt-4">
                {!recording ? (
                    !waitingResponse ? (
                        <Button onClick={startRecording} className="bg-blue-600 hover:big-blue-700">
                            <Mic className="mr-2"/>録音開始
                        </Button>
                    ) : (
                        <Button disabled>答えを待ち...</Button>
                    )
                ) : (
                    <Button onClick={stopRecording} className="bg-blue-600 hover:big-blue-700">
                        <Square className="mr-2"/>一時停止
                    </Button>
                )}
                {!isConnected && (
                    <Button onClick={reconnect} className="ext-blue-500">
                        <Unplug className="mr-2"/>再接続
                    </Button>
                )}
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>エラー</DialogTitle>
                        <DialogDescription>
                            {errorMessage}
                        </DialogDescription>
                    </DialogHeader>
                    <button
                        onClick={() => setOpen(false)}
                        className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        OK
                    </button>
                </DialogContent>
            </Dialog>
        </div>
    );
}