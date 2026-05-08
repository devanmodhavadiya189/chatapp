const deriveSharedKey = async (privateKey, theirPublicKeyBase64) => {
  try {
    const publicKeyJwk = JSON.parse(atob(theirPublicKeyBase64));
    const theirPublicKey = await window.crypto.subtle.importKey(
      "jwk",
      publicKeyJwk,
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      false,
      []
    );

    const sharedSecret = await window.crypto.subtle.deriveKey(
      {
        name: "ECDH",
        public: theirPublicKey,
      },
      privateKey,
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );

    return sharedSecret;
  } catch (error) {
    console.error("Error deriving shared key:", error);
    throw new Error("Failed to derive shared key");
  }
};

const encrypt = async (sharedKey, plaintext) => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);

    const iv = window.crypto.getRandomValues(new Uint8Array(16));

    const ciphertext = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      sharedKey,
      data
    );

    const ivBase64 = btoa(String.fromCharCode.apply(null, iv));
    const ciphertextBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(ciphertext)));

    return {
      iv: ivBase64,
      ciphertext: ciphertextBase64,
    };
  } catch (error) {
    console.error("Error encrypting message:", error);
    throw new Error("Failed to encrypt message");
  }
};

const decrypt = async (sharedKey, ivBase64, ciphertextBase64) => {
  try {
    const binaryString = atob(ivBase64);
    const iv = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      iv[i] = binaryString.charCodeAt(i);
    }

    const ciphertextBinaryString = atob(ciphertextBase64);
    const ciphertext = new Uint8Array(ciphertextBinaryString.length);
    for (let i = 0; i < ciphertextBinaryString.length; i++) {
      ciphertext[i] = ciphertextBinaryString.charCodeAt(i);
    }

    const plaintext = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      sharedKey,
      ciphertext
    );

    const decoder = new TextDecoder();
    return decoder.decode(plaintext);
  } catch (error) {
    console.error("Error decrypting message:", error);
    throw new Error("Failed to decrypt message");
  }
};

export { deriveSharedKey, encrypt, decrypt };
