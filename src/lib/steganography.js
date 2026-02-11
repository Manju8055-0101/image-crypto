import { encrypt, decrypt } from './encryption'

const METADATA_SEPARATOR = '|||META|||'
const MESSAGE_SEPARATOR = '|||MSG|||'

const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

const getImageData = (canvas, ctx, img) => {
  canvas.width = img.width
  canvas.height = img.height
  ctx.drawImage(img, 0, 0)
  return ctx.getImageData(0, 0, img.width, img.height)
}

const putImageData = (canvas, ctx, imageData) => {
  canvas.width = imageData.width
  canvas.height = imageData.height
  ctx.putImageData(imageData, 0, 0)
}

const textToBinary = (text) => {
  let binary = ''
  for (let i = 0; i < text.length; i++) {
    const bin = text.charCodeAt(i).toString(2).padStart(8, '0')
    binary += bin
  }
  return binary
}

const binaryToText = (binary) => {
  let text = ''
  for (let i = 0; i < binary.length; i += 8) {
    const bin = binary.slice(i, i + 8)
    if (bin.length === 8) {
      text += String.fromCharCode(parseInt(bin, 2))
    }
  }
  return text
}

const binaryToArray = (binary) => {
  return binary.split('').map(Number)
}

const arrayToBinary = (arr) => {
  return arr.join('')
}

const lsbEmbed = (imageData, binaryData) => {
  const data = imageData.data
  const binaryArray = binaryToArray(binaryData)
  
  if (binaryArray.length > data.length / 4) {
    throw new Error('Message too large for selected image. Try a larger image or shorter message.')
  }

  let bitIndex = 0
  for (let i = 0; i < data.length && bitIndex < binaryArray.length; i += 4) {
    for (let j = 0; j < 3 && bitIndex < binaryArray.length; j++) {
      data[i + j] = (data[i + j] & 0xFE) | binaryArray[bitIndex]
      bitIndex++
    }
  }

  return imageData
}

const lsbExtract = (imageData, bitLength) => {
  const data = imageData.data
  let binary = ''
  let bitIndex = 0

  for (let i = 0; i < data.length && bitIndex < bitLength; i += 4) {
    for (let j = 0; j < 3 && bitIndex < bitLength; j++) {
      binary += (data[i + j] & 1).toString()
      bitIndex++
    }
  }

  return binary
}

const pvdEmbed = (imageData, binaryData) => {
  const data = imageData.data
  const binaryArray = binaryToArray(binaryData)
  
  if (binaryArray.length > data.length / 4 * 1.5) {
    throw new Error('Message too large for selected image.')
  }

  let bitIndex = 0
  for (let i = 0; i < data.length - 4 && bitIndex < binaryArray.length; i += 4) {
    const r1 = data[i]
    const g1 = data[i + 1]
    const b1 = data[i + 2]
    
    if (bitIndex >= binaryArray.length) break
    
    const diff = Math.abs(r1 - g1) + Math.abs(g1 - b1) + Math.abs(b1 - r1)
    
    if (diff < 50) {
      if (bitIndex < binaryArray.length) {
        const newVal = (data[i] & 0xFE) | binaryArray[bitIndex]
        data[i] = newVal
        bitIndex++
      }
      if (bitIndex < binaryArray.length) {
        const newVal = (data[i + 1] & 0xFE) | binaryArray[bitIndex]
        data[i + 1] = newVal
        bitIndex++
      }
      if (bitIndex < binaryArray.length) {
        const newVal = (data[i + 2] & 0xFE) | binaryArray[bitIndex]
        data[i + 2] = newVal
        bitIndex++
      }
    }
  }

  return imageData
}

const pvdExtract = (imageData, bitLength) => {
  const data = imageData.data
  let binary = ''
  let bitIndex = 0

  for (let i = 0; i < data.length - 4 && bitIndex < bitLength; i += 4) {
    const r1 = data[i]
    const g1 = data[i + 1]
    const b1 = data[i + 2]
    
    const diff = Math.abs(r1 - g1) + Math.abs(g1 - b1) + Math.abs(b1 - r1)
    
    if (diff < 50) {
      if (bitIndex < bitLength) {
        binary += (data[i] & 1).toString()
        bitIndex++
      }
      if (bitIndex < bitLength) {
        binary += (data[i + 1] & 1).toString()
        bitIndex++
      }
      if (bitIndex < bitLength) {
        binary += (data[i + 2] & 1).toString()
        bitIndex++
      }
    }
  }

  return binary
}

