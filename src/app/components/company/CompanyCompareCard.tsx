import Section  from "@/app/components/general/Section";

export default function CompanyCompareCard({ data }: { data: any }) {
    return (
        <div className="rounded-xl border bg-white p-4 shadow-sm">
            {/* 会社名 */}
            <h4 className="mb-3 text-base font-semibold">
                {data.company}
            </h4>

            {/* 強み */}
            <Section
                title="強み"
                color="green"
                items={data.strengths}
            />

            {/* 弱み */}
            <Section
                title="弱み"
                color="red"
                items={data.weaknesses}
            />

            {/* 向いている方 */}
            <div className="mt-3 rounded-lg bg-gray-50 p-2 text-sm">
                <span className="font-bold">向いている方：</span>
                {data.suitable_for}
            </div>
        </div>
    )
}
