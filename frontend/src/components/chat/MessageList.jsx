import MessageBubble from '../MessageBubble';

export default function MessageList({ messages, user, activeUser, messagesEndRef }) {
  if (messages.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-themed-tertiary" style={{ color: 'var(--text-tertiary)' }}>No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <>
      {messages.map((message, index) => (
        <MessageBubble
          key={message._id || index}
          message={message}
          isOwnMessage={message.senderid === user?._id}
          senderName={message.senderid === user?._id ? user.fullname : activeUser?.fullname}
        />
      ))}
      <div ref={messagesEndRef} />
    </>
  );
}
