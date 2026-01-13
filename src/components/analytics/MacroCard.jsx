import Card from '../ui/Card';

export default function MacroCard({ label, value, total, color, unit = 'g' }) {
    const percentage = Math.min(100, (value / total) * 100);

    return (
        <div style={{ marginBottom: 'var(--space-3)' }}>
            <div className="flex-between" style={{ marginBottom: 'var(--space-1)' }}>
                <span className="text-body" style={{ fontWeight: 500 }}>{label}</span>
                <span className="text-caption">
                    <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{value}</span> / {total}{unit}
                </span>
            </div>
            <div style={{
                height: '8px',
                backgroundColor: 'var(--color-bg-tertiary)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden'
            }}>
                <div style={{
                    height: '100%',
                    width: `${percentage}%`,
                    backgroundColor: color,
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 1s cubic-bezier(0.33, 1, 0.68, 1)'
                }} />
            </div>
        </div>
    );
}
