export default function privacyPolicyPage() {
    return (
        <main className="flex flex-col items-center p-6 min-h-screen bg-gray-50">
            <h1 className="text-2xl font-semibold mb-4 text-gray-800">
                Data Deletion Instructions for JP Speaking Assistant
            </h1>
            <p>
                We respect your right to delete your personal data. If you wish to remove your data from JP Speaking
                Assistant, please follow the instructions below:<br/>
                <br/>
                1. Account Linked via Facebook Login<br/>
                - You can revoke JP Speaking Assistant’s access to your Facebook account by going to:<br/>
                https://www.facebook.com/settings?tab=applications<br/>
                - Locate “JP Speaking Assistant” in the list and remove it.<br/>
                <br/>
                2. Request Data Deletion from Our Service<br/>
                - To delete any data stored on our servers associated with your account, send a request to:<br/>
                moyerock@gmail.com<br/>
                - Please include your account email or Facebook user ID in the request.<br/>
                <br/>
                3. Confirmation<br/>
                - We will confirm the deletion of your data via email within 30 days.<br/>
                <br/>
                4. Notes<br/>
                - Some anonymized or aggregated data may be retained for analytical purposes, which cannot be linked
                back to you personally.<br/>
                <br/>
                Thank you for using JP Speaking Assistant. Your privacy is important to us.<br/>
            </p>
        </main>
    );
};