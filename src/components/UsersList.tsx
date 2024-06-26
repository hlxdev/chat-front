import { useEffect } from "react";
import { getAvatarImg } from "../utils/getAvatarImg";
import { useRequest } from "../hooks/useRequest";
import { useUsername } from "../hooks/useUsername";
import { addMessageHandler, removeMessageHandler, socket } from "../lib/websocket";

export function UsersList() {
  const username = useUsername()
  const { request, execute, update } = useRequest()

  const users: string[] = request.data

  useEffect(() => {
    execute('/users', { method: 'GET' }).then((users: string[]) => {
      if (socket) {
        const handler = (event: MessageEvent) => {
          const data = JSON.parse(event.data)

          if (data.name === 'userJoin' && !data.repeatedConn) {
            update([...users, data.user])
          }

          if (data.name === 'userLeft' && !data.repeatedConn) {
            update(users.filter(u => u !== data.user))
          }
        }

        addMessageHandler(handler);
        return () => removeMessageHandler(handler)
      }
    })
  }, [])

  return (
    <div className="rounded-lg overflow-y-auto w-full">
      {!!users?.length && (
        <ul className="space-y-2 p-4">
          {users.map(user => (
            <li key={user} className="flex items-center gap-2 text-sm">
              <img
                src={getAvatarImg(user)}
                alt={user}
                className="w-[22px] h-[22px] rounded-full"
              />
              <span className="truncate">{user}</span>
              {user === username && (
                <span className="text-xs px-1 rounded-xl text-cyan-400 bg-cyan-900/30">
                  Você
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}