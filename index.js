const { parse, stringify } = require('extended-json-js')

export const getObject = async (asyncStorage, key) => {
  const str = await asyncStorage.getItem(key)
  return parse(str || '{}')
}

export const getArray = async (asyncStorage, key) => {
  const str = await asyncStorage.getItem(key)
  return parse(str || '[]')
}

export const setObjectOrArray = async (asyncStorage, key, value) => {
  const str = stringify(value)
  return asyncStorage.setItem(key, str)
}

export const filterArray = async (asyncStorage, key, predicate) => {
  const array = await getArray(asyncStorage, key)
  const updatedArray = array.filter(predicate)
  setObjectOrArray(asyncStorage, key, updatedArray)
}

export const enqueue = async (asyncStorage, key, value) =>
  enqueueWithCapacity(asyncStorage, key, value, 0)

export const enqueueWithCapacity = async (
  asyncStorage,
  key,
  value,
  capacity,
) => {
  const array = await getArray(asyncStorage, key)
  const updatedArray = [...array, value].slice(-capacity)
  return setObjectOrArray(asyncStorage, key, updatedArray)
}
