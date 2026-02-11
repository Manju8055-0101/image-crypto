import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { useChatbotStore } from '../store/themeStore'

const Chatbot = () => {
  const { messages, isTyping, addMessage, setIsTyping, clearMessages } = useChatbotStore()
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickQuestions = [
    'What is steganography?',
    'How does LSB work?',
    'Is steganography legal?',
    'Best practices for security',
    'How to hide messages in images',
    'Difference between encryption and steganography',
  ]

  const generateResponse = (question) => {
    const responses = {
      'what is steganography': 'Steganography is the practice of hiding secret information within ordinary, non-secret files or messages to avoid detection. Unlike encryption, which makes data unreadable but visible, steganography hides the very existence of the data.',
      'how does lsb work': 'LSB (Least Significant Bit) steganography works by replacing the last bit of each pixel\'s color value with message bits. Since changing the LSB has minimal impact on the color, the change is visually imperceptible.',
      'is steganography legal': 'Steganography itself is a neutral technology and is legal in most countries. However, its legality depends on how it\'s used. Legitimate uses include digital watermarking and secure communications. Illegal uses include concealing evidence or coordinating illegal activities.',
      'best practices for security': 'For maximum security: 1) Always encrypt your message before embedding, 2) Use strong passwords with PBKDF2, 3) Choose appropriate algorithms based on your needs, 4) Limit embedding capacity to avoid detection, 5) Use lossless image formats like PNG.',
      'how to hide messages in images': 'To hide messages in images: 1) Choose a suitable image (high resolution, PNG format), 2) Select an algorithm (LSB for capacity, DWT for security), 3) Write or encrypt your message, 4) Use Crypto Image to embed the message, 5) Share the resulting image securely.',
      'difference between encryption and steganography': 'Encryption scrambles data so it can\'t be read without a key, but the encrypted data is visible. Steganography hides the existence of data entirely. Using both together (encrypt then hide) provides maximum security.',
    }

    const lowercaseQuestion = question.toLowerCase()
    for (const [key, response] of Object.entries(responses)) {
      if (lowercaseQuestion.includes(key)) {
        return response
      }
    }

    return `That's a great question about "${question}". Steganography is a fascinating field that combines cryptography, data science, and creative problem-solving. Would you like me to explain more about specific techniques or applications?`
  }

  const handleSend = () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue,
      timestamp: new Date().toISOString(),
    }

    addMessage(userMessage)
    setInputValue('')
    setIsTyping(true)

    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        text: generateResponse(userMessage.text),
        timestamp: new Date().toISOString(),
      }
      addMessage(aiResponse)
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-4">AI Assistant</h1>
          <p className="text-crypto-text-secondary max-w-2xl mx-auto">
            Ask our AI chatbot anything about steganography, encryption, or security
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Quick Questions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="h-fit">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Questions</h3>
              <div className="space-y-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInputValue(question)
                      document.getElementById('chat-input').focus()
                    }}
                    className="w-full text-left p-3 rounded-lg bg-crypto-bg-tertiary text-crypto-text-secondary text-sm hover:bg-crypto-accent/10 hover:text-crypto-accent transition-all duration-300"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Chat Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-3"
          >
            <Card className="h-[600px] flex flex-col">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-4">🤖</div>
                        <h3 className="text-xl font-semibold text-white mb-2">How can I help you?</h3>
                        <p className="text-crypto-text-secondary">
                          Ask me anything about steganography or encryption
                        </p>
                      </div>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-crypto-accent to-crypto-secondary text-crypto-dark'
                            : 'bg-crypto-bg-tertiary text-white'
                        } rounded-2xl p-4`}>
                          <p className="text-sm leading-relaxed">{message.text}</p>
                          <span className={`text-xs mt-1 block ${
                            message.type === 'user' ? 'text-crypto-dark/70' : 'text-crypto-text-secondary'
                          }`}>
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-crypto-bg-tertiary rounded-2xl p-4">
                      <div className="flex gap-2">
                        <span className="w-2 h-2 bg-crypto-accent rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-crypto-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <span className="w-2 h-2 bg-crypto-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-crypto-accent/10 pt-4">
                <div className="flex gap-4">
                  <input
                    id="chat-input"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 bg-crypto-bg-tertiary border border-crypto-accent/20 rounded-xl text-white placeholder-crypto-text-secondary/50 focus:outline-none focus:border-crypto-accent focus:ring-2 focus:ring-crypto-accent/20"
                  />
                  <Button
                    variant="primary"
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isTyping}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </Button>
                </div>
                {messages.length > 0 && (
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={clearMessages}
                      className="text-crypto-text-secondary text-sm hover:text-crypto-accent transition-colors"
                    >
                      Clear Conversation
                    </button>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Chatbot
