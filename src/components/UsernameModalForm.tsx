import { FormEvent } from "react"
import { useRequest } from "../hooks/useRequest"
import { Loader } from "./Loader"
import { connectWebsocket, socket } from "../lib/websocket"

interface Props {
  onConnect: () => void
  closeModal: () => void
}

export function UsernameModalForm({ onConnect, closeModal }: Props) {
  const { request, execute } = useRequest()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const data = new FormData(event.target as HTMLFormElement)
    const username = data.get('username') as string

    execute('/username', {
      method: 'POST',
      body: JSON.stringify({ username }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(() => {
      localStorage.setItem('username', username)

      closeModal()
      connectWebsocket()

      if (socket) {
        onConnect()
      }
    })
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen fixed top-0 left-0 z-50 bg-black">
      <form onSubmit={handleSubmit}>
        <div className="max-w-[400px] rounded-lg p-4 shadow border-t border-neutral-800 shadow-neutral-700 flex flex-col text-sm space-y-4 mb-36">
          <h3 className="font-medium text-lg text-center">Escolha um nome criativo ✨</h3>

          {/* {(!!request.error || !!defaultError) && (
            <span className="bg-red-900/20 text-red-700 text-sm rounded p-2 text-center">{request.error || defaultError}</span>
          )} */}

          {(!!request.error) && (
            <span className="bg-red-900/20 text-red-700 text-sm rounded p-2 text-center">{request.error}</span>
          )}

          <input
            type="text"
            name="username"
            required
            placeholder="Nome de usuário"
            className="p-2 rounded-lg bg-neutral-950 border border-neutral-700"
          />

          <button
            type="submit"
            disabled={request.status === 'loading'}
            className="w-full rounded-lg border py-2 border-neutral-600 hover:border-white transition-colors"
          >
            {request.status === 'loading' ? (
              <Loader />
            ) : (
              'Confirmar'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}