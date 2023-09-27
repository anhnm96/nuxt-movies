import LANGUAGES from '@/constants/languages'

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

export function getRandomUUID() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 15)
}

export function debounce(func: () => void, delay = 0) {
  let timer: NodeJS.Timeout
  return (...args: any) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-invalid-this
      func.apply(this, args)
    }, delay)
  }
}

export function formatLang(iso: string) {
  const fullLang = LANGUAGES.find((lang) => lang.iso_639_1 === iso)

  if (fullLang) return fullLang.english_name

  return iso
}
