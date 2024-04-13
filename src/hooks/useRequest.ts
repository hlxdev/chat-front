import { useState } from "react"

interface RequestState {
  status: 'loading' | 'success' | 'error' | null
  error: string | null
  data: any
}

const baseUrl = import.meta.env.VITE_API_URL

export const useRequest = () => {
  const [request, setRequest] = useState<RequestState>({
    status: null,
    data: null,
    error: null,
  })

  const execute = async (path: string, props: RequestInit): Promise<any> => {
    setRequest({ status: 'loading', data: null, error: null })

    return fetch(`${baseUrl}${path}`, props)
      .then(async (response) => {
        if (response.ok) {
          const data = await response.json()
          setRequest({ status: 'success', data, error: null })

          return data
        } else {
          const data = await response.json()
          const error = data.error || 'Erro desconhecido!'

          setRequest({ status: 'error', data: null, error: error })
          throw new Error(error)
        }
      })
      .catch((error) => {
        setRequest({ status: 'error', data: null, error: error.message })
        throw error
      })
  }

  const update = (newValue: unknown) => {
    setRequest({ ...request, data: newValue })
  }

  return { request, execute, update }
}