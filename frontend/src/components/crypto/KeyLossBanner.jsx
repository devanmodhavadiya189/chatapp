const KeyLossBanner = ({ show, onDismiss }) => {
  if (!show) return null;

  return (
    <div
      style={{
        background: 'rgba(245, 158, 11, 0.1)',
        borderLeft: '4px solid #f59e0b',
        padding: '12px 16px',
        marginBottom: '16px',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ flex: 1, color: '#d97706', fontSize: '14px', lineHeight: '1.5' }}>
        You recovered your account on a new device. Old messages encrypted with your previous key cannot be read. New messages with your contacts will be encrypted with a new key.
      </div>
      <button
        style={{
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          color: 'white',
          padding: '6px 16px',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '500',
          whiteSpace: 'nowrap',
          transition: 'all 0.2s ease',
        }}
        onClick={onDismiss}
        onMouseEnter={(e) => e.target.style.filter = 'brightness(1.1)'}
        onMouseLeave={(e) => e.target.style.filter = 'brightness(1)'}
      >
        Dismiss
      </button>
    </div>
  );
};

export default KeyLossBanner;
