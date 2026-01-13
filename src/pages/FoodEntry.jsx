import { useState } from 'react';
import ImageUploader from '../components/food/ImageUploader';
import Card from '../components/ui/Card';
import MacroCard from '../components/analytics/MacroCard';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function FoodEntry() {
    const [status, setStatus] = useState('idle'); // idle, analyzing, result
    const [image, setImage] = useState(null);

    const handleImageSelected = (file, previewUrl) => {
        if (file) {
            setImage(previewUrl);
            setStatus('analyzing');
            // Mock analysis delay
            setTimeout(() => {
                setStatus('result');
            }, 2500);
        } else {
            setStatus('idle');
            setImage(null);
        }
    };

    const reset = () => {
        setStatus('idle');
        setImage(null);
    };

    return (
        <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}>
                <h1 className="text-h1">Log Food</h1>
                <p className="text-body">Snap a photo to get instant nutrition info.</p>
            </div>

            <div className="space-y-6">
                {status === 'idle' && (
                    <ImageUploader onImageSelected={handleImageSelected} />
                )}

                {status === 'analyzing' && (
                    <Card className="flex-center flex-col" style={{ minHeight: '300px', gap: 'var(--space-4)' }}>
                        <Loader2 className="spin" size={48} color="var(--color-accent)" />
                        <p className="text-body">Analyzing your food...</p>
                        <style>{`
               .spin { animation: spin 1s linear infinite; }
               @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
             `}</style>
                    </Card>
                )}

                {status === 'result' && (
                    <div className="fade-in space-y-6">
                        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                            <div style={{ width: '150px', height: '150px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', flexShrink: 0 }}>
                                <img src={image} alt="Food" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                                    <h2 className="text-h2">Salmon Salad Bowl</h2>
                                    <CheckCircle2 size={24} color="var(--color-success)" />
                                </div>
                                <p className="text-body" style={{ marginBottom: 'var(--space-4)' }}>
                                    Healthy mix of greens, protein, and healthy fats. Good source of Omega-3.
                                </p>
                                <div style={{ display: 'inline-flex', padding: '8px 16px', backgroundColor: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-full)' }}>
                                    <span style={{ fontWeight: 600 }}>450 kcal</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                            <Card title="Macros">
                                <div style={{ paddingTop: 'var(--space-2)' }}>
                                    <MacroCard label="Protein" value={35} total={180} color="#FF3B30" />
                                    <MacroCard label="Carbs" value={12} total={250} color="#34C759" />
                                    <MacroCard label="Fat" value={22} total={80} color="#FF9500" />
                                </div>
                            </Card>
                            <Card title="Micronutrients">
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    <li className="flex-between" style={{ padding: '8px 0', borderBottom: '1px solid var(--color-bg-tertiary)' }}>
                                        <span className="text-body">Vitamin D</span>
                                        <span style={{ fontWeight: 500 }}>30%</span>
                                    </li>
                                    <li className="flex-between" style={{ padding: '8px 0', borderBottom: '1px solid var(--color-bg-tertiary)' }}>
                                        <span className="text-body">Iron</span>
                                        <span style={{ fontWeight: 500 }}>15%</span>
                                    </li>
                                    <li className="flex-between" style={{ padding: '8px 0' }}>
                                        <span className="text-body">Calcium</span>
                                        <span style={{ fontWeight: 500 }}>5%</span>
                                    </li>
                                </ul>
                            </Card>
                        </div>

                        <div className="flex-center" style={{ marginTop: 'var(--space-8)' }}>
                            <button className="btn btn-primary" onClick={reset}>Scan Another</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
