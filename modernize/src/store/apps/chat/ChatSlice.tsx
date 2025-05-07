// src/store/apps/chat/ChatSlice.tsx

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AppDispatch } from '../../store'
import { uniqueId } from 'lodash'
import { sub } from 'date-fns'
import type { ChatsType, ChatApi, MessageType } from '@/app/(DashboardLayout)/types/apps/chat'
import { mapChat } from '@/app/(DashboardLayout)/types/apps/chat'

/** Payload para receber uma única mensagem em um chat existente ou novo */
interface ReceiveMessagePayload {
  chatId: string
  message: MessageType
}

/** Estado inicial */
interface ChatState {
  chats: ChatsType[]
  chatContent: string
  chatSearch: string
}

const initialState: ChatState = {
  chats: [],
  chatContent: '',
  chatSearch: '',
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    /** Seta a lista completa de chats (uso opcional, p.ex. histórico inicial) */
    getChats(state, action: PayloadAction<ChatsType[]>) {
      state.chats = action.payload
    },
    /** Recebe um chat completo (ou lote) via WS */
    receiveChat(state, action: PayloadAction<ChatsType>) {
      const incoming = action.payload
      const exists = state.chats.find(c => c.id === incoming.id)
      if (exists) {
        exists.messages = [...exists.messages, ...incoming.messages]
      } else {
        state.chats.unshift(incoming)
      }
    },
    /** Recebe apenas uma mensagem nova em um chat */
    receiveMessage(state, action: PayloadAction<ReceiveMessagePayload>) {
      const { chatId, message } = action.payload
      const chat = state.chats.find(c => c.id === chatId)
      if (chat) {
        chat.messages.push(message)
      } else {
        // Se for um remetente novo, cria um chat básico
        state.chats.unshift({
          id: chatId,
          name: chatId,
          thumb: '',
          status: 'online',
          lastMessageDate: message.createdAt,
          messages: [message],
          recent: false,
          excerpt: message.msg,
        })
      }
    },
    /** Filtra os chats pelo termo de busca */
    SearchChat(state, action: PayloadAction<string>) {
      state.chatSearch = action.payload
    },
    /** Seleciona qual chat está ativo */
    SelectChat(state, action: PayloadAction<string>) {
      state.chatContent = action.payload
    },
    /** Adiciona mensagem quando o usuário digita no frontend */
    sendMsg(
      state,
      action: PayloadAction<{ id: string | number; msg: string }>
    ) {
      const { id, msg } = action.payload
      const newMessage: MessageType = {
        id: uniqueId(),
        msg,
        type: 'text',
        attachment: [],
        createdAt: sub(new Date(), { seconds: 1 }).toISOString(),
        senderId: id,
      }
      state.chats = state.chats.map(chat =>
        chat.id === id
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat
      )
    },
  },
})

// Export único de todas as actions
export const {
  getChats,
  receiveChat,
  receiveMessage,
  SearchChat,
  SelectChat,
  sendMsg,
} = chatSlice.actions

export default chatSlice.reducer

/**
 * Thunk que abre o WebSocket e despacha receiveChat ou receiveMessage
 * Retorna o socket para cleanup no componente.
 */
export const subscribeChats = () => (dispatch: AppDispatch): WebSocket => {
  const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/v1/ws/whatsapp`
  const socket = new WebSocket(wsUrl)

  socket.addEventListener('open', () => {
    console.log('WebSocket conectado em', wsUrl)
  })

  socket.addEventListener('message', event => {
    try {
      const data = JSON.parse(event.data)

      // Se vier um array de chats (forma ChatApi[]), mapeia cada um
      if (Array.isArray(data)) {
        (data as ChatApi[]).forEach(item => {
          dispatch(receiveChat(mapChat(item)))
        })
      }
      // Se vier o formato cru do webhook (raw-event), despacha só a mensagem
      else if (
        typeof data === 'object' &&
        'message' in data &&
        'from' in data &&
        'timestamp' in data
      ) {
        const raw = data as Record<string, any>
        const message: MessageType = {
          id: uniqueId(),
          msg: raw.message,
          type: 'text',
          attachment: [],
          createdAt: raw.timestamp,
          senderId: raw.from,
        }
        dispatch(receiveMessage({ chatId: raw.from, message }))
      }
    } catch (e) {
      console.error('Erro ao processar WS message:', e)
    }
  })

  socket.addEventListener('close', () => {
    console.log('WebSocket desconectado')
  })

  socket.addEventListener('error', err => {
    console.error('WebSocket error:', err)
  })

  return socket
}
