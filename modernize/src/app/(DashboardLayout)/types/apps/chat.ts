// chat.ts
import { differenceInHours } from 'date-fns'

type attachType = {
  icon?: string
  file?: string
  fileSize?: string
}

export type MessageType = {
  id: string
  senderId: number | string
  type: string
  msg: string
  createdAt?: string
  attachment: attachType[]
}

export interface ChatsType {
  id: number | string
  name: string
  status: string
  thumb: string
  recent: boolean
  excerpt: string
  lastMessageDate: string
  chatHistory?: any[]
  messages: MessageType[]
}

/** Shape mínimo do JSON que vem da API */
export interface OctaChatApi {
  id: string
  number: number
  channel: string
  contact: {
    id: string
    name: string
    avatarUrl?: string
    // ... outros campos que existam
  }
  lastMessageDate: string
  lastMessageText?: string
  messages?: Array<{
    id: string
    from: string
    text: string
    timestamp: string
    senderId: string | number
    type: string
    attachment: attachType[]
  }>
}

/** Retorna true se a data for nas últimas 24h */
const isRecent = (isoDate: string): boolean =>
  differenceInHours(new Date(), new Date(isoDate)) <= 24

/** Mapeia cada mensagem bruta para MessageType */
function mapMessage(m: NonNullable<OctaChatApi['messages']>[number]): MessageType {
  return {
    id: m.id,
    senderId: m.senderId,
    type: m.type,
    msg: m.text,
    createdAt: m.timestamp,
    attachment: m.attachment || [],
  }
}

/** Mapeia um chat bruto para ChatsType */
export function mapChat(c: OctaChatApi): ChatsType {
  const rawMsgs = c.messages ?? []
  const messages = rawMsgs.map(mapMessage)
  const lastText =
    c.lastMessageText ?? messages.slice(-1)[0]?.msg ?? ''

  return {
    id: c.id,
    name: c.contact.name,
    status: c.channel === 'whatsapp' ? 'online' : c.channel,
    thumb: c.contact.avatarUrl ?? '',
    recent: isRecent(c.lastMessageDate),
    excerpt: lastText,
    lastMessageDate: c.lastMessageDate,
    chatHistory: rawMsgs.length ? rawMsgs : undefined,
    messages,
  }
}

/**
 * Faz o fetch e devolve ChatsType[]
 */
export async function fetchChats(): Promise<ChatsType[]> {
  const accessToken = localStorage.getItem('accessToken')
  if (!accessToken) throw new Error('Access token is missing')
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API}/api/octa/get-all-octa-chats`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
  if (!res.ok) throw new Error(`Fetch error: ${res.status}`)
  const data: OctaChatApi[] = await res.json()
  return data.map(mapChat)
}
