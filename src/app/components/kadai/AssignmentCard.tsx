export function parseDeadline(dead_line: string) {
    const [date, time] = dead_line.split(" ")
    const d = new Date(date)

    return {
        dateKey: date,                // 2026-01-28
        monthDay: `${d.getMonth() + 1}月${d.getDate()}日`,
        time,                          // 23:59
    }
}

export function AssignmentCard({ data }: { data: any }) {
    const { time } = parseDeadline(data.dead_line)

    return (
        <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-base font-medium text-gray-900">
                <a href="https://teams.microsoft.com/v2/" target="_blank">{data.title}</a>
            </p>

            <p className="mt-1 text-sm text-gray-600">
                期限：{time}
            </p>

            <p className="mt-1 text-sm text-gray-500">
                {data.class}
            </p>
        </div>
    )
}
