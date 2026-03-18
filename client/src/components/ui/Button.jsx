const styles = {
  primary: {
    background: '#6C63FF',
    color: '#fff',
    border: 'none',
  },
  outline: {
    background: 'transparent',
    color: '#6C63FF',
    border: '1.5px solid #6C63FF',
  },
  ghost: {
    background: 'transparent',
    color: '#6C63FF',
    border: 'none',
  },
};

function Button({
  children,
  variant = 'primary',
  disabled,
  onClick,
  type = 'button',
  fullWidth = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[variant],
        padding: '10px 20px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        opacity: disabled ? 0.5 : 1,
        width: fullWidth ? '100%' : 'auto',
      }}
    >
      {children}
    </button>
  );
}

export default Button;