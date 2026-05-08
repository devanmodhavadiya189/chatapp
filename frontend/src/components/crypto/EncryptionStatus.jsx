const EncryptionStatus = ({ status, userPublicKey }) => {
  const getStatusDisplay = () => {
    if (!status) {
      return { text: 'Not Secured', color: '#999', bgColor: '#f5f5f5' };
    }

    if (status.ready === true) {
      return { text: 'Secured', color: '#10b981', bgColor: '#ecfdf5' };
    }

    if (status.message && status.message.includes('Establishing')) {
      return { text: 'Establishing', color: '#f59e0b', bgColor: '#fffbf0' };
    }

    if (status.message && (status.message.includes('not available') || status.message.includes('not found'))) {
      return { text: 'Not Secured', color: '#ef4444', bgColor: '#fef2f2' };
    }

    if (status.message && status.message.includes('failed')) {
      return { text: 'Failed', color: '#ef4444', bgColor: '#fef2f2' };
    }

    return { text: 'Not Secured', color: '#999', bgColor: '#f5f5f5' };
  };

  const display = getStatusDisplay();

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '4px 8px',
    borderRadius: '4px',
    backgroundColor: display.bgColor,
    fontSize: '12px',
    fontWeight: '500',
  };

  const textStyle = {
    color: display.color,
    whiteSpace: 'nowrap',
  };

  return (
    <div style={containerStyle} title={status?.message || 'Encryption status'}>
      <span style={textStyle}>{display.text}</span>
    </div>
  );
};

export default EncryptionStatus;
