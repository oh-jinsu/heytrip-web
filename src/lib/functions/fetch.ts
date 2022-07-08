export const endpoint = (value: string): string =>  {
  return `${import.meta.env.VITE_API_HOST}/${value}`
}