import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const MOCK_DATA = {
    daily: [
        { name: '6am', calories: 0 },
        { name: '9am', calories: 450 },
        { name: '12pm', calories: 850 },
        { name: '3pm', calories: 200 },
        { name: '6pm', calories: 700 },
        { name: '9pm', calories: 150 },
    ],
    weekly: [
        { name: 'Mon', calories: 2100 },
        { name: 'Tue', calories: 1950 },
        { name: 'Wed', calories: 2300 },
        { name: 'Thu', calories: 1800 },
        { name: 'Fri', calories: 2500 },
        { name: 'Sat', calories: 2100 },
        { name: 'Sun', calories: 1900 },
    ],
    monthly: Array.from({ length: 30 }, (_, i) => ({
        name: `${i + 1}`,
        calories: Math.floor(Math.random() * 800) + 1600
    })),
    yearly: [
        { name: 'Jan', calories: 2100 },
        { name: 'Feb', calories: 2000 },
        { name: 'Mar', calories: 2150 },
        { name: 'Apr', calories: 1950 },
        { name: 'May', calories: 2200 },
        { name: 'Jun', calories: 2100 },
        { name: 'Jul', calories: 1900 },
        { name: 'Aug', calories: 2050 },
        { name: 'Sep', calories: 2150 },
        { name: 'Oct', calories: 2000 },
        { name: 'Nov', calories: 1850 },
        { name: 'Dec', calories: 2250 },
    ],
};

export default function AnalyticsChart({ timeframe }) {
    const data = useMemo(() => MOCK_DATA[timeframe] || [], [timeframe]);

    // Dynamic color based on value logic could be added here, currently using primary accent
    return (
        <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-bg-tertiary)" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                    />
                    <Tooltip
                        cursor={{ fill: 'var(--color-bg-tertiary)', opacity: 0.5 }}
                        contentStyle={{
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            backgroundColor: 'var(--color-bg-secondary)',
                            color: 'var(--color-text-primary)'
                        }}
                    />
                    <Bar dataKey="calories" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.calories > 2400 ? 'var(--color-warning)' : 'var(--color-accent)'}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
