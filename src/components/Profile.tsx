import { useUsername } from '../hooks/useUsername'

export function Profile() {
  const username = useUsername()

  return (
    <div className="flex items-center gap-2 text-lg">
      {/* <span className="w-3 h-3 rounded-full bg-green-500" /> */}
      <p>{username}</p>
    </div>
  )
}