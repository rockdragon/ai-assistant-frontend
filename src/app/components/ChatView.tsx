"use client";

import {Utils} from "@/lib/libUtils";
import {useEffect, useRef, useState} from "react";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {ChevronDown, ChevronUp, Globe, Sparkles} from "lucide-react";
import {MessageOfChatView} from "@/config/Constants";
import Link from 'next/link';
import CompanyRadar from "@/app/components/company/CompanyRadar";
import StarScore from "@/app/components/company/StarScore";
import SummaryCard from "@/app/components/company/SummaryCard";
import CompanyCompareCard from "@/app/components/company/CompanyCompareCard";
import {groupByDate, DateSection} from "@/app/components/kadai/DateSection";

export default function ChatView({messages}: { messages: MessageOfChatView[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [openTranslation, setOpenTranslation] = useState<number | null>(null);
    const [openSuggestion, setOpenSuggestion] = useState<number | null>(null);

    // depends on messages
    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver(() => {
            containerRef.current?.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: "smooth",
            });
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // loading component
    function AssistantLoadingBubble() {
        return (
            <div className="self-start bg-gray-100 max-w-[100%]">
                <div className="p-3 flex items-center gap-2 text-gray-500">
                    <span className="animate-pulse">処理中です</span>
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce delay-150">.</span>
                    <span className="animate-bounce delay-300">.</span>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="flex flex-col gap-3 mt-4 max-h-[80vh] overflow-y-auto"
        >
            {messages.map((m, i) => (
                <Card
                    key={i}
                    className={`relative max-w-[60%] ${
                        m.role === "user" ? "self-end bg-blue-50" : "self-start bg-gray-100 w-fit"
                    }`}
                >
                    {m.mcp && (
                        <span className="absolute -top-2 -left-2 rounded-full bg-green-600 px-2 py-0.5 text-xs font-semibold text-white shadow">
                          MCP
                        </span>
                    )}
                    <CardContent className="p-3 text-gray-800 whitespace-pre-wrap">
                        {/* HTML href link */}
                        <>
                            {Utils.isValidUrl(m.text) ? (<Link href={m.text} target="_blank">{m.text}</Link>) : (
                                <p className="text-base">
                                    <span>{m.text}</span>
                                </p>
                            )}
                        </>
                        <>
                            {m.role === "assistant" && m.status === "loading" && (
                                <AssistantLoadingBubble key={i}/>
                            )}
                        </>
                        {/* audio player */}
                        <>
                            {m.role === "assistant" && m.audio_url && (
                                <audio src={Utils.audioFileURL(m.audio_url)} controls className="mt-2 w-full"
                                       autoPlay></audio>
                            )}
                        </>
                        {/* AI reply translation */}
                        <>
                            {m.role === "assistant" && m.reply_translation && (m.reply_translation.Chinese || m.reply_translation.English || m.reply_translation.Korean) && (
                                <div className="mt-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs text-gray-500"
                                        onClick={() =>
                                            setOpenTranslation(openTranslation === i ? null : i)
                                        }
                                    >
                                        <Globe className="w-4 h-4 mr-1"/>
                                        翻訳
                                        <>
                                            {openTranslation === i ? (
                                                <ChevronUp className="w-3 h-3 ml-1"/>
                                            ) : (
                                                <ChevronDown className="w-3 h-3 ml-1"/>
                                            )}
                                        </>
                                    </Button>
                                    {openTranslation === i && (
                                        <div className="mt-1 text-sm text-gray-600 space-y-1">
                                            {m.reply_translation.Chinese && (
                                                <p>🇨🇳 {m.reply_translation.Chinese}</p>
                                            )}
                                            {m.reply_translation.English && (
                                                <p>🇺🇸 {m.reply_translation.English}</p>
                                            )}
                                            {m.reply_translation.Korean && (
                                                <p>🇰🇷 {m.reply_translation.Korean}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                        {/* reply suggestion for User */}
                        <>
                            {m.role === "assistant" && m.suggestion && (
                                <div className="mt-3 flex justify-end">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setOpenSuggestion(openSuggestion === i ? null : i)
                                        }
                                        className="text-xs text-gray-600"
                                    >
                                        <Sparkles className="w-4 h-4 mr-1"/>
                                        返事のアドバイス
                                    </Button>
                                </div>
                            )}
                        </>
                        <>
                            {openSuggestion === i && m.suggestion && (
                                <div className="mt-2 space-y-2">
                                    <Card
                                        className="bg-white border border-gray-200 shadow-sm"
                                    >
                                        <CardContent className="p-2 text-sm">
                                            <p className="font-medium">{m.suggestion}</p>

                                            <div className="text-gray-500 text-xs mt-1 space-y-0.5">
                                                {m.suggestion_translation?.Chinese &&
                                                    <p>🇨🇳 {m.suggestion_translation?.Chinese}</p>}
                                                {m.suggestion_translation?.English &&
                                                    <p>🇺🇸 {m.suggestion_translation?.English}</p>}
                                                {m.suggestion_translation?.Korean &&
                                                    <p>🇰🇷 {m.suggestion_translation?.Korean}</p>}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </>
                        {/* music recommendation */}
                        <>
                            {Utils.isNotNullOrEmpty(m.music_recommendation) && (
                                <iframe
                                    style={{borderRadius: '12px'}}
                                    src={"https://open.spotify.com/embed/track/" + m.music_recommendation?.track.id}
                                    width="420"
                                    height="152"
                                    frameBorder="0"
                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                    loading="lazy"></iframe>
                            )}
                        </>
                        {/* company rating */}
                        <>
                            {Utils.isNotNullOrEmpty(m.company_rating) && (
                                <div className="flex items-center gap-8">
                                    <div className="flex-1 min-w-0">
                                        <CompanyRadar items={m.company_rating?.item_list!}/>
                                    </div>
                                    <div className="w-[140px] flex-shrink-0">
                                        <StarScore score={m.company_rating?.overall!}/>
                                    </div>
                                </div>
                            )}
                        </>
                        {/* companies comparison */}
                        <>
                            {Utils.isNotNullOrEmpty(m.company_comparison) && (
                                <div className="flex items-start gap-8">
                                    <SummaryCard summary={m.company_comparison!.comparison_summary}/>
                                    <div className="grid grid-cols-2 gap-6 flex-1">
                                        {m.company_comparison!.detailed_analysis.map(company => (
                                            <CompanyCompareCard key={company.company} data={company}/>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                        {/* kadai remainder */}
                        <>
                            {m.kadai_result && m.kadai_result.length > 0 && (
                                <div className="flex flex-col gap-6 w-full max-w-m mt-2">
                                    <hr className="border-gray-300"/>
                                    {groupByDate(m.kadai_result!).map(([dateKey, items]) => (
                                        <DateSection key={dateKey} items={items}/>
                                    ))}
                                </div>
                            )}
                        </>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}