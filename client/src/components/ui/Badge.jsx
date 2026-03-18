function Badge({ children }) {
  return (
    <span
      style={{
        display: 'inline-block',
        background: '#ede9ff',
        color: '#6C63FF',
        fontSize: '11px',
        fontWeight: 500,
        padding: '3px 10px',
        borderRadius: '99px',
      }}
    >
      {children}
    </span>
  );
}

export default Badge;