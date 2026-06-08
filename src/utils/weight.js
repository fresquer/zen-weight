const KG_TO_LBS = 2.20462

export function toDisplay(kg, unit) {
  if (kg === null || kg === undefined) return null
  return unit === 'lbs' ? kg * KG_TO_LBS : kg
}

export function fromDisplay(val, unit) {
  if (val === null || val === undefined) return null
  return unit === 'lbs' ? val / KG_TO_LBS : val
}

export function formatWeight(kg, unit, decimals = 1) {
  const val = toDisplay(kg, unit)
  if (val === null) return '—'
  return `${val.toFixed(decimals)} ${unit}`
}
