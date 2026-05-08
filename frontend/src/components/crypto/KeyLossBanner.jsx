const KeyLossBanner = ({ show, onDismiss }) => {
  if (!show) {
    return null;
  }

  const bannerStyle = {
    backgroundColor: '#fef3c7',
    borderLeft: '4px solid #f59e0b',
    padding: '12px 16px',
    marginBottom: '16px',
    borderRadius: '4px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
  };

  const messageStyle = {
    flex: 1,
    color: '#92400e',
    fontSize: '14px',
    lineHeight: '1.5',
  };

  const buttonStyle = {
    backgroundColor: '#f59e0b',
    color: 'white',
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    transition: 'background-color 0.2s',
  };

  return (
    <div style={bannerStyle}>
      <div style={messageStyle}>
        You recovered your account on a new device. Old messages encrypted with your previous key cannot be read. New messages with your contacts will be encrypted with a new key.
      </div>
      <button
        style={buttonStyle}
        onClick={onDismiss}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#d97706'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#f59e0b'}
      >
        Dismiss
      </button>
    </div>
  );
};

export default KeyLossBanner;
