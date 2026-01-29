'use client'

import {useEffect} from 'react'
import {supabase} from '@/lib/supabaseClient'
import {useRouter, useSearchParams} from 'next/navigation'
import {Utils} from "@/lib/libUtils";
import {loginUser} from "@/lib/userUtils";

export default function CallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const provider = searchParams.get('provider') || '';

    useEffect(() => {
        localStorage.setItem('provider', provider);

        supabase.auth.getSession().then((user) => {
            console.log('[resp]', user);
            const userIdentity = Utils.extractUserIdentity(user.data.session!.user.identities!, provider);
            console.log('[userIdentity]', userIdentity);
            loginUser(provider, userIdentity?.identity_id!, userIdentity?.identity_data!.email, userIdentity?.identity_data!.name)
                .then(() => {
                    router.push('/');
                })
                .catch((err) => {
                    console.error('loginUser error:', err);
                });
            // router.push('/');
        });
    }, [])

    return (
        <p>Logging in...</p>
    )
}