import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import type { AppDispatch } from '../../store'
import { uniqueId } from 'lodash'
import type { ChatsType, ChatApi, MessageType } from '@/app/(DashboardLayout)/types/apps/chat'
import { mapChat } from '@/app/(DashboardLayout)/types/apps/chat'
import { mapRawEventToChat } from '@/app/components/apps/chats/ChatContent'

const numeroDoSistema = '551123371548'

interface SendMsgPayload {
  id: string
  msg: string
}

interface SendMsgResponse {
  messages?: { id: string }[]
}

interface ChatState {
  chats: ChatsType[]
  chatContent: string
  chatSearch: string
  sendStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  sendError: string | null
  chatsStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
}

const initialState: ChatState = {
  chats: [],
  chatContent: '',
  chatSearch: '',
  sendStatus: 'idle',
  sendError: null,
  chatsStatus: 'idle',
}

export const sendMsg = createAsyncThunk<
  { id: string; msg: string; echo?: SendMsgResponse },
  SendMsgPayload,
  { rejectValue: string }
>('chat/sendMsg', async ({ id, msg }, { rejectWithValue }) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_CLIENT}/v1/extchat/send-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: id, body: msg }),
    })
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
    getChats(state, action: PayloadAction<ChatsType[]>) {
      state.chats = action.payload
    },
    receiveChat(state, action: PayloadAction<ChatsType>) {
      const incoming = action.payload
      const exists = state.chats.find(c => c.id === incoming.id)
      if (exists) {
        exists.messages = [...exists.messages, ...incoming.messages]
      } else {
        state.chats.unshift(incoming)
      }
    },
    receiveMessage(state, action: PayloadAction<{ chatId: string; message: MessageType }>) {
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
    SearchChat(state, action: PayloadAction<string>) {
      state.chatSearch = action.payload
    },
    SelectChat(state, action: PayloadAction<string>) {
      state.chatContent = action.payload
    },
    setChatsLoading(state) {
      state.chatsStatus = 'loading'
    },
    setChatsLoaded(state) {
      state.chatsStatus = 'succeeded'
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
          senderId: numeroDoSistema,
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
      .addCase(sendMsg.rejected, (state, { payload, meta }) => {
        state.sendStatus = 'failed'
        state.sendError = payload || 'Falha desconhecida'

        const fallbackMessage: MessageType = {
          id: uniqueId(),
          msg: meta.arg.msg,
          type: 'text',
          attachment: [],
          createdAt: new Date().toISOString(),
          senderId: numeroDoSistema,
          erro: true,
        }

        const chat = state.chats.find(c => c.id === meta.arg.id)
        if (chat) {
          chat.messages.push(fallbackMessage)
        } else {
          state.chats.unshift({
            id: meta.arg.id,
            name: meta.arg.id,
            thumb: '',
            status: 'online',
            createdAt: fallbackMessage.createdAt,
            messages: [fallbackMessage],
            recent: false,
            excerpt: fallbackMessage.msg,
          })
        }
      })
  },
})

export const {
  getChats,
  receiveChat,
  receiveMessage,
  SearchChat,
  SelectChat,
  setChatsLoading,
  setChatsLoaded,
} = chatSlice.actions

export default chatSlice.reducer

let currentSocket: WebSocket | null = null

export const subscribeChats = () => (dispatch: AppDispatch): WebSocket => {
  if (currentSocket) currentSocket.close()

  const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/v1/ws/whatsapp`
  const socket = new WebSocket(wsUrl)
  currentSocket = socket

  socket.onmessage = event => {
    try {
      const data = JSON.parse(event.data)
      if (Array.isArray(data)) {
        const first = data[0]
        if (first.raw_event) {
          data.forEach(evt => {
            const message = mapRawEventToChat(evt)
            dispatch(receiveMessage({ chatId: String(message.senderId), message }))
          })
        } else {
          (data as ChatApi[]).forEach(item => {
            dispatch(receiveChat(mapChat(item)))
          })
        }
      } else if (data.message && data.from) {
        const message: MessageType = {
          id: uniqueId(),
          msg: data.message,
          type: 'text',
          attachment: [],
          createdAt: data.timestamp,
          senderId: data.from,
        }
        dispatch(receiveMessage({ chatId: data.from, message }))
      }
    } catch (e) {
      console.error('Erro ao processar WS:', e)
    }
  }

  const heartbeat = setInterval(() => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'ping' }))
    }
  }, 60 * 1000)

  socket.onclose = () => clearInterval(heartbeat)

  return socket
}
