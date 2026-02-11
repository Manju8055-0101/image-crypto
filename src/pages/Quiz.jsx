import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { useQuizStore } from '../store/themeStore'

const Quiz = () => {
  const { totalPoints, streak, achievements, addQuizResult, addAchievement } = useQuizStore()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)

  const questions = [
    {
      question: 'What does LSB stand for in steganography?',
      options: [
        'Least Significant Bit',
        'Last Steganography Block',
        'Linear Steganography Base',
        'Low Security Buffer',
      ],
      correct: 0,
      explanation: 'LSB stands for Least Significant Bit - the rightmost bit in a binary number that has the least effect on the value.',
    },
    {
      question: 'Which steganography method provides the highest security?',
      options: ['LSB', 'PVD', 'DWT', 'All provide equal security'],
      correct: 2,
      explanation: 'DWT (Discrete Wavelet Transform) operates in the frequency domain, making it the most robust against attacks.',
    },
    {
      question: 'What is the primary purpose of steganography?',
      options: [
        'To encrypt data so it cannot be read',
        'To hide the existence of secret data',
        'To compress image files',
        'To add watermarks to images',
      ],
      correct: 1,
      explanation: 'Steganography\'s main goal is to hide the very existence of secret data, unlike encryption which makes data unreadable but visible.',
    },
    {
      question: 'What should you always do before embedding a message?',
      options: [
        'Resize the image',
        'Encrypt the message',
        'Change the file format',
        'Compress the image',
      ],
      correct: 1,
      explanation: 'Always encrypt your message before embedding for an additional layer of security.',
    },
    {
      question: 'Which algorithm typically has the highest capacity?',
      options: ['DWT', 'PVD', 'LSB', 'All have equal capacity'],
      correct: 2,
      explanation: 'LSB typically offers the highest capacity (up to 25% of image data) but with lower security.',
    },
  ]

  const handleAnswer = (index) => {
    if (showResult) return
    
    setSelectedAnswer(index)
    setShowResult(true)

    if (index === questions[currentQuestion].correct) {
      setScore(score + 1)
      addQuizResult({
        question: questions[currentQuestion].question,
        correct: true,
        points: 10,
        timestamp: new Date().toISOString(),
      })

      if (streak >= 5) {
        addAchievement({
          id: 'streak-5',
          name: 'Hot Streak!',
          description: 'Answered 5 questions correctly in a row',
          icon: '🔥',
          timestamp: new Date().toISOString(),
        })
      }
    } else {
      addQuizResult({
        question: questions[currentQuestion].question,
        correct: false,
        points: 0,
        timestamp: new Date().toISOString(),
      })
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setQuizCompleted(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setQuizCompleted(false)
    setScore(0)
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold gradient-text mb-4">Test Your Knowledge</h1>
          <p className="text-crypto-text-secondary max-w-2xl mx-auto">
            Take our interactive quiz to test your steganography knowledge
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-8">
            <div className="flex justify-around text-center">
              <div>
                <div className="text-3xl font-bold gradient-text">{totalPoints}</div>
                <div className="text-crypto-text-secondary text-sm">Total Points</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-crypto-success">{streak}</div>
                <div className="text-crypto-text-secondary text-sm">Current Streak</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-crypto-accent">{achievements.length}</div>
                <div className="text-crypto-text-secondary text-sm">Achievements</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Quiz Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <AnimatePresence mode="wait">
            {quizCompleted ? (
              <motion.div
                key="completed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="text-center py-12">
                  <div className="text-6xl mb-4">
                    {score === questions.length ? '🏆' : score >= questions.length / 2 ? '🎉' : '📚'}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h2>
                  <p className="text-crypto-text-secondary mb-6">
                    You scored {score} out of {questions.length}
                  </p>
                  <div className="text-5xl font-bold gradient-text mb-8">
                    {Math.round((score / questions.length) * 100)}%
                  </div>
                  <div className="flex justify-center gap-4">
                    <Button variant="secondary" onClick={resetQuiz}>
                      Try Again
                    </Button>
                    <Button variant="primary" onClick={() => window.location.href = '/education'}>
                      Continue Learning
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="question"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-crypto-text-secondary">
                      Question {currentQuestion + 1} of {questions.length}
                    </span>
                    <span className="text-crypto-accent font-medium">
                      {Math.round(((currentQuestion) / questions.length) * 100)}% Complete
                    </span>
                  </div>

                  <div className="w-full bg-crypto-bg-tertiary rounded-full h-2 mb-8">
                    <div
                      className="bg-gradient-to-r from-crypto-accent to-crypto-secondary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    />
                  </div>

                  <h2 className="text-xl font-semibold text-white mb-6">
                    {questions[currentQuestion].question}
                  </h2>

                  <div className="space-y-3">
                    {questions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        disabled={showResult}
                        className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                          showResult
                            ? index === questions[currentQuestion].correct
                              ? 'bg-crypto-success/20 border-2 border-crypto-success'
                              : selectedAnswer === index
                              ? 'bg-crypto-error/20 border-2 border-crypto-error'
                              : 'bg-crypto-bg-tertiary opacity-50'
                            : selectedAnswer === index
                            ? 'bg-crypto-accent/20 border-2 border-crypto-accent'
                            : 'bg-crypto-bg-tertiary hover:bg-crypto-accent/10 border-2 border-transparent hover:border-crypto-accent/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                            showResult
                              ? index === questions[currentQuestion].correct
                                ? 'bg-crypto-success text-crypto-dark'
                                : selectedAnswer === index
                                ? 'bg-crypto-error text-white'
                                : 'bg-crypto-bg-secondary text-crypto-text-secondary'
                              : selectedAnswer === index
                              ? 'bg-crypto-accent text-crypto-dark'
                              : 'bg-crypto-bg-secondary text-crypto-text-secondary'
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="text-white">{option}</span>
                          {showResult && index === questions[currentQuestion].correct && (
                            <svg className="w-5 h-5 text-crypto-success ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-6 p-4 rounded-xl ${
                        selectedAnswer === questions[currentQuestion].correct
                          ? 'bg-crypto-success/10 border border-crypto-success/30'
                          : 'bg-crypto-error/10 border border-crypto-error/30'
                      }`}
                    >
                      <div className={`font-medium mb-1 ${
                        selectedAnswer === questions[currentQuestion].correct
                          ? 'text-crypto-success'
                          : 'text-crypto-error'
                      }`}>
                        {selectedAnswer === questions[currentQuestion].correct ? 'Correct!' : 'Incorrect'}
                      </div>
                      <p className="text-crypto-text-secondary text-sm">
                        {questions[currentQuestion].explanation}
                      </p>
                    </motion.div>
                  )}

                  {showResult && (
                    <div className="mt-6 flex justify-end">
                      <Button variant="primary" onClick={nextQuestion}>
                        {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                        <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Button>
                    </div>
                  )}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

export default Quiz
