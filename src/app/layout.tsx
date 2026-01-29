import "./globals.css";
import {WebSocketContextProvider} from "@/app/context/WebSocketContext";

export const metadata = {
    title: "日本語トークAI",
    description: "音声で話して、日本語がぐんぐん伸びる。日本語会話AIアプリ。",
}

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="ja">
        <body className="bg-gray-100 text-gray-900">
            {children}
        </body>
        </html>
    )
}