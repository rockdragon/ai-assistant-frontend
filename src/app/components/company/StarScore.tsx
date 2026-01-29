export default function StarScore({score}: { score: number }) {
    const full = Math.floor(score);
    const half = score - full >= 0.5;

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="text-blue-500 text-2xl leading-none">
                {"★".repeat(full)}
                {half ? "☆" : ""}
                {"☆".repeat(5 - full - (half ? 1 : 0))}
            </div>
            <div className="mt-2 text-3xl font-bold">
                {score.toFixed(2)}
            </div>
        </div>
    );
}
