import { useUsername } from "../hooks/useUsername";
import { Message } from "../types/interfaces";
import { formatDate } from "../utils/formatDate";
import { getAvatarImg } from "../utils/getAvatarImg";

export interface Props extends Message {
  stack: boolean
  index: number
}

export function MessageItem({ ...message }: Props) {
  const username = useUsername()!
  const isAuthor = username === message.author

  const paragraphs = message.content.split('\n')

  return (
    <div className={`flex flex-col ${!message.stack && message.index > 0 ? 'mt-4' : ''} px-4 py-0.5 group/item space-y-1`}>
      {!message.stack && (
        <div className="flex justify-start items-start gap-2">
          <img
            src={getAvatarImg(message.author)}
            alt={message.author}
            className="w-[24px] h-[24px] rounded-full"
          />
          <span className={`-mt-0.5 block text-sm font-medium truncate overflow-hidden ${isAuthor ? 'text-blue-500' : 'text-inherit'}`}>{message.author}</span>
        </div>
      )}
      <div className="flex items-center gap-1.5">
        <span className={`break-all overflow-x-hidden w-fit py-1 px-2 rounded-tl rounded-b-[14px] rounded-tr-[14px] text-sm ${isAuthor ? 'bg-cyan-700' : 'bg-neutral-700'}`}>
          {paragraphs.map(paragraph => (
            <>
              {paragraph}
              <br />
            </>
          ))}

          <span className={`mb-[5px] font-medium text-[10px] ${isAuthor ? 'text-cyan-100' : 'text-neutral-300'}`}>
            {formatDate(message.createdAt)}
          </span>
        </span>
      </div>
    </div>
  )
}