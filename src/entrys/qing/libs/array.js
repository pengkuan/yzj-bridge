export function includes (array, item) {
  if (array && array.some) {
    return array.some(n => n === item)
  } else {
    return false
  }
}
