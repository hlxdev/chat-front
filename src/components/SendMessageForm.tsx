import { PaperPlaneTilt } from "@phosphor-icons/react"
import { FormEvent, KeyboardEvent, useRef, useState } from "react"
import { useRequest } from "../hooks/useRequest"
import { useUsername } from "../hooks/useUsername"
import messageAudioEffect from '../assets/sounds/message-tap.mp3'
import he from 'he'

const audio = new Audio(messageAudioEffect)

export function SendMessageForm() {
  const { request, execute, clearErrors } = useRequest()
  const [content, setContent] = useState('')
  const contentLength = content.replace('\n\n', '\n').length

  const username = useUsername()

  const divRef = useRef<HTMLDivElement>(null)

  const updateContent = (text: string, paste: boolean = false) => {
    const decodedText = he.decode(text)

    if (request.error) {
      clearErrors()
    }

    if (paste) {
      setContent(`${content}${decodedText}`)
    } else {
      setContent(decodedText)
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault()

    const text = event.clipboardData.getData('text/plain')

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.deleteContents()
      range.insertNode(document.createTextNode(text))

      range.selectNodeContents(divRef.current!)
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)

      updateContent(text, true)
    }
  };

  const handleInput = (event: FormEvent<HTMLDivElement>) => {
    const text = event.currentTarget.innerHTML;

    updateContent(text)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const contentFormatted = content.trim()

    if (!contentFormatted.length) return

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

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      document.execCommand('insertLineBreak')
    }
  }

  return (
    <div className="flex flex-col p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start gap-2 relative">
          <div
            ref={divRef}
            contentEditable
            data-placeholder={'Digite algo interessante...'}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            className="border border-neutral-500 rounded-lg text-sm p-2 overflow-y-auto max-h-48 cursor-text whitespace-pre-wrap flex-1 break-all"
          />

          <button
            type="submit"
            disabled={request.status === 'loading' || !contentLength || contentLength > 300}
            className={`w-[38px] h-[38px] flex items-center justify-center disabled:opacity-40 hover:bg-cyan-300 bg-cyan-500 text-cyan-900 rounded-lg transition-colors`}
          >
            <PaperPlaneTilt weight="fill" size={22} />
          </button>
        </div>
      </form>

      <div className="text-xs text-neutral-400 px-0.5 pt-2">
        <span className={`${contentLength > 300 ? 'text-red-400' : ''}`}>{contentLength}</span> / 300
      </div>

      {request.error && (
        <span className="p-2 rounded-lg bg-red-500/30 text-red-300 text-[13px] w-full mt-2 text-start">
          {request.error}
        </span>
      )}
    </div>
  )
}