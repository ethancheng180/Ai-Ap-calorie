import { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import SegmentedControl from '../components/ui/SegmentedControl';
import AnalyticsChart from '../components/analytics/AnalyticsChart';
import MacroCard from '../components/analytics/MacroCard';
import { useAuth } from '../context/AuthContext';
import { getTodayStats } from '../services/foodService';

export default function Analytics() {
    const { currentUser } = useAuth();
    const [timeframe, setTimeframe] = useState('daily');
    const [stats, setStats] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 });
    const [loading, setLoading] = useState(true);

    const timeframeOptions = [
        { label: 'Daily', value: 'daily' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
        { label: 'Yearly', value: 'yearly' },
    ];

    useEffect(() => {
        async function fetchStats() {
            if (currentUser) {
                try {
                    const todayStats = await getTodayStats(currentUser.uid);
                    setStats(todayStats);
                } catch (err) {
                    console.error('Failed to fetch stats:', err);
                }
            }
            setLoading(false);
        }
        fetchStats();
    }, [currentUser]);

    return (
        <div className="fade-in space-y-6" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div className="flex-between">
                <div>
                    <h1 className="text-h1">Analytics</h1>
                    <p className="text-body">Track your progress over time.</p>
                </div>
                <SegmentedControl
                    options={timeframeOptions}
                    value={timeframe}
                    onChange={setTimeframe}
                />
            </div>

            {/* Main Chart Section */}
            <Card title="Calorie Intake">
                <div style={{ marginBottom: 'var(--space-4)' }}>
                    <h2 className="text-h2" style={{ fontSize: '36px', lineHeight: 1 }}>
                        {loading ? '...' : stats.calories.toLocaleString()}
                        <span className="text-body" style={{ fontSize: 'var(--font-size-lg)', marginLeft: 'var(--space-2)', fontWeight: 400 }}>kcal today</span>
                    </h2>
                </div>
                <AnalyticsChart timeframe={timeframe} />
            </Card>

            {/* Secondary Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-5)' }}>
                <Card title="Macro Distribution (Today)">
                    <div style={{ paddingTop: 'var(--space-2)' }}>
                        <MacroCard label="Protein" value={stats.protein} total={180} color="#FF3B30" />
                        <MacroCard label="Carbs" value={stats.carbs} total={250} color="#34C759" />
                        <MacroCard label="Fats" value={stats.fats} total={80} color="#FF9500" />
                    </div>
                </Card>

                <Card title="Today's Summary">
                    <div className="flex-center" style={{ height: '100%', flexDirection: 'column', gap: 'var(--space-2)', textAlign: 'center', opacity: 0.7 }}>
                        <p className="text-body">Total Calories</p>
                        <h3 className="text-h1">{loading ? '...' : stats.calories.toLocaleString()}</h3>
                        <p className="text-caption">{stats.calories > 0 ? 'Keep logging to track your progress!' : 'Log some meals to get started.'}</p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
