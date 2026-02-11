import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'dark',
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'dark' ? 'light' : 'dark' 
      })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'crypto-theme',
    }
  )
)

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      login: async (email, password) => {
        set({ loading: true, error: null })
        try {
          await new Promise(resolve => setTimeout(resolve, 1000))
          const user = { email, name: email.split('@')[0] }
          set({ user, isAuthenticated: true, loading: false })
          return { success: true }
        } catch (error) {
          set({ error: error.message, loading: false })
          return { success: false, error: error.message }
        }
      },
      register: async (name, email, password) => {
        set({ loading: true, error: null })
        try {
          await new Promise(resolve => setTimeout(resolve, 1000))
          const user = { name, email }
          set({ user, isAuthenticated: true, loading: false })
          return { success: true }
        } catch (error) {
          set({ error: error.message, loading: false })
          return { success: false, error: error.message }
        }
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'crypto-auth',
    }
  )
)

export const useEncryptionStore = create((set) => ({
  currentAlgorithm: 'lsb',
  encryptionHistory: [],
  selectedImage: null,
  secretMessage: '',
  password: '',
  isProcessing: false,
  resultImage: null,
  decryptedMessage: '',
  setAlgorithm: (algorithm) => set({ currentAlgorithm: algorithm }),
  setSelectedImage: (image) => set({ selectedImage: image }),
  setSecretMessage: (message) => set({ secretMessage: message }),
  setPassword: (password) => set({ password }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setResultImage: (image) => set({ resultImage: image }),
  setDecryptedMessage: (message) => set({ decryptedMessage: message }),
  addToHistory: (item) => set((state) => ({
    encryptionHistory: [item, ...state.encryptionHistory].slice(0, 50)
  })),
  reset: () => set({
    selectedImage: null,
    secretMessage: '',
    password: '',
    isProcessing: false,
    resultImage: null,
    decryptedMessage: '',
  }),
}))

export const useQuizStore = create((set) => ({
  currentQuiz: null,
  quizHistory: [],
  achievements: [],
  totalPoints: 0,
  streak: 0,
  setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),
  addQuizResult: (result) => set((state) => ({
    quizHistory: [result, ...state.quizHistory],
    totalPoints: state.totalPoints + result.points,
    streak: result.correct ? state.streak + 1 : 0,
  })),
  addAchievement: (achievement) => set((state) => ({
    achievements: [...state.achievements, achievement],
  })),
  resetQuiz: () => set({ currentQuiz: null }),
}))

export const useChatbotStore = create((set) => ({
  messages: [],
  isTyping: false,
  conversationHistory: [],
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message],
    conversationHistory: [...state.conversationHistory, message],
  })),
  setIsTyping: (isTyping) => set({ isTyping }),
  clearMessages: () => set({ messages: [], conversationHistory: [] }),
}))
