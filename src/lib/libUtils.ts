import {UserIdentity, UserResponse} from "@supabase/auth-js";

export class Utils {
    public static delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // websocket api url
    public static webSocketServiceURL(): string {
        const protocol_header = process.env.NEXT_PUBLIC_SERVER_HOST_WITH_SSL == "TRUE" ? "wss" : "ws";
        return `${protocol_header}://${process.env.NEXT_PUBLIC_SERVER_HOST}/api/langgraph/web/ws`;
    }

    // audio file response api url
    public static audioFileURL(audioPath: string): string {
        const protocol_header = process.env.NEXT_PUBLIC_SERVER_HOST_WITH_SSL == "TRUE" ? "https" : "http";
        return `${protocol_header}://${process.env.NEXT_PUBLIC_SERVER_HOST}${audioPath}`;
    }

    // user login api url
    public static userLoginURL(): string {
        const protocol_header = process.env.NEXT_PUBLIC_SERVER_HOST_WITH_SSL == "TRUE" ? "https" : "http";
        return `${protocol_header}://${process.env.NEXT_PUBLIC_SERVER_HOST}/api/user/login`;
    }

    // change audio character url
    public static changeCharacterUrl(): string {
        const protocol_header = process.env.NEXT_PUBLIC_SERVER_HOST_WITH_SSL == "TRUE" ? "https" : "http";
        return `${protocol_header}://${process.env.NEXT_PUBLIC_SERVER_HOST}/api/user/change_character`;
    }

    // blob 2 base64
    public static async blobToBase64Raw(blob: Blob): Promise<string> {
        const arrayBuffer = await blob.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        let binary = "";

        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }

        return btoa(binary); // base64 编码
    }

    // 13-bit timestamp by now
    public static getTimeStampByNow() {
        return Date.parse(new Date().toString())
    }

    // extract current user info from the response by Supabase authentication
    public static extractUserIdentity(identities: UserIdentity[], provider?: string): UserIdentity | undefined {
        const currentProvider = provider || localStorage.getItem("provider") || '';
        if (!currentProvider)
            return undefined;

        return identities!.find(identity => identity.provider === currentProvider);
    }

    // is a valid url string?
    public static isValidUrl(urlString: string) {
        const urlRegex = /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/[a-zA-Z0-9]+\.[^\s]{2,}|[a-zA-Z0-9]+\.[^\s]{2,})$/i;
        return urlRegex.test(urlString);
    }

    // is object was not empty
    public static isNotNullOrEmpty(obj: any) {
        return obj && Object.keys(obj).length > 0;
    }

    // get geolocation as Promise
    public static getLocation(): Promise<{
        ok: boolean;
        coords?: GeolocationCoordinates;
        error?: GeolocationPositionError;
    }> {
        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({ok: true, coords: pos.coords}),
                (err) => resolve({ok: false, error: err})
            );
        });
    }
}