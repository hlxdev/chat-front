import { MessageItem, Props as MessageProps } from "./MessageItem";
import { useUsername } from "../hooks/useUsername";

interface Props {
  messages: MessageProps[]
}

export function MessagesList({ messages }: Props) {
  const username = useUsername()

  return (
    <div className="flex flex-col overflow-y-auto py-2 min-h-72">
      {messages.map((message, index) => (
        <MessageItem
          key={message.id}
          {...message}
          index={index}
          stack={!!username && messages[index - 1]?.author === message.author}
        />
      ))}
    </div>
  )
}