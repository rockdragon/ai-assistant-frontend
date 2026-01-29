export default function Section({
                     title,
                     color,
                     items
                 }: {
    title: string
    color: "green" | "red"
    items: string[]
}) {
    const colorMap = {
        green: "text-green-600",
        red: "text-red-600"
    }

    return (
        <div className="mb-3">
            <h5 className={`mb-1 text-sm font-medium ${colorMap[color]}`}>
                {title}
            </h5>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                {items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                ))}
            </ul>
        </div>
    )
}
