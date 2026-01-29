"use client";

import {useState, useEffect} from "react";
import Recorder from "@/app/components/Recorder";
import ChatView from "@/app/components/ChatView";
import {Separator} from "@/components/ui/separator";
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {User} from "lucide-react";
import {
    MessageOfChatView, MusicRecommendation,
    ResponseType,
    ServerResponseMessage,
} from "@/config/Constants";
import {WebSocketContextProvider} from "@/app/context/WebSocketContext";
import {changeCharacter} from "@/lib/userUtils";
import {supabase} from "@/lib/supabaseClient";
import {UserResponse} from "@supabase/auth-js";
import {Utils} from "@/lib/libUtils";
import Image from 'next/image';


const voiceRoles = ["ash", "ballad", "coral", "echo", "fable", "nova", "onyx", "sage", "shimmer"];

export default function HomePage() {
    const [messages, setMessages] = useState<MessageOfChatView[]>([]);
    const [voiceRole, setVoiceRole] = useState("ash");
    const [avatar, setAvatar] = useState("");

    useEffect(() => {
        supabase.auth.getUser().then((result: UserResponse) => {
            if (result.data.user && result.data.user.identities!.length > 0) {
                const userIdentity = Utils.extractUserIdentity(result.data.user.identities!);
                const identity_data = userIdentity?.identity_data!;
                const avatarUrl: string | undefined = identity_data['avatar_url'] ?? identity_data['picture'];
                console.log("avatarUrl", avatarUrl);

                if (avatarUrl) {
                    setAvatar(avatarUrl);
                }
            }
        });
    });

    const handleCharacterChange = (character: string) => {
        setVoiceRole(character);
        supabase.auth.getUser().then((result: UserResponse) => {
            if (result.data.user && result.data.user.identities!.length > 0) {
                const userIdentity = Utils.extractUserIdentity(result.data.user.identities!);
                const user_id = userIdentity?.identity_id;
                const platform = userIdentity?.provider;
                changeCharacter(user_id!, platform!, character)
                    .then(() => {
                        console.log('handleCharacterChange() was completed.');
                    })
                    .catch((err) => {
                        console.error('Unexpected error:', err);
                    });
            }
        });
    };

    const gotExistedCharacter = (character: string) => {
        setVoiceRole(character);
    };

    const handleMessage = (data: ServerResponseMessage) => {
        let text = data.response_type === ResponseType.Self ? data.user_text : data.reply_text;

        setMessages((prev) => {
            const copy = [...prev];
            const lastIndex = copy.findLastIndex(
                (m) => m.role === "assistant" && m.status === "loading"
            );

            if (data.response_type === ResponseType.Self) { // user message
                return [
                    ...copy,
                    {
                        role: "user",
                        text: text,
                        audio_url: data.audio_url,
                        status: "done",
                        reply_translation: data.reply_translation,
                        suggestion: data.suggestion,
                        suggestion_translation: data.suggestion_translation,
                        music_recommendation: data.music_recommendation,
                        company_rating: data.company_rating,
                        company_comparison: data.company_comparison,
                        kadai_result: data.kadai_result,
                        mcp: data.mcp,
                    },
                    {
                        role: "assistant",
                        status: "loading",
                        text: "",
                        mcp:false,
                    }
                ];
            } else { // assistant message
                if (lastIndex !== -1) {
                    copy[lastIndex] = {
                        role: "assistant",
                        text: text,
                        status: "done",
                        audio_url: data.audio_url,
                        reply_translation: data.reply_translation,
                        suggestion: data.suggestion,
                        suggestion_translation: data.suggestion_translation,
                        music_recommendation: data.music_recommendation,
                        company_rating: data.company_rating,
                        company_comparison: data.company_comparison,
                        kadai_result: data.kadai_result,
                        mcp: data.mcp,
                    };
                }
                return copy;
            }
        });
    };

    const handleLogout = () => {
        supabase.auth.signOut()
            .then(() => {
                console.log("logout successfully");
                window.location.href = "/auth/login";
            })
            .catch((err) => {
                console.error('Logout error:', err);
            });
    }

    return (
        <main className="flex flex-col items-center justify-between p-6 min-h-screen bg-gray-50">
            <div className="flex items-center">
                <Image src="/chatgpt.png"
                       alt="AI"
                       className="align-middle"
                       width={32}
                       height={32}/>
                <h1 className="align-middle text-2xl font-semibold ml-2 text-gray-800">
                    AIアシスタント
                </h1>
            </div>
            <div className="flex justify-between w-full max-w-7xl items-center">
                {/* audio character of AI */}
                <div className="w-60 items-center flex">
                    <span className="whitespace-nowrap text-sm text-gray-600">キャラクター：</span>
                    <Select value={voiceRole} onValueChange={handleCharacterChange}>
                        <SelectTrigger className="w-[140px] bg-white">
                            <SelectValue placeholder="キャラクター"/>
                        </SelectTrigger>

                        <SelectContent>
                            <> {/* fragment to mute IDE error report. */}
                                {voiceRoles.map((role) => (
                                    <SelectItem key={role} value={role}>
                                        {role}
                                    </SelectItem>
                                ))}
                            </>
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-60 flex justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="rounded-full border p-1 hover:bg-gray-100 transition">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={avatar}/>
                                    <AvatarFallback>
                                        <User className="h-6 w-6 text-gray-500"/>
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-40">
                            <DropdownMenuLabel>メニュー</DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem onSelect={() => handleLogout()}>
                                ログアウト
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <WebSocketContextProvider>
                <div
                    className="flex flex-col w-full max-w-7xl flex-1 overflow-y-auto bg-white rounded-lg shadow-sm p-4">
                    <ChatView messages={messages}/>
                </div>
                <div className="sticky bottom-2 w-full max-w-7xl bg-gray-50">
                    <Separator/>
                    <Recorder onMessageAction={handleMessage} gotExistedCharacter={gotExistedCharacter}/>
                </div>
            </WebSocketContextProvider>
        </main>
    );
}