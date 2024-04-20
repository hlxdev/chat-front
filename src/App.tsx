import { useEffect, useState } from "react"
import { MessagesList } from "./components/MessagesList"
import { UsernameModalForm } from "./components/UsernameModalForm"
import { useUsername } from "./hooks/useUsername"
import { addMessageHandler, connectWebsocket, removeMessageHandler, socket } from "./lib/websocket"
import { UsersList } from "./components/UsersList"
import { ChatHeader } from "./components/ChatHeader"
import { SendMessageForm } from "./components/SendMessageForm"
import { RetryWebsocket } from "./components/RetryWebsocket"
import { Loader } from "./components/Loader"
import { Props as MessageProps } from "./components/MessageItem";

export interface UsernameModalProps {
  show: boolean
}

interface InfoProps {
  messages: MessageProps[]
  users: string[]
  usersCount: number
}

// WEBSOCKET STATE (0: CONNECTING | 1: CONNECTED | 3: CLOSED)

function App() {
  const username = useUsername()

  const [websocketState, setWebsocketState] = useState(0)
  const [showUsersList, setShowUsersList] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)
  const [info, setInfo] = useState<InfoProps>({
    messages: [],
    users: [],
    usersCount: 0
  })

  useEffect(() => {
    if (!username) {
      setIsNewUser(true)
    } else {
      connectWebsocket()
    }

    if (socket) {
      socket.onopen = () => {
        setWebsocketState(1)
      }

      socket.onclose = () => {
        setShowUsersList(false)
        setWebsocketState(3)
      }
    }

    const handler = (event: MessageEvent) => {
      const data = JSON.parse(event.data)

      if (data.name === 'messagesList') {
        setInfo(current => ({ ...current, messages: data.messages }))
      }

      if (data.name === 'messageSent') {
        if (data.removeOld) {
          setInfo(current => ({ ...current, messages: [...current.messages.slice(1), data.message] }))
        } else {
          setInfo(current => ({ ...current, messages: [...current.messages, data.message] }))
        }
      }

      if (['userJoin', 'userLeft'].includes(data.name)) {
        setInfo(current => ({ ...current, usersCount: data.counter }))
      }
    }

    addMessageHandler(handler);
    return () => removeMessageHandler(handler)
  }, [])

  const isWebsocketClosed = websocketState === 3
  const isWebsocketConnecting = websocketState === 0

  if (isNewUser) {
    return (
      <UsernameModalForm
        onConnect={() => setWebsocketState(1)}
        closeModal={() => setIsNewUser(false)}
      />
    )
  } else {
    return (
      <div className="w-screen h-screen flex items-center justify-center p-2">
        <main>
          {username && (
            <div className="flex w-full h-full relative border border-neutral-800 rounded-xl overflow-hidden">
              <div className="flex flex-col">
                {isWebsocketClosed ? (
                  <RetryWebsocket resetWsState={() => setWebsocketState(0)} />
                ) : (
                  isWebsocketConnecting ? (
                    <div className="p-4 text-2xl">
                      <Loader />
                    </div>
                  ) : (
                    <div className="flex flex-col w-[300px] md:max-w-96 md:w-auto max-h-[620px]">
                      <ChatHeader
                        usersCount={info.usersCount}
                        showUsersList={showUsersList}
                        setShowUsersList={setShowUsersList}
                      />
                      <MessagesList messages={info.messages} />
                      <SendMessageForm />
                    </div>
                  )
                )}
              </div>
              {showUsersList && (
                <div className="flex absolute pt-12 md:p-0 md:w-auto w-full h-full bg-[var(--background)] md:relative md:border-l md:border-neutral-800 md:h-auto">
                  <UsersList />
                </div>
              )}
            </div>
          )}
        </main>
      </div >
    )
  }
}

export default App