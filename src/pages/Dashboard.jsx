import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import MacroCard from '../components/analytics/MacroCard';
import AnalyticsChart from '../components/analytics/AnalyticsChart';
import { Plus, Flame, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="fade-in space-y-6" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Welcome Banner */}
      <div className="flex-between">
        <div>
          <h1 className="text-h1">Good Morning, Ethan</h1>
          <p className="text-body">Here is your daily summary.</p>
        </div>
        <Link to="/log" className="btn btn-primary">
          <Plus size={20} style={{ marginRight: '8px' }} />
          Log Meal
        </Link>
      </div>

      {/* Top Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-5)' }}>
        <Card className="flex-col gap-2">
          <div className="flex-between">
            <span className="text-caption">Calories Eaten</span>
            <Flame size={20} color="var(--color-warning)" />
          </div>
          <h2 className="text-h1">1,250</h2>
          <p className="text-caption">of 2,400 kcal goal</p>
          <div style={{ height: '6px', backgroundColor: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-full)', marginTop: '8px', overflow: 'hidden' }}>
            <div style={{ width: '52%', height: '100%', backgroundColor: 'var(--color-warning)', borderRadius: 'var(--radius-full)' }} />
          </div>
        </Card>

        <Card className="flex-col gap-2">
          <span className="text-caption">Protein</span>
          <h2 className="text-h1">90g</h2>
          <p className="text-caption">of 180g goal</p>
          <div style={{ height: '6px', backgroundColor: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-full)', marginTop: '8px', overflow: 'hidden' }}>
            <div style={{ width: '50%', height: '100%', backgroundColor: '#FF3B30', borderRadius: 'var(--radius-full)' }} />
          </div>
        </Card>

        <Card className="flex-col gap-2">
          <span className="text-caption">Burned</span>
          <h2 className="text-h1">420</h2>
          <p className="text-caption">Active calories</p>
          <div style={{ height: '6px', backgroundColor: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-full)', marginTop: '8px', overflow: 'hidden' }}>
            <div style={{ width: '30%', height: '100%', backgroundColor: '#34C759', borderRadius: 'var(--radius-full)' }} />
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-5)' }}>
        <Card title="Today's Intake" action={<Link to="/analytics" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>See Details</Link>}>
          <AnalyticsChart timeframe="daily" />
        </Card>

        <Card title="Quick Log">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((meal) => (
              <Link to="/log" key={meal} style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'background-color 200ms ease'
                }}>
                  <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{meal}</span>
                  <Plus size={16} color="var(--color-text-secondary)" />
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
