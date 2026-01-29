export default function privacyPolicyPage() {
    return (
        <main className="flex flex-col items-center p-6 min-h-screen bg-gray-50">
            <h1 className="text-2xl font-semibold mb-4 text-gray-800">
                <p>Version: {process.env.APP_VERSION}</p>
            </h1>
        </main>
    );
};