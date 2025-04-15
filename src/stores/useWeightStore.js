import { defineStore } from 'pinia'

export const useWeightStore = defineStore('weight', {
  state: () => ({
    weights: [], // Array de registros de peso con fecha
  }),

  getters: {
    lastRegister: (state) => {
      return state.weights.length > 0 ? state.weights[state.weights.length - 1] : null
    },
    lastWeight: (state) => {
      return state.weights.length ? state.weights[state.weights.length - 1].value : null
    },
    previousWeight: (state) => {
      return state.weights.length > 1 ? state.weights[state.weights.length - 2].value : null
    },
    weightDifference: (state) => {
      if (state.weights.length > 1) {
        return (
          state.weights[state.weights.length - 1].value -
          state.weights[state.weights.length - 2].value
        )
      }
      return null
    },
    trend: (state) => {
      if (state.weights.length < 2) return 'No Data'
      const diff =
        state.weights[state.weights.length - 1].value -
        state.weights[state.weights.length - 2].value
      return diff > 0 ? 'Subiendo' : diff < 0 ? 'Bajando' : 'Estable'
    },
    averageWeight:
      (state) =>
      (days = 10) => {
        const today = new Date()
        const filteredWeights = state.weights
          .filter((entry) => {
            const entryDate = new Date(entry.date)
            return (today - entryDate) / (1000 * 60 * 60 * 24) <= days
          })
          .map((entry) => entry.value)

        if (!filteredWeights.length) return null

        const sum = filteredWeights.reduce((acc, val) => acc + val, 0)
        return (sum / filteredWeights.length).toFixed(2)
      },
  },

  actions: {
    async fetchWeights() {
      // Por ahora retornamos los weights del state
      // Aquí podrías agregar una llamada a API en el futuro
      return this.weights
    },

    async addWeight({ value, date }) {
      const newEntry = {
        id: Date.now(), // Usar timestamp como ID simple
        value: parseFloat(value),
        date: date || new Date().toISOString(),
      }
      this.weights.push(newEntry)
      return newEntry
    },

    async editWeight(id, { value, date }) {
      const index = this.weights.findIndex((w) => w.id === id)
      if (index !== -1) {
        this.weights[index] = {
          ...this.weights[index],
          value: parseFloat(value),
          date: date || this.weights[index].date,
        }
        return this.weights[index]
      }
      throw new Error('Weight entry not found')
    },

    async deleteWeight(id) {
      const index = this.weights.findIndex((w) => w.id === id)
      if (index !== -1) {
        this.weights.splice(index, 1)
        return true
      }
      throw new Error('Weight entry not found')
    },

    clearWeights() {
      this.weights = []
    },
  },
})
