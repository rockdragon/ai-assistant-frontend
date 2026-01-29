export class Constants {
    public static SECOND: number = 1000;
}

export enum ResponseType {
    Self = "SELF",
    AI = "AI",
    ECHO = "ECHO",
    ERROR = "ERROR",
}

export type TranslationOfWords = {
    English: string;
    Chinese: string;
    Korean: string;
}

export type Geolocation = {
    latitude: number;
    longitude: number;
}

export type AudioMessage = {
    user_id: string;
    platform: string;
    audio_chunk: string;
    location: Geolocation;
}

export type TrackInfo = {
    id: string;
    album: string;
    cover: string;
}

export type MusicRecommendation = {
    artist: string;
    song: string;
    description: string;
    track: TrackInfo;
}

export type CompanyRatingKeyValue = {
    key: string;
    value: number;
}

export type CompanyRating = {
    url: string;
    name: string;
    overall: number;
    item_list: CompanyRatingKeyValue[];
}

export type CompanyComparisonDetail = {
    company: string;
    strengths: string[];
    weaknesses: string[];
    suitable_for: string;
}

export type CompanyComparison = {
    comparison_summary: string;
    detailed_analysis: CompanyComparisonDetail[];
}

export type KadaiResult = {
    dead_line: string;
    week_day: string;
    title: string;
    class: string;
}

export type MessageOfChatView = {
    role: "user" | "assistant";
    text: string;
    audio_url?: string;
    status?: "loading" | "done";  // before the message(role==="assistant") comes
    reply_translation?: TranslationOfWords,
    suggestion?: string,
    suggestion_translation?: TranslationOfWords,
    music_recommendation?: MusicRecommendation,
    company_rating?: CompanyRating,
    company_comparison?: CompanyComparison,
    kadai_result?: KadaiResult[],
    mcp:boolean,
}

export type ServerResponseMessage = {
    response_type: ResponseType;
    user_text: string;
    reply_text: string;
    audio_url: string;
    conversation_id: string;
    character: string,
    reply_translation: TranslationOfWords;
    suggestion: string;
    suggestion_translation: TranslationOfWords;
    music_recommendation: MusicRecommendation;
    company_rating: CompanyRating,
    company_comparison: CompanyComparison,
    kadai_result: KadaiResult[],
    mcp: boolean,
}
