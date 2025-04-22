// src/store/apps/chat/ChatSlice.tsx
import axios from '../../../utils/axios'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AppDispatch } from '../../store'
import { uniqueId } from 'lodash'
import { sub } from 'date-fns'

// Importa tipo e funcão de mapeamento que você definiu em chat.ts
import type { ChatsType, OctaChatApi } from '@/app/(DashboardLayout)/types/apps/chat'
import { mapChat } from '@/app/(DashboardLayout)/types/apps/chat'

/** Estado local do slice */
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
    /** seta a lista de chats no estado */
    getChats(state, action: PayloadAction<ChatsType[]>) {
      state.chats = action.payload
    },
    /** filtra via busca */
    SearchChat(state, action: PayloadAction<string>) {
      state.chatSearch = action.payload
    },
    /** seleciona qual chat está aberto */
    SelectChat(state, action: PayloadAction<string>) {
      state.chatContent = action.payload
    },
    /** adiciona mensagem — revisado pra usar o modelo correto de ChatsType */
    sendMsg(
      state,
      action: PayloadAction<{ id: string | number; msg: string }>
    ) {
      const { id, msg } = action.payload
      const newMessage = {
        id: uniqueId(),
        msg,
        type: 'text',
        attachment: [],                // conforme seu MessageType
        createdAt: sub(new Date(), { seconds: 1 }).toISOString(),
        senderId: id,
      }
      state.chats = state.chats.map((chat) =>
        chat.id === id
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat
      )
    },
  },
})

export const { getChats, SearchChat, SelectChat, sendMsg } = chatSlice.actions

/**
 * Thunk que faz o fetch real dos chats no Octadesk, mapeia e dispara para o estado
 */
export const fetchChats = () => async (dispatch: AppDispatch) => {
  try {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      throw new Error('Access token is missing')
    }

    const url = `${process.env.NEXT_PUBLIC_API}/api/octa/get-all-octa-chats`
    const response = await axios.get<OctaChatApi[]>(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const mappedChats = response.data.map(mapChat)
    dispatch(getChats(mappedChats))
    if (mappedChats.length > 0) {
      dispatch(SelectChat(String(mappedChats[0].id)))
    }
  } catch (err: any) {
    console.error('Erro ao buscar chats:', err)
  }
}

export default chatSlice.reducer
