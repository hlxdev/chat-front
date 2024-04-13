export const useUsername = () => {
  const username = localStorage.getItem('username')

  return username
}