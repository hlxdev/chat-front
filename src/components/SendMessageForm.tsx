import { PaperPlaneTilt } from "@phosphor-icons/react"
import { FormEvent, useRef, useState } from "react"
import { useRequest } from "../hooks/useRequest"
import { useUsername } from "../hooks/useUsername"
import messageAudioEffect from '../assets/sounds/message-tap.mp3'

const audio = new Audio(messageAudioEffect)

export function SendMessageForm() {
  const { request, execute } = useRequest()
  const [content, setContent] = useState('')

  const username = useUsername()

  const divRef = useRef<HTMLDivElement>(null)

  const handleInput = (event: FormEvent<HTMLDivElement>) => {
    const text = event.currentTarget.innerHTML;
    const formattedText = text.replace(/<br>/g, '\n');

    setContent(formattedText)
  }

  const handleClick = () => {
    if (!document.getSelection()?.anchorNode) {
      const range = document.createRange();
      range.selectNodeContents(divRef.current!);
      range.collapse(true);
      const sel = window.getSelection();

      sel!.removeAllRanges();
      sel!.addRange(range);
    }
  }

  const handleSendMessage = async () => {
    const contentFormatted = content.trim()
    if (request.status === 'loading' || !contentFormatted.length) return

    execute('/message', {
      method: 'POST',
      body: JSON.stringify({
        content: contentFormatted,
        author: username
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(() => {
      audio.play()
      setContent('')
      divRef.current!.innerHTML = ''
    })
  }

  return (
    <div className="flex flex-col p-4">
      <div className="flex items-start gap-2 relative">
        <div
          ref={divRef}
          contentEditable
          data-placeholder={'Digite algo interessante...'}
          onInput={handleInput}
          onClick={handleClick}
          className="border border-neutral-500 rounded-lg flex-1 text-sm p-2 overflow-y-auto max-h-48 cursor-text"
        />

        <button
          type="button"
          onClick={handleSendMessage}
          className={`w-[38px] h-[38px] flex items-center justify-center ${request.status === 'loading' || !content.trim().length ? 'opacity-40' : 'hover:bg-cyan-300'} bg-cyan-500 text-cyan-900 rounded-lg transition-colors`}
        >
          <PaperPlaneTilt weight="fill" size={22} />
        </button>
      </div>
      {request.status === 'error' && (
        <span className="p-2 rounded-lg bg-red-500/30 text-red-300 text-sm text-center max-w-72 mt-2">
          Ocorreu um erro ao enviar a mensagem, tente novamente.
        </span>
      )}
    </div>
  )
}