'use client'

import {supabase} from '@/lib/supabaseClient'
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Card, CardHeader, CardTitle, CardDescription, CardContent} from "@/components/ui/card";
import {Loader2, Github, Facebook, Chrome} from "lucide-react";

export default function LoginPage() {
    const handleLogin = (provider: 'google' | 'facebook' | 'github') => {
        supabase.auth
            .signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${location.origin}/auth/callback?provider=${provider}`,
                },
            })
            .then(({data, error}) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log('OAuth redirect started:', data);
                }
            })
            .catch((err) => {
                console.error('Unexpected error:', err);
            });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <Card className="w-[360px] shadow-lg border border-gray-200">
                <p>
                </p>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl font-semibold">ログイン</CardTitle>
                    <CardDescription>お持ちのアカウントで登録/ログイン</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button
                        onClick={() => handleLogin('google')}
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 capitalize"
                    >
                        <Chrome className="w-4 h-4"/>
                        Google
                    </Button>
                    <Button
                        onClick={() => handleLogin('facebook')}
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 capitalize"
                    >
                        <Facebook className="w-4 h-4"/>
                        Facebook
                    </Button>
                    <Button
                        onClick={() => handleLogin('github')}
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 capitalize"
                    >
                        <Github className="w-4 h-4"/>
                        Github
                    </Button>
                </CardContent>
                <p>
                </p>
            </Card>
        </div>
    )
}
