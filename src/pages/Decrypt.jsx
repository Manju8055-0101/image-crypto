import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import { useEncryptionStore } from '../store/themeStore'
import { decryptMessage } from '../lib/steganography'

const Decrypt = () => {
  const {
    selectedImage,
    password,
    isProcessing,
    decryptedMessage,
    setSelectedImage,
    setPassword,
    setIsProcessing,
    setDecryptedMessage,
    addToHistory,
    reset,
  } = useEncryptionStore()

  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

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
      setIsSuccess(false)
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

  const handleDecrypt = async () => {
    if (!selectedImage) {
      setError('Please select an encrypted image first')
      return
    }
    if (!password.trim()) {
      setError('Please enter the password')
      return
    }

    setIsProcessing(true)
    setError('')
    setIsSuccess(false)

    try {
      const result = await decryptMessage(selectedImage.preview, password)
      
      setDecryptedMessage(result.message)
      setIsSuccess(result.success)
      
      if (result.success) {
        addToHistory({
          type: 'decrypt',
          originalSize: selectedImage.size,
          timestamp: new Date().toISOString(),
          status: 'success',
        })
      } else {
        setError(result.message || 'Decryption failed. Wrong password or invalid image.')
      }
    } catch (err) {
      setError(err.message || 'Decryption failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(decryptedMessage)
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold gradient-text mb-4">Decrypt Message</h1>
          <p className="text-crypto-text-secondary max-w-2xl mx-auto">
            Extract hidden secret messages from encrypted images
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
              <h2 className="text-xl font-semibold text-white mb-6">1. Upload Encrypted Image</h2>
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
                    <p className="text-white mb-2">Drag and drop an encrypted image here</p>
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

              <h2 className="text-xl font-semibold text-white mb-6 mt-6">2. Enter Password</h2>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter decryption password"
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
                  onClick={handleDecrypt}
                  loading={isProcessing}
                  disabled={!selectedImage || !password}
                >
                  {isProcessing ? 'Decrypting...' : 'Decrypt Message'}
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
              <h2 className="text-xl font-semibold text-white mb-6">Decrypted Message</h2>
              
              {isSuccess ? (
                <div>
                  <div className="p-4 bg-crypto-success/10 border border-crypto-success/30 rounded-lg mb-4">
                    <div className="flex items-center gap-2 text-crypto-success mb-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">Message Decrypted Successfully!</span>
                    </div>
                  </div>
                  <div className="bg-crypto-bg-tertiary rounded-lg p-4 mb-4 max-h-64 overflow-auto">
                    <p className="text-white whitespace-pre-wrap">{decryptedMessage}</p>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="primary" className="flex-1" onClick={copyToClipboard}>
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy to Clipboard
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center">
                  <svg className="mx-auto h-16 w-16 text-crypto-accent/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="text-crypto-text-secondary">
                    Your decrypted message will appear here
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

export default Decrypt
