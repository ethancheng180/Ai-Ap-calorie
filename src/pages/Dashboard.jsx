import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import MacroCard from '../components/analytics/MacroCard';
import AnalyticsChart from '../components/analytics/AnalyticsChart';
import { Plus, Flame, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getTodayStats } from '../services/foodService';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';

  const [stats, setStats] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0, mealCount: 0 });
  const [loading, setLoading] = useState(true);

  const calorieGoal = 2400;
  const proteinGoal = 180;

  useEffect(() => {
    async function fetchStats() {
      if (currentUser) {
        try {
          const todayStats = await getTodayStats(currentUser.uid);
          setStats(todayStats);
        } catch (err) {
          console.error('Failed to fetch today stats:', err);
        }
      }
      setLoading(false);
    }
    fetchStats();
  }, [currentUser]);

  const caloriePercent = Math.min((stats.calories / calorieGoal) * 100, 100);
  const proteinPercent = Math.min((stats.protein / proteinGoal) * 100, 100);

  return (
    <div className="fade-in space-y-6" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Welcome Banner */}
      <div className="flex-between">
        <div>
          <h1 className="text-h1" style={{ textTransform: 'capitalize' }}>Good Morning, {displayName}</h1>
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
          <h2 className="text-h1">{loading ? '...' : stats.calories.toLocaleString()}</h2>
          <p className="text-caption">of {calorieGoal.toLocaleString()} kcal goal</p>
          <div style={{ height: '6px', backgroundColor: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-full)', marginTop: '8px', overflow: 'hidden' }}>
            <div style={{ width: `${caloriePercent}%`, height: '100%', backgroundColor: 'var(--color-warning)', borderRadius: 'var(--radius-full)' }} />
          </div>
        </Card>

        <Card className="flex-col gap-2">
          <span className="text-caption">Protein</span>
          <h2 className="text-h1">{loading ? '...' : `${stats.protein}g`}</h2>
          <p className="text-caption">of {proteinGoal}g goal</p>
          <div style={{ height: '6px', backgroundColor: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-full)', marginTop: '8px', overflow: 'hidden' }}>
            <div style={{ width: `${proteinPercent}%`, height: '100%', backgroundColor: '#FF3B30', borderRadius: 'var(--radius-full)' }} />
          </div>
        </Card>

        <Card className="flex-col gap-2">
          <span className="text-caption">Meals Logged</span>
          <h2 className="text-h1">{loading ? '...' : stats.mealCount}</h2>
          <p className="text-caption">Today</p>
          <div style={{ height: '6px', backgroundColor: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-full)', marginTop: '8px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(stats.mealCount * 25, 100)}%`, height: '100%', backgroundColor: '#34C759', borderRadius: 'var(--radius-full)' }} />
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
