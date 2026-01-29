"use client";

import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
} from "recharts";

type Item = {
    key: string;
    value: number;
};

export default function CompanyRadar({
  items,
}: {
    items: Item[];
}) {
    const data = items.map(item => ({
        subject: item.key,
        score: item.value,
        fullMark: 5,
    }));

    return (
        <div className="w-full h-[420px]">
            <ResponsiveContainer>
                <RadarChart data={data}>
                    <PolarGrid/>
                    <PolarAngleAxis dataKey="subject"/>
                    <PolarRadiusAxis
                        angle={30}
                        domain={[0, 5]}
                        tickCount={6}
                    />
                    <Radar
                        name="評価"
                        dataKey="score"
                        stroke="#4F8EDC"
                        fill="#4F8EDC"
                        fillOpacity={0.25}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
