import { Dispatch, SetStateAction } from "react"
import { useUsername } from "../hooks/useUsername"
import { Profile } from "./Profile"
import { CaretRight } from "./icons/CaretRight"

interface Props {
  usersCount: number
  showUsersList: boolean
  setShowUsersList: Dispatch<SetStateAction<boolean>>
}

export function ChatHeader({ usersCount, showUsersList, setShowUsersList }: Props) {
  const username = useUsername()
  const onlineUsersText = `${usersCount} ${usersCount > 1 ? 'Usuários' : 'Usuário'}`

  const toggleUsersList = () => setShowUsersList(!showUsersList)

  return (
    <header className="pb-2 flex justify-between px-6 py-2 w-full h-12 relative border-b border-neutral-800 z-50">
      {username && (
        <Profile />
      )}
      <button
        onClick={toggleUsersList}
        className={`flex items-center gap-1 text-sm py-1 px-2 border ${showUsersList ? 'border-white text-white fill-white' : 'border-neutral-400 text-neutral-400 fill-neutral-400'} rounded-2xl sm:hover:border-white sm:hover:text-white sm:hover:fill-white transition-colors`}
      >
        {onlineUsersText}
        <span className={`${showUsersList ? 'rotate-90 md:rotate-180' : ''} transition-transform`}>
          <CaretRight />
        </span>
      </button>
    </header>
  )
}