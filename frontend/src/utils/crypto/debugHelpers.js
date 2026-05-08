import { getPrivateKey, hasPrivateKey, clearKeys } from './keyManagement';
import { getSharedKey, invalidateSharedKey, invalidateAllSharedKeysFor } from './sharedKeyCache';
import { getOrCreateKeyPair, generateKeyPair } from './keyManagement';

const e2eDebug = {
  getKeys: async (userId) => {
    const hasPrivate = hasPrivateKey(userId);
    const privateKeyStr = hasPrivate ? 'Present in localStorage' : 'Not found';
    
    const sharedKeysStr = localStorage.getItem(`shared_keys_${userId}`);
    const sharedKeyData = sharedKeysStr ? JSON.parse(sharedKeysStr) : {};
    
    return {
      userId,
      hasPrivateKey: hasPrivate,
      privateKey: privateKeyStr,
      sharedKeysMetadata: Object.keys(sharedKeyData).map(theirId => ({
        theirUserId: theirId,
        cachedInMemory: !!getSharedKey(userId, theirId),
        metadataInStorage: !!sharedKeyData[theirId]
      }))
    };
  },

  clearAllKeys: (userId) => {
    clearKeys(userId);
    return { message: `All encryption keys cleared for user ${userId}` };
  },

  getSharedKeyWith: (userId, theirId) => {
    const sharedKey = getSharedKey(userId, theirId);
    return {
      userId,
      theirId,
      sharedKeyExists: !!sharedKey,
      sharedKeyType: sharedKey ? sharedKey.type : null
    };
  },

  forceKeyRegeneration: async (userId) => {
    try {
      clearKeys(userId);
      await generateKeyPair(userId);
      return { message: `Key pair regenerated for user ${userId}`, success: true };
    } catch (error) {
      return { message: `Key regeneration failed: ${error.message}`, success: false };
    }
  },

  invalidateSharedKey: (userId, theirId) => {
    invalidateSharedKey(userId, theirId);
    return { message: `Shared key invalidated between ${userId} and ${theirId}` };
  },

  invalidateAllSharedKeys: (userId) => {
    invalidateAllSharedKeysFor(userId);
    return { message: `All shared keys invalidated for user ${userId}` };
  }
};

if (typeof window !== 'undefined') {
  window.e2eDebug = e2eDebug;
}

export default e2eDebug;
