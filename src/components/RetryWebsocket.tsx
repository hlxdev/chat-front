import { connectWebsocket } from "../lib/websocket";

interface Props {
  resetWsState: () => void
}

export function RetryWebsocket({ resetWsState }: Props) {
  const retryConnection = () => {
    connectWebsocket()
    resetWsState()
  }

  return (
    <div className="p-4 text-center text-sm">
      <p className="text-red-400">
        Ocorreu um erro ao se conectar com o websocket!
      </p>

      <button
        className="rounded-xl py-1 px-2 border text-neutral-400 border-neutral-400 hover:text-white hover:border-white transition-colors mt-4"
        onClick={retryConnection}
      >
        Tentar novamente
      </button>
    </div>
  )
}