import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

const Home = () => {
  const features = [
    {
      icon: '🔒',
      title: 'Advanced Encryption',
      description: 'AES-256 encryption ensures your secrets are securely hidden within images using state-of-the-art cryptographic algorithms.',
    },
    {
      icon: '🖼️',
      title: 'Multiple Algorithms',
      description: 'Choose from LSB, PVD, or DWT steganography methods depending on your security and capacity needs.',
    },
    {
      icon: '🎯',
      title: 'Educational Content',
      description: 'Learn about the history and science of steganography through our comprehensive educational modules.',
    },
    {
      icon: '🤖',
      title: 'AI Assistant',
      description: 'Get help and answers about steganography from our global AI chatbot available 24/7.',
    },
    {
      icon: '📊',
      title: 'Quiz System',
      description: 'Test your knowledge and earn achievements as you progress through our learning modules.',
    },
    {
      icon: '📱',
      title: 'Cross-Platform',
      description: 'Access Crypto Image from any device with our responsive design and seamless experience.',
    },
  ]

  const stats = [
    { value: '3', label: 'Algorithms' },
    { value: '256-bit', label: 'Encryption' },
    { value: '50+', label: 'Lessons' },
    { value: '24/7', label: 'AI Support' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-crypto-accent/10 rounded-full text-crypto-accent text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-crypto-success rounded-full animate-pulse" />
              Secure Steganography Platform
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Hide Your Secrets</span>
              <br />
              <span className="text-white">In Plain Sight</span>
            </h1>
            
            <p className="text-xl text-crypto-text-secondary max-w-3xl mx-auto mb-10">
              Crypto Image is an advanced steganography platform that enables you to hide secret messages 
              within images using cutting-edge encryption and steganography algorithms.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/encrypt">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Start Encrypting
                  <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
              <Link to="/education">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-crypto-dark via-transparent to-transparent z-10" />
            <div className="relative bg-crypto-bg-secondary/50 backdrop-blur-xl rounded-3xl p-8 border border-crypto-accent/20 max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                    <div className="text-crypto-text-secondary text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-crypto-text-secondary max-w-2xl mx-auto">
              Everything you need to securely hide and retrieve secret messages within images
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className="h-full">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-crypto-text-secondary">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-crypto-bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-crypto-text-secondary max-w-2xl mx-auto">
              Three simple steps to securely hide your message
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Upload Image', description: 'Choose any image to serve as your carrier file' },
              { step: '02', title: 'Enter Message', description: 'Type your secret message and set a secure password' },
              { step: '03', title: 'Encrypt & Download', description: 'Get your steganographic image with hidden data' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                <Card className="text-center h-full">
                  <div className="text-6xl font-bold gradient-text mb-4 opacity-20">{item.step}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-crypto-text-secondary">{item.description}</p>
                </Card>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <svg className="w-8 h-8 text-crypto-accent/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/encrypt">
              <Button variant="primary" size="lg">
                Try It Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-crypto-accent/20 to-crypto-secondary/20 rounded-3xl blur-xl" />
            <Card className="relative text-center py-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Start Hiding Secrets?
              </h2>
              <p className="text-crypto-text-secondary mb-8 max-w-xl mx-auto">
                Join thousands of users who trust Crypto Image for their steganography needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/encrypt">
                  <Button variant="primary" size="lg">Get Started Free</Button>
                </Link>
                <Link to="/auth">
                  <Button variant="secondary" size="lg">Create Account</Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
