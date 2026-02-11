import CryptoJS from 'crypto-js'

const SALT_LENGTH = 16
const IV_LENGTH = 16
const KEY_ITERATIONS = 100000
const KEY_LENGTH = 256

export const generateSalt = () => {
  return CryptoJS.lib.WordArray.random(SALT_LENGTH).toString()
}

export const generateIV = () => {
  return CryptoJS.lib.WordArray.random(IV_LENGTH).toString()
}

export const deriveKey = (password, salt) => {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: KEY_LENGTH / 32,
    iterations: KEY_ITERATIONS,
    hasher: CryptoJS.algo.SHA256,
  })
}

export const encrypt = (plaintext, password) => {
  try {
    const salt = generateSalt()
    const iv = generateIV()
    const key = deriveKey(password, salt)

    const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })

    const checksum = CryptoJS.SHA256(plaintext).toString()

    const result = {
      ciphertext: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
      salt,
      iv,
      checksum,
    }

    return JSON.stringify(result)
  } catch (error) {
    throw new Error('Encryption failed: ' + error.message)
  }
}

export const decrypt = (encryptedData, password) => {
  try {
    const data = JSON.parse(encryptedData)

    if (!data.ciphertext || !data.salt || !data.iv || !data.checksum) {
      throw new Error('Invalid encrypted data format')
    }

    const key = deriveKey(password, data.salt)

    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(data.ciphertext),
    })

    const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
      iv: CryptoJS.enc.Hex.parse(data.iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })

    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8)

    if (!decryptedString) {
      throw new Error('Decryption failed - wrong password or corrupted data')
    }

    const checksum = CryptoJS.SHA256(decryptedString).toString()

    if (checksum !== data.checksum) {
      throw new Error('Data integrity check failed - data may be corrupted')
    }

    return decryptedString
  } catch (error) {
    if (error.message.includes('wrong password') || error.message.includes('Invalid encrypted data')) {
      throw new Error('Invalid password or corrupted data')
    }
    throw error
  }
}

export const generateChecksum = (data) => {
  return CryptoJS.SHA256(data).toString()
}

export const verifyChecksum = (data, checksum) => {
  return generateChecksum(data) === checksum
}
