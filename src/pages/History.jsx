import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFoodHistory } from '../services/foodService';
import Card from '../components/ui/Card';
import { Clock, Flame } from 'lucide-react';

export default function History() {
    const { currentUser } = useAuth();
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;

        async function loadHistory() {
            try {
                const data = await getFoodHistory(currentUser.uid);
                setEntries(data);
            } catch (err) {
                console.error('Failed to load history:', err);
            }
            setLoading(false);
        }

        loadHistory();
    }, [currentUser]);

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Just now';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    return (
        <div className="fade-in">
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h1 className="text-h1">Food History</h1>
                <p className="text-body">Your logged meals and nutrition data.</p>
            </div>

            {loading && (
                <div className="flex-center" style={{ minHeight: '200px' }}>
                    <p className="text-body">Loading...</p>
                </div>
            )}

            {!loading && entries.length === 0 && (
                <Card className="flex-center flex-col" style={{ minHeight: '200px', gap: 'var(--space-4)' }}>
                    <p className="text-body" style={{ opacity: 0.7 }}>No food entries yet.</p>
                    <p className="text-caption">Start logging by uploading a food photo!</p>
                </Card>
            )}

            {!loading && entries.length > 0 && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 'var(--space-4)'
                }}>
                    {entries.map((entry) => (
                        <Card key={entry.id} style={{ padding: 'var(--space-4)' }}>
                            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                {entry.imageDataUrl && (
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: 'var(--radius-md)',
                                        overflow: 'hidden',
                                        flexShrink: 0
                                    }}>
                                        <img
                                            src={entry.imageDataUrl}
                                            alt={entry.foodName}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                )}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h3 style={{
                                        fontSize: 'var(--font-size-base)',
                                        fontWeight: 600,
                                        marginBottom: '4px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {entry.foodName}
                                    </h3>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        color: 'var(--color-warning)',
                                        marginBottom: '4px'
                                    }}>
                                        <Flame size={14} />
                                        <span style={{ fontWeight: 500 }}>{entry.calories} kcal</span>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        color: 'var(--color-text-secondary)',
                                        fontSize: 'var(--font-size-xs)'
                                    }}>
                                        <Clock size={12} />
                                        <span>{formatDate(entry.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                            {entry.macros && (
                                <div style={{
                                    display: 'flex',
                                    gap: 'var(--space-3)',
                                    marginTop: 'var(--space-3)',
                                    paddingTop: 'var(--space-3)',
                                    borderTop: '1px solid var(--color-bg-tertiary)',
                                    fontSize: 'var(--font-size-xs)'
                                }}>
                                    <span style={{ color: '#FF3B30' }}>P: {entry.macros.protein}g</span>
                                    <span style={{ color: '#34C759' }}>C: {entry.macros.carbs}g</span>
                                    <span style={{ color: '#FF9500' }}>F: {entry.macros.fat}g</span>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
