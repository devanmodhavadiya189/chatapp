import { createContext, useContext, useReducer, useEffect } from 'react';
import { api } from '../lib/api';
import { getOrCreateKeyPair, clearKeys, hasPrivateKey } from '../utils/crypto/keyManagement';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload, loading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_KEY_PUBLISHED':
      return { ...state, keyPublished: action.payload };
    case 'SET_KEY_REGENERATED':
      return { ...state, keyWasRegenerated: action.payload };
    case 'LOGOUT':
      return { user: null, isAuthenticated: false, loading: false, error: null, keyPublished: false, keyWasRegenerated: false };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  keyPublished: false,
  keyWasRegenerated: false,
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const handleKeyGeneration = async (user) => {
    try {
      if (!user || !user._id) return;

      const hadPrivateKey = hasPrivateKey(user._id);
      const serverHasPublicKey = user.publicKey != null;
      const keyWasLost = serverHasPublicKey && !hadPrivateKey;

      if (keyWasLost) {
        clearKeys(user._id);
        dispatch({ type: 'SET_KEY_REGENERATED', payload: true });
      }

      const { publicKeyBase64 } = await getOrCreateKeyPair(user._id);
      await api.publishKey(publicKeyBase64);
      dispatch({ type: 'SET_KEY_PUBLISHED', payload: true });
    } catch (error) {
      console.error("Error during key generation/publication:", error);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const user = await api.checkAuth();
      dispatch({ type: 'SET_USER', payload: user });
      await handleKeyGeneration(user);
    } catch (error) {
      dispatch({ type: 'SET_USER', payload: null });
    }
  };

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const user = await api.login(email, password);
      dispatch({ type: 'SET_USER', payload: user });
      await handleKeyGeneration(user);
      
      return user;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const signup = async (fullname, email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const user = await api.signup(fullname, email, password);
      dispatch({ type: 'SET_USER', payload: user });
      await handleKeyGeneration(user);
      
      return user;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (state.user && state.user._id) {
        clearKeys(state.user._id);
      }
      await api.logout();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateProfile = async (updateData) => {
    try {
      const updatedUser = await api.updateProfile(updateData);
      dispatch({ type: 'SET_USER', payload: updatedUser });
      return updatedUser;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    signup,
    logout,
    updateProfile,
    clearError,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};