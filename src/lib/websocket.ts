const baseWs = import.meta.env.VITE_API_WS

let socket: WebSocket | null = null
const messageHandlers = new Set();

export const addMessageHandler = (handler: any) => {
  messageHandlers.add(handler);
};

export const removeMessageHandler = (handler: any) => {
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
    console.log('EVENTO:', messageHandlers)
    messageHandlers.forEach((handler: any) => handler(event));
  }
}


export { socket }