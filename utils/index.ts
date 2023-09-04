/**
 * Format minutes into hours and mins
 */
export function formatTime(minutes: number) {
  // seconds
  const seconds = minutes * 60
  let secondsLeft = seconds

  // hours
  const hours = Math.floor(secondsLeft / 3600)
  secondsLeft = secondsLeft % 3600

  // mins
  const mins = Math.floor(secondsLeft / 60)
  secondsLeft = secondsLeft % 60

  return `${hours ? `${hours}h` : ''} ${mins}min`
}

export function numberWithCommas(number: number) {
  const i18n = useNuxtApp().$i18n
  // i18n.localeProperties.code
  return new Intl.NumberFormat(unref(i18n.locale)).format(number)
}

// Checking Type of a Value, (interface, type)
export function instanceOf<T>(value: any, fieldName: string): value is T {
  return fieldName in value
}
