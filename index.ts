const { parse, stringify } = require('extended-json-js')

export interface IAsyncStorage {
  getItem(
    key: string,
    callback?: (error?: Error, result?: string) => void,
  ): Promise<string>
  setItem(
    key: string,
    value: string,
    callback?: (error?: Error) => void,
  ): Promise<void>
  removeItem(key: string, callback?: (error?: Error) => void): Promise<void>
}

export class AsyncStorageMock implements IAsyncStorage {
  public data: any = {}

  public getItem(
    key: string,
    callback?: (error?: Error, result?: string) => void,
  ): Promise<string> {
    return this.data[key]
  }

  public setItem(
    key: string,
    value: string,
    callback?: (error?: Error) => void,
  ): Promise<void> {
    this.data[key] = value
    return Promise.resolve(undefined)
  }

  public removeItem(
    key: string,
    callback?: (error?: Error) => void,
  ): Promise<void> {
    delete this.data[key]
    return Promise.resolve(undefined)
  }
}

export const getObject = async (
  asyncStorage: IAsyncStorage,
  key: string,
): Promise<object> => {
  const str = await asyncStorage.getItem(key)
  return parse(str || '{}')
}

export const getArray = async (
  asyncStorage: IAsyncStorage,
  key: string,
): Promise<any[]> => {
  const str = await asyncStorage.getItem(key)
  return parse(str || '[]')
}

export const setValue = async (
  asyncStorage: IAsyncStorage,
  key: string,
  value: any[],
) => {
  const str = stringify(value)
  return asyncStorage.setItem(key, str)
}

export const filterArray = async (
  asyncStorage: IAsyncStorage,
  key: string,
  predicate: (o: any) => boolean,
) => {
  const array = await getArray(asyncStorage, key)
  const updatedArray = array.filter(predicate)
  setValue(asyncStorage, key, updatedArray)
}

export const enqueue = async (
  asyncStorage: IAsyncStorage,
  key: string,
  value: any,
) => enqueueWithCapacity(asyncStorage, key, value, 0)

export const enqueueWithCapacity = async (
  asyncStorage: IAsyncStorage,
  key: string,
  value: any,
  capacity: number,
) => {
  const array = await getArray(asyncStorage, key)
  const updatedArray = [...array, value].slice(-capacity)
  return setValue(asyncStorage, key, updatedArray)
}
