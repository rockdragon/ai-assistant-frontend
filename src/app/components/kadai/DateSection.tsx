import { parseDeadline, AssignmentCard } from "@/app/components/kadai/AssignmentCard"

export function groupByDate(list: any[]) {
    const map: Record<string, any[]> = {}

    list.forEach(item => {
        const { dateKey } = parseDeadline(item.dead_line)
        if (!map[dateKey]) map[dateKey] = []
        map[dateKey].push(item)
    })

    return Object.entries(map)
}

export function DateSection({ items }: { items: any[] }) {
    const { monthDay } = parseDeadline(items[0].dead_line)

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-baseline gap-3 text-gray-800">
                <span className="text-xl font-semibold">{monthDay}</span>
                <span className="text-sm text-gray-500">
          {items[0].week_day}
        </span>
            </div>

            {items.map(item => (
                <AssignmentCard key={item.title} data={item} />
            ))}
        </div>
    )
}