const dwtEmbed = (imageData, binaryData) => {
  const data = imageData.data
  const width = imageData.width
  const height = imageData.height
  
  if (binaryArray.length > data.length / 8) {
    throw new Error('Message too large for selected image.')
  }

  const binaryArray = binaryToArray(binaryData)
  let bitIndex = 0

  for (let y = 0; y < height && bitIndex < binaryArray.length; y += 2) {
    for (let x = 0; x < width && bitIndex < binaryArray.length; x += 2) {
      const idx = (y * width + x) * 4
      const idx2 = (y * width + x + 1) * 4
      const idx3 = ((y + 1) * width + x) * 4

      if (idx < data.length && idx2 < data.length && idx3 < data.length) {
        for (let j = 0; j < 3 && bitIndex < binaryArray.length; j++) {
          const avg = Math.floor((data[idx + j] + data[idx2 + j] + data[idx3 + j] + 
            (data[idx + 4] || data[idx + j])) / 4)
          data[idx + j] = (avg & 0xFE) | binaryArray[bitIndex]
          bitIndex++
        }
      }
    }
  }

  return imageData
}

const dwtExtract = (imageData, bitLength) => {
  const data = imageData.data
  const width = imageData.width
  const height = imageData.height
  
  let binary = ''
  let bitIndex = 0

  for (let y = 0; y < height && bitIndex < bitLength; y += 2) {
    for (let x = 0; x < width && bitIndex < bitLength; x += 2) {
      const idx = (y * width + x) * 4
      
      if (idx < data.length) {
        for (let j = 0; j < 3 && bitIndex < bitLength; j++) {
          binary += (data[idx + j] & 1).toString()
          bitIndex++
        }
      }
    }
  }

  return binary
}

export const encryptMessage = async (imageSrc, message, password, algorithm = 'lsb') => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = await loadImage(imageSrc)
  const imageData = getImageData(canvas, ctx, img)

  const encryptedMessage = encrypt(message, password)
  const metadata = JSON.stringify({
    algorithm,
    originalLength: message.length,
    encryptedLength: encryptedMessage.length,
  })
  
  const fullData = metadata + METADATA_SEPARATOR + encryptedMessage + MESSAGE_SEPARATOR + message.length
  const binaryData = textToBinary(fullData)

  let modifiedImageData
  switch (algorithm) {
    case 'lsb':
      modifiedImageData = lsbEmbed(imageData, binaryData)
      break
    case 'pvd':
      modifiedImageData = pvdEmbed(imageData, binaryData)
      break
    case 'dwt':
      modifiedImageData = dwtEmbed(imageData, binaryData)
      break
    default:
      modifiedImageData = lsbEmbed(imageData, binaryData)
  }

  putImageData(canvas, ctx, modifiedImageData)

  return canvas.toDataURL('image/png', 1.0)
}

export const decryptMessage = async (imageSrc, password) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = await loadImage(imageSrc)
  const imageData = getImageData(canvas, ctx, img)

  const totalBinaryLength = 8 * (JSON.stringify({ algorithm: 'lsb', originalLength: 0, encryptedLength: 0 }).length + 
    METADATA_SEPARATOR.length + 500 + MESSAGE_SEPARATOR.length + 10)

  let binaryData
  switch (img.src.includes('algorithm=pvd') ? 'pvd' : 'lsb') {
    case 'lsb':
      binaryData = lsbExtract(imageData, totalBinaryLength)
      break
    case 'pvd':
      binaryData = pvdExtract(imageData, totalBinaryLength)
      break
    case 'dwt':
      binaryData = dwtExtract(imageData, totalBinaryLength)
      break
    default:
      binaryData = lsbExtract(imageData, totalBinaryLength)
  }

  const fullText = binaryToText(binaryData)
  
  const metaEnd = fullText.indexOf(METADATA_SEPARATOR)
  const msgEnd = fullText.indexOf(MESSAGE_SEPARATOR)

  if (metaEnd === -1 || msgEnd === -1) {
    return { success: false, message: 'No hidden message found in this image' }
  }

  try {
    const metadata = JSON.parse(fullText.slice(0, metaEnd))
    const encryptedData = fullText.slice(metaEnd + METADATA_SEPARATOR.length, msgEnd)
    const originalLength = parseInt(fullText.slice(msgEnd + MESSAGE_SEPARATOR.length))

    const decryptedMessage = decrypt(encryptedData, password)
    
    return { success: true, message: decryptedMessage, metadata }
  } catch (error) {
    return { success: false, message: error.message || 'Failed to decrypt message' }
  }
}

export const calculateCapacity = (width, height, algorithm = 'lsb') => {
  const totalPixels = width * height
  const bytesPerPixel = 3
  
  switch (algorithm) {
    case 'lsb':
      return Math.floor(totalPixels * bytesPerPixel * 0.25)
    case 'pvd':
      return Math.floor(totalPixels * bytesPerPixel * 0.18)
    case 'dwt':
      return Math.floor(totalPixels * bytesPerPixel * 0.12)
    default:
      return Math.floor(totalPixels * bytesPerPixel * 0.25)
  }
}
