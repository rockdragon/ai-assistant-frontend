import {Utils} from '@/lib/libUtils'

export async function loginUser(platform: string, user_id: string, email: string, name: string) {
    const userLoginURL = Utils.userLoginURL();
    const body = JSON.stringify({ platform, user_id, email, name });
    console.log(`invoke: ${userLoginURL}, body: ${body}`);

    const res = await fetch(userLoginURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: body,
        credentials: 'include', // if backend side returned HttpOnly cookie
    });

    if (!res.ok) throw new Error('ログインに失敗した！');
    return res.ok;
}

export async function changeCharacter(user_id: string, platform: string, character: string) {
    const changeCharacterURL = Utils.changeCharacterUrl();
    const body = JSON.stringify({ user_id, platform, character });
    console.log(`invoke: ${changeCharacterURL}, body: ${body}`);

    const res = await fetch(changeCharacterURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: body,
        credentials: 'include', // if backend side returned HttpOnly cookie
    });

    if (!res.ok) throw new Error('キャラクターをチェンジに失敗した！');
    return res.ok;
}
