export default function SummaryCard({ summary }: { summary: string }) {
    return (
        <div className="w-[220px] shrink-0 rounded-xl border bg-cyan-50 p-4">
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                🤖 比较の概要
            </h3>
            <p className="text-sm leading-relaxed text-gray-800">
                {summary}
            </p>
        </div>
    )
}
