import { defineStore } from 'pinia';

export const useWeightStore = defineStore('weight', {
  state: () => ({
    weights: [] // Array de registros de peso con fecha
  }),

  getters: {
    lastWeight: (state) => {
      return state.weights.length ? state.weights[state.weights.length - 1].value : null;
    },
    previousWeight: (state) => {
      return state.weights.length > 1 ? state.weights[state.weights.length - 2].value : null;
    },
    weightDifference: (state) => {
      if (state.weights.length > 1) {
        return state.weights[state.weights.length - 1].value - state.weights[state.weights.length - 2].value;
      }
      return null;
    },
    trend: (state) => {
      if (state.weights.length < 2) return 'No Data';
      const diff = state.weights[state.weights.length - 1].value - state.weights[state.weights.length - 2].value;
      return diff > 0 ? 'Subiendo' : diff < 0 ? 'Bajando' : 'Estable';
    },
    averageWeight: (state) => (days = 10) => {
      const today = new Date();
      const filteredWeights = state.weights
        .filter(entry => {
          const entryDate = new Date(entry.date);
          return (today - entryDate) / (1000 * 60 * 60 * 24) <= days;
        })
        .map(entry => entry.value);

      if (!filteredWeights.length) return null;

      const sum = filteredWeights.reduce((acc, val) => acc + val, 0);
      return (sum / filteredWeights.length).toFixed(2);
    }
  },

  actions: {
    addWeight(value) {
      const newEntry = {
        value,
        date: new Date().toISOString() // Guarda la fecha actual
      };
      this.weights.push(newEntry);
    },
    clearWeights() {
      this.weights = [];
    }
  }
});
