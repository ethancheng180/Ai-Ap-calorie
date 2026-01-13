export default function SegmentedControl({ options, value, onChange }) {
    return (
        <div style={{
            backgroundColor: 'var(--color-bg-tertiary)',
            padding: '2px', // Tight padding like iOS
            borderRadius: 'var(--radius-md)',
            display: 'inline-flex',
            position: 'relative',
            userSelect: 'none',
            transition: 'background-color var(--duration-normal) var(--ease-out-smooth)'
        }}>
            {options.map((option) => {
                const isActive = value === option.value;
                return (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        style={{
                            padding: '6px 16px',
                            borderRadius: 'calc(var(--radius-md) - 2px)',
                            fontSize: 'var(--font-size-sm)',
                            fontWeight: isActive ? 600 : 400,
                            backgroundColor: isActive ? 'var(--color-bg-secondary)' : 'transparent',
                            color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                            boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 200ms cubic-bezier(0.33, 1, 0.68, 1)',
                            minWidth: '60px',
                            textAlign: 'center'
                        }}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}
