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

type ArrayElement<ArrayType> = ArrayType extends (infer ElementType)[]
  ? ElementType
  : never
type ResolveType<T> = T extends Promise<infer R> ? R : T

export async function avoidTooFastPromise<T>(
  promise: T extends ArrayElement<T>[]
    ? (Promise<ArrayElement<T>> | ArrayElement<T>)[]
    : T | Promise<T>,
  minimumWaitTime: number,
): Promise<
  T extends ArrayElement<T>[] ? ResolveType<ArrayElement<T>>[] : ResolveType<T>
> {
  const multiplePromisesProvided = Array.isArray(promise)

  const arrayOfPromises = multiplePromisesProvided ? promise : [promise]

  const resolved = (
    await Promise.all([
      new Promise((resolve) => setTimeout(resolve, minimumWaitTime)),
      ...arrayOfPromises,
    ])
  ).slice(1)

  return multiplePromisesProvided ? resolved : resolved[0]
}

interface ControlledPromise<T = void> extends Promise<T> {
  resolve(value: T | PromiseLike<T>): void
  reject(reason?: any): void
}

/**
 * Return a Promise with `resolve` and `reject` methods
 *
 * @category Promise
 * @example
 * ```
 * const promise = createControlledPromise()
 *
 * await promise
 *
 * // in anther context:
 * promise.resolve(data)
 * ```
 */
export function createControlledPromise<T>(): ControlledPromise<T> {
  let resolve: any, reject: any
  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  }) as ControlledPromise<T>
  promise.resolve = resolve
  promise.reject = reject
  return promise
}
