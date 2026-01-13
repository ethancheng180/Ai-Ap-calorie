export default function Card({ children, className = '', title, action }) {
    return (
        <div className={`card ${className}`} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {(title || action) && (
                <div className="flex-between" style={{ marginBottom: 'var(--space-4)' }}>
                    {title && <h3 className="text-h3" style={{ fontSize: 'var(--font-size-lg)' }}>{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            <div style={{ flex: 1 }}>
                {children}
            </div>
        </div>
    );
}
