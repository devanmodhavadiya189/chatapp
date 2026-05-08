export const initialState = {
  users: [],
  activeChat: null,
  messages: [],
  loading: false,
  error: null,
  sharedKeyStatus: { ready: false, message: 'No chat selected' },
  offlineModal: { show: false, userName: '', pendingMessage: '', pendingFile: null, pendingUserId: null },
};

export const chatReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USERS':
      return { ...state, users: action.payload, loading: false };
    case 'SET_ACTIVE_CHAT':
      return { ...state, activeChat: action.payload };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload, loading: false };
    case 'ADD_MESSAGE': {
      const messageExists = state.messages.some(m => m._id === action.payload._id);
      if (messageExists) return state;
      return { 
        ...state, 
        messages: [...state.messages, action.payload]
      };
    }
    case 'REPLACE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map((msg, idx) => 
          idx === action.payload.index ? action.payload.message : msg
        )
      };
    case 'UPDATE_MESSAGES_SEEN':
      return {
        ...state,
        messages: state.messages.map(message => 
          message.senderid === action.payload.senderId && 
          message.reciverid === action.payload.receiverId
            ? { ...message, seen: true, seenAt: action.payload.seenAt }
            : message
        )
      };
    case 'UPDATE_UNSEEN_COUNTS':
      return {
        ...state,
        users: state.users.map(user => 
          user._id === action.payload.senderId
            ? { ...user, unseenCount: (user.unseenCount || 0) + 1 }
            : user
        )
      };
    case 'CLEAR_UNSEEN_COUNT':
      return {
        ...state,
        users: state.users.map(user => 
          user._id === action.payload.userId
            ? { ...user, unseenCount: 0 }
            : user
        )
      };
    case 'SET_SHARED_KEY_STATUS':
      return { ...state, sharedKeyStatus: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_OFFLINE_MODAL':
      return { ...state, offlineModal: action.payload };
    default:
      return state;
  }
};
