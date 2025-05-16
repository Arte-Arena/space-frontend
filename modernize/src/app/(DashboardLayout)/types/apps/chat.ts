// chat.ts
import { differenceInHours } from 'date-fns'

export type attachType = {
  icon?: string
  file?: string
  fileSize?: string
}

export type MessageType = {
  id: string
  senderId: number | string
  to?: string
  type: string
  msg: string
  createdAt?: string
  attachment: attachType[]
  erro?: boolean
}

export interface ChatsType {
  id: number | string
  name: string
  status: string
  thumb: string
  recent: boolean
  excerpt: string
  createdAt?: string
  chatHistory?: any[]
  messages: MessageType[]
}

/** Shape mínimo do JSON que vem da API */
export interface ChatApi {
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
function mapMessage(m: NonNullable<ChatApi['messages']>[number]): MessageType {
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
export function mapChat(c: ChatApi): ChatsType {
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
    createdAt: c.lastMessageDate,
    chatHistory: rawMsgs.length ? rawMsgs : undefined,
    messages,
  }
}
