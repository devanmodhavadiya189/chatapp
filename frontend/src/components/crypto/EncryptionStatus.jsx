const EncryptionStatus = ({ status, userPublicKey }) => {
  const getStatusDisplay = () => {
    if (!status) {
      return { text: 'Not Secured', color: 'var(--text-muted)', bgColor: 'var(--bg-surface-hover)' };
    }
    if (status.ready === true) {
      return { text: 'Secured', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' };
    }
    if (status.message && status.message.includes('Establishing')) {
      return { text: 'Establishing', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)' };
    }
    if (status.message && (status.message.includes('not available') || status.message.includes('not found'))) {
      return { text: 'Not Secured', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' };
    }
    if (status.message && status.message.includes('failed')) {
      return { text: 'Failed', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' };
    }
    return { text: 'Not Secured', color: 'var(--text-muted)', bgColor: 'var(--bg-surface-hover)' };
  };

  const display = getStatusDisplay();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '4px 8px',
        borderRadius: '8px',
        backgroundColor: display.bgColor,
        fontSize: '12px',
        fontWeight: '500',
        transition: 'all 0.3s ease',
      }}
      title={status?.message || 'Encryption status'}
    >
      <span style={{ color: display.color, whiteSpace: 'nowrap' }}>{display.text}</span>
    </div>
  );
};

export default EncryptionStatus;
