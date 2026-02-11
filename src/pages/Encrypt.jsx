import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import { useEncryptionStore } from '../store/themeStore'
import { encryptMessage } from '../lib/steganography'

const Encrypt = () => {
  const {
    currentAlgorithm,
    setAlgorithm,
    selectedImage,
    secretMessage,
    password,
    isProcessing,
    resultImage,
    setSelectedImage,
    setSecretMessage,
    setPassword,
    setIsProcessing,
    setResultImage,
    addToHistory,
    reset,
  } = useEncryptionStore()

  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)

  const handleImageUpload = useCallback((file) => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setSelectedImage({
        file,
        preview: e.target.result,
        name: file.name,
        size: file.size,
      })
      setError('')
    }
    reader.readAsDataURL(file)
  }, [setSelectedImage])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0])
    }
  }, [handleImageUpload])

  const handleEncrypt = async () => {
    if (!selectedImage) {
      setError('Please select an image first')
      return
    }
    if (!secretMessage.trim()) {
      setError('Please enter a secret message')
      return
    }
    if (!password.trim()) {
      setError('Please enter a password')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      const result = await encryptMessage(
        selectedImage.preview,
        secretMessage,
        password,
        currentAlgorithm
      )

      setResultImage(result)
      addToHistory({
        type: 'encrypt',
        algorithm: currentAlgorithm,
        originalSize: selectedImage.size,
        timestamp: new Date().toISOString(),
        status: 'success',
      })
    } catch (err) {
      setError(err.message || 'Encryption failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadImage = () => {
    if (!resultImage) return

    const link = document.createElement('a')
    link.href = resultImage
    link.download = `encrypted_${selectedImage.name}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const algorithms = [
    { id: 'lsb', name: 'LSB', description: 'Basic', capacity: '25%', security: 'Basic' },
    { id: 'pvd', name: 'PVD', description: 'Medium', capacity: '15-20%', security: 'Medium' },
    { id: 'dwt', name: 'DWT', description: 'High', capacity: '10-15%', security: 'High' },
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold gradient-text mb-4">Encrypt Message</h1>
          <p className="text-crypto-text-secondary max-w-2xl mx-auto">
            Hide your secret message within an image using advanced steganography algorithms
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <h2 className="text-xl font-semibold text-white mb-6">1. Select Algorithm</h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {algorithms.map((algo) => (
                  <button
                    key={algo.id}
                    onClick={() => setAlgorithm(algo.id)}
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      currentAlgorithm === algo.id
                        ? 'border-crypto-accent bg-crypto-accent/10'
                        : 'border-crypto-accent/20 hover:border-crypto-accent/40'
                    }`}
                  >
                    <div className="text-lg font-semibold text-white">{algo.name}</div>
                    <div className="text-xs text-crypto-text-secondary">{algo.description}</div>
                    <div className="text-xs text-crypto-accent mt-1">Cap: {algo.capacity}</div>
                  </button>
                ))}
              </div>

              <h2 className="text-xl font-semibold text-white mb-6">2. Upload Image</h2>
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  dragActive
                    ? 'border-crypto-accent bg-crypto-accent/10'
                    : 'border-crypto-accent/30 hover:border-crypto-accent/50'
                }`}
                onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true) }}
                onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false) }}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
                onDrop={handleDrop}
              >
                {selectedImage ? (
                  <div className="relative">
                    <img
                      src={selectedImage.preview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <div className="mt-4">
                      <p className="text-white font-medium">{selectedImage.name}</p>
                      <p className="text-crypto-text-secondary text-sm">
                        {(selectedImage.size / 1024).toFixed(2)} KB
                      </p>
                      <button
                        onClick={() => setSelectedImage(null)}
                        className="text-crypto-error text-sm mt-2 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-8">
                    <svg className="mx-auto h-12 w-12 text-crypto-accent mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-white mb-2">Drag and drop an image here</p>
                    <p className="text-crypto-text-secondary text-sm mb-4">or</p>
                    <label className="cursor-pointer">
                      <span className="text-crypto-accent hover:underline">Browse files</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e.target.files[0])}
                      />
                    </label>
                  </div>
                )}
              </div>

              <h2 className="text-xl font-semibold text-white mb-6 mt-6">3. Enter Secret Message</h2>
              <textarea
                value={secretMessage}
                onChange={(e) => setSecretMessage(e.target.value)}
                placeholder="Enter your secret message here..."
                className="w-full h-32 px-4 py-3 bg-crypto-bg-tertiary border border-crypto-accent/20 rounded-lg text-crypto-text-primary placeholder-crypto-text-secondary/50 focus:outline-none focus:border-crypto-accent focus:ring-2 focus:ring-crypto-accent/20 transition-all duration-300 resize-none"
              />

              <h2 className="text-xl font-semibold text-white mb-6 mt-6">4. Set Password</h2>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter encryption password"
              />

              {error && (
                <div className="mt-4 p-3 bg-crypto-error/10 border border-crypto-error/30 rounded-lg text-crypto-error text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  onClick={handleEncrypt}
                  loading={isProcessing}
                  disabled={!selectedImage || !secretMessage || !password}
                >
                  {isProcessing ? 'Encrypting...' : 'Encrypt Message'}
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={reset}
                >
                  Reset
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Right Column - Result */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="sticky top-24">
              <h2 className="text-xl font-semibold text-white mb-6">Result</h2>
              
              {resultImage ? (
                <div>
                  <div className="relative mb-4">
                    <img
                      src={resultImage}
                      alt="Encrypted"
                      className="w-full rounded-lg"
                    />
                    <div className="absolute top-2 right-2 bg-crypto-success text-crypto-dark px-2 py-1 rounded text-xs font-medium">
                      Encrypted
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="primary" className="flex-1" onClick={downloadImage}>
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Image
                    </Button>
                  </div>
                  <p className="text-crypto-text-secondary text-sm mt-4 text-center">
                    Your encrypted image is ready. Share it with your recipient!
                  </p>
                </div>
              ) : (
                <div className="py-16 text-center">
                  <svg className="mx-auto h-16 w-16 text-crypto-accent/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <p className="text-crypto-text-secondary">
                    Your encrypted image will appear here
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Encrypt
