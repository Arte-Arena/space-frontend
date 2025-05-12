import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import type { AppDispatch } from '../../store'
import { uniqueId } from 'lodash'
import type { ChatsType, ChatApi, MessageType } from '@/app/(DashboardLayout)/types/apps/chat'
import { mapChat } from '@/app/(DashboardLayout)/types/apps/chat'
import { mapRawEventToChat } from '@/app/components/apps/chats/ChatContent'

/** Payload para envio de mensagem */
interface SendMsgPayload {
  id: string  // conversation ID (número destino)
  msg: string // texto da mensagem
}

/** Retorno esperado do backend Go / 360Dialog */
interface SendMsgResponse {
  messages?: { id: string }[]
  // outros campos do retorno podem ser adicionados aqui
}

/** Estado estendido para status de envio */
interface ChatState {
  chats: ChatsType[]
  chatContent: string
  chatSearch: string
  sendStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  sendError: string | null
}

const initialState: ChatState = {
  chats: [],
  chatContent: '',
  chatSearch: '',
  sendStatus: 'idle',
  sendError: null,
}

// Thunk para enviar mensagem via backend Go
export const sendMsg = createAsyncThunk<
  { id: string; msg: string; echo?: SendMsgResponse },
  SendMsgPayload,
  { rejectValue: string }
>('chat/sendMsg', async ({ id, msg }, { rejectWithValue }) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_CLIENT}/v1/extchat/send-message`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: id, body: msg }),
      }
    )
    const data: SendMsgResponse = await res.json()
    if (!res.ok) {
      return rejectWithValue(data as any)
    }
    return { id, msg, echo: data }
  } catch (err: any) {
    return rejectWithValue(err.message)
  }
})

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
    receiveMessage(
      state,
      action: PayloadAction<{ chatId: string; message: MessageType }>
    ) {
      const { chatId, message } = action.payload
      const chat = state.chats.find(c => c.id === chatId)
      if (chat) {
        chat.messages.push(message)
      } else {
        state.chats.unshift({
          id: chatId,
          name: chatId,
          thumb: '',
          status: 'online',
          createdAt: message.createdAt,
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
  },
  extraReducers: builder => {
    builder
      .addCase(sendMsg.pending, state => {
        state.sendStatus = 'loading'
        state.sendError = null
      })
      .addCase(sendMsg.fulfilled, (state, { payload }) => {
        state.sendStatus = 'succeeded'
        const chat = state.chats.find(c => c.id === payload.id)
        const newMessage: MessageType = {
          id: uniqueId(),
          msg: payload.msg,
          type: 'text',
          attachment: [],
          createdAt: new Date().toISOString(),
          senderId: payload.id,
        }
        if (chat) {
          chat.messages.push(newMessage)
        } else {
          state.chats.unshift({
            id: payload.id,
            name: payload.id,
            thumb: '',
            status: 'online',
            createdAt: newMessage.createdAt,
            messages: [newMessage],
            recent: false,
            excerpt: newMessage.msg,
          })
        }
      })
      .addCase(sendMsg.rejected, (state, { payload }) => {
        state.sendStatus = 'failed'
        state.sendError = payload || 'Falha desconhecida'
      })
  },
})

export const {
  getChats,
  receiveChat,
  receiveMessage,
  SearchChat,
  SelectChat,
} = chatSlice.actions

export default chatSlice.reducer

let currentSocket: WebSocket | null = null

export const subscribeChats = () => (dispatch: AppDispatch): WebSocket => {
  // Fecha conexão anterior
  if (currentSocket) {
    currentSocket.close()
  }

  const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/v1/ws/whatsapp`
  const socket = new WebSocket(wsUrl)
  currentSocket = socket

  socket.onopen = () => console.log('WS aberto');
  socket.onerror = e => console.log('WS erro:', e);
  socket.onclose = (event) => {
    console.log('WebSocket fechado:', event.code, event.reason, 'wasClean:', event.wasClean);
  };

  socket.addEventListener('open', () => {
    console.log('WebSocket conectado em', wsUrl)
  })

  socket.addEventListener('message', event => {
    try {
      const data = JSON.parse(event.data)

      if (Array.isArray(data)) {
        const first = data[0] as any

        if (first.raw_event) {
          // ===== RAW_EVENTS (novas mensagens) =====
          data.forEach(evt => {
            const message = mapRawEventToChat(evt)
            dispatch(
              receiveMessage({ chatId: message.senderId, message })
            )
          })
        } else {
          // ===== CHATAPI (p.ex. histórico ou lote) =====
          ; (data as ChatApi[]).forEach(item => {
            dispatch(receiveChat(mapChat(item)))
          })
        }

      } else if (
        typeof data === 'object' &&
        'message' in data &&
        'from' in data &&
        'timestamp' in data
      ) {
        // seu handler antigo de objeto simples
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

  socket.addEventListener('error', err => {
    console.error('WebSocket error:', err)
  })

  socket.addEventListener('close', () => {
    console.log('WebSocket desconectado')
  })

  const HEARTBEAT_INTERVAL = 60 * 1000 // 1 minuto
  const heartbeat = setInterval(() => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'ping' }))
    }
  }, HEARTBEAT_INTERVAL)

  const cleanup = () => clearInterval(heartbeat)
  socket.addEventListener('close', cleanup)
  socket.onclose = (event) => {
    cleanup()
    console.log('WebSocket fechado:', event.code, event.reason, 'wasClean:', event.wasClean)
  }

  return socket
}
