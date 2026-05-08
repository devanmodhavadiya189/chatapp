const sharedKeysInMemory = {};

const setSharedKey = (myUserId, theirUserId, sharedKey) => {
  const key = `${myUserId}_${theirUserId}`;
  sharedKeysInMemory[key] = sharedKey;

  const metadata = `e2e_shared_${myUserId}_${theirUserId}`;
  localStorage.setItem(metadata, JSON.stringify({ established: true, timestamp: Date.now() }));
};

const getSharedKey = (myUserId, theirUserId) => {
  const key = `${myUserId}_${theirUserId}`;
  return sharedKeysInMemory[key] || null;
};

const invalidateSharedKey = (myUserId, theirUserId) => {
  const key = `${myUserId}_${theirUserId}`;
  delete sharedKeysInMemory[key];

  const metadata = `e2e_shared_${myUserId}_${theirUserId}`;
  localStorage.removeItem(metadata);
};

const invalidateAllSharedKeysFor = (myUserId) => {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const storageKey = localStorage.key(i);
    if (storageKey && storageKey.startsWith(`e2e_shared_${myUserId}_`)) {
      keysToRemove.push(storageKey);
    }
  }

  keysToRemove.forEach((storageKey) => {
    localStorage.removeItem(storageKey);
  });

  const memoryKeysToRemove = [];
  for (const memKey in sharedKeysInMemory) {
    if (memKey.startsWith(`${myUserId}_`)) {
      memoryKeysToRemove.push(memKey);
    }
  }

  memoryKeysToRemove.forEach((memKey) => {
    delete sharedKeysInMemory[memKey];
  });
};

const getKeyExchangeStatus = (myUserId, theirUserId) => {
  const memKey = `${myUserId}_${theirUserId}`;
  const storageKey = `e2e_shared_${myUserId}_${theirUserId}`;
  const hasMemoryKey = sharedKeysInMemory[memKey] !== undefined;
  const hasStorageKey = localStorage.getItem(storageKey) !== null;

  if (hasMemoryKey) {
    return { status: "ready", message: "Encrypted channel established" };
  }

  if (hasStorageKey) {
    return { status: "checking", message: "Deriving shared key..." };
  }

  return { status: "unavailable", message: "Public key not received yet" };
};

const sharedKeyExists = (myUserId, theirUserId) => {
  const storageKey = `e2e_shared_${myUserId}_${theirUserId}`;
  return localStorage.getItem(storageKey) !== null;
};

export {
  setSharedKey,
  getSharedKey,
  invalidateSharedKey,
  invalidateAllSharedKeysFor,
  getKeyExchangeStatus,
  sharedKeyExists,
};
