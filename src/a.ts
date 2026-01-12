export const a = {
  add   <T>(a: Array<T>, value: T) {
    const i = a.indexOf(value)
    if (i <  0) a.push (value)
  },

  remove<T>(a: Array<T>, value: T) {
    const i = a.indexOf(value)
    if (i >= 0) a.splice(i, 1)
  },

  includesAny<T>(a: Array<T>, ...values: Array<T>) {
    for (const value of values)
      if ( a.includes(value))
        return true
    return false
  },

  includesAll<T>(a: Array<T>, ...values: Array<T>) {
    for (const value of values)
      if (!a.includes(value))
        return false
    return true
  },

  excludesAny<T>(a: Array<T>, ...values: Array<T>) {
    for (const value of values)
      if (!a.includes(value))
        return true
    return false
  },

  excludesAll<T>(a: Array<T>, ...values: Array<T>) {
    for (const value of values)
      if ( a.includes(value))
        return false
    return true
  }
}