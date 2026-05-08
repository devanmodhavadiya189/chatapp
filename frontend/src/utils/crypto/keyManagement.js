const generateKeyPair = async (userId) => {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    ["deriveKey"]
  );

  const privateKeyJwk = await window.crypto.subtle.exportKey("jwk", keyPair.privateKey);
  const publicKeyJwk = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey);

  const privateKeyBase64 = btoa(JSON.stringify(privateKeyJwk));
  const publicKeyBase64 = btoa(JSON.stringify(publicKeyJwk));

  localStorage.setItem(`e2e_private_${userId}`, privateKeyBase64);

  return {
    privateKey: keyPair.privateKey,
    publicKeyBase64: publicKeyBase64,
  };
};

const getOrCreateKeyPair = async (userId) => {
  const privateKeyBase64 = localStorage.getItem(`e2e_private_${userId}`);

  if (privateKeyBase64) {
    const privateKeyJwk = JSON.parse(atob(privateKeyBase64));
    const privateKey = await window.crypto.subtle.importKey(
      "jwk",
      privateKeyJwk,
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      ["deriveKey"]
    );

    const publicKeyJwk = { ...privateKeyJwk };
    delete publicKeyJwk.d;
    const publicKeyBase64 = btoa(JSON.stringify(publicKeyJwk));

    return {
      privateKey: privateKey,
      publicKeyBase64: publicKeyBase64,
    };
  }

  return await generateKeyPair(userId);
};

const getPrivateKey = async (userId) => {
  const privateKeyBase64 = localStorage.getItem(`e2e_private_${userId}`);

  if (!privateKeyBase64) {
    return null;
  }

  try {
    const privateKeyJwk = JSON.parse(atob(privateKeyBase64));
    const privateKey = await window.crypto.subtle.importKey(
      "jwk",
      privateKeyJwk,
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      ["deriveKey"]
    );
    return privateKey;
  } catch (error) {
    console.error("Error importing private key:", error);
    return null;
  }
};

const hasPrivateKey = (userId) => {
  return localStorage.getItem(`e2e_private_${userId}`) !== null;
};

const clearKeys = (userId) => {
  localStorage.removeItem(`e2e_private_${userId}`);

  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(`e2e_shared_${userId}_`)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => {
    localStorage.removeItem(key);
  });
};

export { generateKeyPair, getOrCreateKeyPair, getPrivateKey, hasPrivateKey, clearKeys };
