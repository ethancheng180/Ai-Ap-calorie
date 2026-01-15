import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getChartData } from '../../services/foodService';
import { useAuth } from '../../context/AuthContext';

export default function AnalyticsChart({ timeframe }) {
    const { currentUser } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (currentUser) {
                setLoading(true);
                try {
                    const chartData = await getChartData(currentUser.uid, timeframe);
                    setData(chartData);
                } catch (err) {
                    console.error('Failed to fetch chart data:', err);
                    setData([]);
                }
                setLoading(false);
            }
        }
        fetchData();
    }, [currentUser, timeframe]);

    if (loading) {
        return (
            <div style={{ width: '100%', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p className="text-caption">Loading chart data...</p>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div style={{ width: '100%', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px' }}>
                <p className="text-body" style={{ opacity: 0.7 }}>No data yet</p>
                <p className="text-caption">Log some meals to see your chart!</p>
            </div>
        );
    }

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
