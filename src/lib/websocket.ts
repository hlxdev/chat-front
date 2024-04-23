type MessageHandler = (event: MessageEvent) => void;

const baseWs = import.meta.env.VITE_API_WS

let socket: WebSocket | null = null
const messageHandlers = new Set<MessageHandler>();

export const addMessageHandler = (handler: MessageHandler) => {
  messageHandlers.add(handler);
};

export const removeMessageHandler = (handler: MessageHandler) => {
  messageHandlers.delete(handler);
};

export const connectWebsocket = () => {
  const username = localStorage.getItem('username')

  let websocket = new WebSocket(`${baseWs}?username=${username}`)

  // RECONECTAR
  if (socket) {
    websocket.onopen = socket.onopen
    websocket.onclose = socket.onclose
  }

  socket = websocket

  socket!.onmessage = (event) => {
    messageHandlers.forEach((handler: MessageHandler) => handler(event));
  }
}


export { socket }