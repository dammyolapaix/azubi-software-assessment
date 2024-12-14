export const convertQueryStringToObject = (
  query: Record<string, any>
): Record<string, any> => {
  const result: Record<string, any> = {}

  for (const key in query) {
    if (Object.prototype.hasOwnProperty.call(query, key)) {
      const keys = key.split('.')
      let currentLevel = result

      for (let i = 0; i < keys.length; i++) {
        const nestedKey = keys[i]
        if (i === keys.length - 1) {
          const value =
            query[key] === 'true'
              ? true
              : query[key] === 'false'
              ? false
              : query[key]
          currentLevel[nestedKey] = value
        } else {
          currentLevel[nestedKey] = currentLevel[nestedKey] || {}
          currentLevel = currentLevel[nestedKey]
        }
      }
    }
  }

  return result
}
