import { useState } from 'react';
import Card from '../components/ui/Card';
import SegmentedControl from '../components/ui/SegmentedControl';
import AnalyticsChart from '../components/analytics/AnalyticsChart';
import MacroCard from '../components/analytics/MacroCard';

export default function Analytics() {
    const [timeframe, setTimeframe] = useState('daily');

    const timeframeOptions = [
        { label: 'Daily', value: 'daily' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
        { label: 'Yearly', value: 'yearly' },
    ];

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
                        {timeframe === 'daily' ? '2,350' : '2,100'}
                        <span className="text-body" style={{ fontSize: 'var(--font-size-lg)', marginLeft: 'var(--space-2)', fontWeight: 400 }}>kcal avg</span>
                    </h2>
                </div>
                <AnalyticsChart timeframe={timeframe} />
            </Card>

            {/* Secondary Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-5)' }}>
                <Card title="Macro Distribution (Avg)">
                    <div style={{ paddingTop: 'var(--space-2)' }}>
                        <MacroCard label="Protein" value={140} total={180} color="#FF3B30" />
                        <MacroCard label="Carbs" value={220} total={250} color="#34C759" />
                        <MacroCard label="Fats" value={65} total={80} color="#FF9500" />
                    </div>
                </Card>

                <Card title="Goals">
                    <div className="flex-center" style={{ height: '100%', flexDirection: 'column', gap: 'var(--space-2)', textAlign: 'center', opacity: 0.7 }}>
                        <p className="text-body">Streak</p>
                        <h3 className="text-h1">12 Days</h3>
                        <p className="text-caption">You're slightly under your calorie goal this week.</p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
