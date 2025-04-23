// ChatContent.tsx
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from '@/store/hooks'
import { fetchChats } from '@/store/apps/chat/ChatSlice'
import { useRouter } from 'next/navigation'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Theme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { formatDistanceToNowStrict } from 'date-fns'
import { IconMenu2, IconPhone, IconVideo, IconDotsVertical } from '@tabler/icons-react'
import Image from 'next/image'

import ChatInsideSidebar from './ChatInsideSidebar'
import type { ChatsType, MessageType } from '../../../(DashboardLayout)/types/apps/chat'

interface ChatContentProps {
  toggleChatSidebar: () => void
}

const ChatContent: React.FC<ChatContentProps> = ({ toggleChatSidebar }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'))

  // 1) Chats vindos do Redux
  const chats = useSelector((state) => state.chatReducer.chats) as ChatsType[]
  // 2) ID do chat ativo
  const activeId = useSelector(
    (state) => state.chatReducer.chatContent
  ) as string | number
  // 3) Dados do chat selecionado
  const chatDetails = chats.find((c) => c.id === activeId)

  // 4) Mensagens da conversa selecionada
  const [conversationMessages, setConversationMessages] = useState<MessageType[]>([])

  // Redireciona se não tiver token
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      console.error('Access token missing')
      router.push('/auth/login')
    }
  }, [router])

  // 5) Ao montar, carrega a lista de chats
  useEffect(() => {
    dispatch(fetchChats())
  }, [dispatch])

  // 6) Quando trocamos de chat, buscar as mensagens desse chat
  useEffect(() => {
    if (!chatDetails) {
      setConversationMessages([])
      return
    }

    const token = localStorage.getItem('accessToken')
    if (!token) {
      console.error('Access token missing')
      return
    }

    const fetchConversation = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/octa/get-octa-chat-msgs/${chatDetails.id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )
        if (!res.ok) throw new Error(`Erro ${res.status}`)
        const data = await res.json()

        // Mapeia payload -> MessageType
        const mapped: MessageType[] = data.messages.map((m: any) => ({
          id: m.id,
          senderId: m.sentBy.id,
          type: m.type === 'public' ? 'text' : m.type,
          msg: m.body,
          createdAt: m.time,
          attachment: (m.attachments ?? []).map((att: any) => ({
            file: att.name,
            fileSize: att.size ?? '',
            icon: att.url ?? '',
          })),
        }))

        setConversationMessages(mapped)
      } catch (err) {
        console.error('Erro ao buscar conversa:', err)
      }
    }

    fetchConversation()
  }, [chatDetails?.id])

  // 7) Se não tiver chat selecionado, mostra o placeholder
  if (!chatDetails) {
    return (
      <Box display="flex" alignItems="center" p={2}>
        {!lgUp && <IconMenu2 stroke={1.5} onClick={toggleChatSidebar} />}
        <Typography variant="h4">Select Chat</Typography>
      </Box>
    )
  }

  // 8) Render principal
  return (
    <Box>
      {/* Header */}
      <Box>
        <Box display="flex" alignItems="center" p={2}>
          {!lgUp && (
            <Box mr="10px">
              <IconMenu2 stroke={1.5} onClick={toggleChatSidebar} />
            </Box>
          )}
          <ListItem dense disableGutters>
            <ListItemAvatar>
              <Badge
                color={
                  chatDetails.status === 'online'
                    ? 'success'
                    : chatDetails.status === 'busy'
                    ? 'error'
                    : chatDetails.status === 'away'
                    ? 'warning'
                    : 'secondary'
                }
                variant="dot"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                overlap="circular"
              >
                <Avatar
                  alt={chatDetails.name}
                  src={chatDetails.thumb}
                  sx={{ width: 40, height: 40 }}
                />
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={<Typography variant="h5">{chatDetails.name}</Typography>}
              secondary={chatDetails.status}
            />
          </ListItem>
          <Stack direction="row">
            <IconButton aria-label="phone">
              <IconPhone stroke={1.5} />
            </IconButton>
            <IconButton aria-label="video">
              <IconVideo stroke={1.5} />
            </IconButton>
            <IconButton aria-label="options">
              <IconDotsVertical stroke={1.5} />
            </IconButton>
          </Stack>
        </Box>
        <Divider />
      </Box>

      {/* Mensagens e Sidebar */}
      <Box display="flex">
        {/* Lista de Mensagens */}
        <Box width="100%">
          <Box sx={{ height: '650px', overflow: 'auto', maxHeight: '800px' }} p={3}>
            {conversationMessages.map((chat) => (
              <Box key={chat.id + chat.createdAt}>
                {chatDetails.id === chat.senderId ? (
                  <Box display="flex">
                    <ListItemAvatar>
                      <Avatar
                        alt={chatDetails.name}
                        src={chatDetails.thumb}
                        sx={{ width: 40, height: 40 }}
                      />
                    </ListItemAvatar>
                    <Box>
                      {chat.createdAt && (
                        <Typography variant="body2" color="grey.400" mb={1}>
                          {chatDetails.name},{' '}
                          {formatDistanceToNowStrict(new Date(chat.createdAt), {
                            addSuffix: false,
                          })}{' '}
                          ago
                        </Typography>
                      )}
                      {chat.type === 'text' && (
                        <Box
                          mb={2}
                          sx={{
                            p: 1,
                            backgroundColor: 'grey.100',
                            mr: 'auto',
                            maxWidth: '320px',
                          }}
                        >
                          {chat.msg}
                        </Box>
                      )}
                      {chat.type === 'image' && (
                        <Box mb={1} sx={{ overflow: 'hidden', lineHeight: 0 }}>
                          <Image src={chat.msg} alt="attach" width={150} height={150} />
                        </Box>
                      )}
                    </Box>
                  </Box>
                ) : (
                  <Box
                    mb={1}
                    display="flex"
                    alignItems="flex-end"
                    flexDirection="row-reverse"
                  >
                    <Box display="flex" flexDirection="column" alignItems="flex-end">
                      {chat.createdAt && (
                        <Typography variant="body2" color="grey.400" mb={1}>
                          {formatDistanceToNowStrict(new Date(chat.createdAt), {
                            addSuffix: false,
                          })}{' '}
                          ago
                        </Typography>
                      )}
                      {chat.type === 'text' && (
                        <Box
                          mb={1}
                          sx={{
                            p: 1,
                            backgroundColor: 'primary.light',
                            ml: 'auto',
                            maxWidth: '320px',
                          }}
                        >
                          {chat.msg}
                        </Box>
                      )}
                      {chat.type === 'image' && (
                        <Box mb={1} sx={{ overflow: 'hidden', lineHeight: 0 }}>
                          <Image src={chat.msg} alt="attach" width={250} height={165} />
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Sidebar de media e anexos */}
        <Box flexShrink={0}>
          <ChatInsideSidebar isInSidebar={lgUp} chat={chatDetails} />
        </Box>
      </Box>
    </Box>
  )
}

export default ChatContent
