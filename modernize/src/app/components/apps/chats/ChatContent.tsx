import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from '@/store/hooks'
import { getChats, subscribeChats } from '@/store/apps/chat/ChatSlice'
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
import type { ChatsType, MessageType, attachType } from '../../../(DashboardLayout)/types/apps/chat'

interface ChatContentProps {
  toggleChatSidebar: () => void
}

export function mapRawEventToChat(evt: { raw_event: any; received_at: string }): MessageType {
  const raw = evt.raw_event || {}

  // 1) monta o array de attachments
  const attachments: attachType[] = []
  if (raw.mediaUrl || raw.url) {
    attachments.push({
      icon: raw.iconUrl || '',
      file: raw.filename || raw.url.split('/').pop() || '',
      fileSize: raw.fileSize || '—',
    })
  }

  // 2) separa o texto da URL de mídia para msg
  let msg = ''
  if (raw.message || raw.body || raw.text) {
    msg = raw.message || raw.body || raw.text || ''
  } else if (raw.mediaUrl || raw.url) {
    msg = raw.mediaUrl || raw.url || ''
  }

  return {
    id: raw.id || raw.messageId || `unknown-${evt.received_at}`,
    senderId: raw.from || raw.sender || 'unknown',
    type: msg && !raw.mediaUrl && !raw.url ? 'text' : 'image',
    msg,
    attachment: attachments,      // ← sempre um array
    createdAt: raw.timestamp || evt.received_at
  }
}

const ChatContent: React.FC<ChatContentProps> = ({ toggleChatSidebar }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'))

  // Redux state
  const chats = useSelector((state) => state.chatReducer.chats) as ChatsType[]
  const activeId = useSelector((state) => state.chatReducer.chatContent) as string | number
  const chatDetails = chats.find((c) => c.id === activeId)

  // Local state for messages
  const [conversationMessages, setConversationMessages] = useState<MessageType[]>([])

  // Redirect if not authenticated
  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      router.push('/auth/login')
    }
  }, [router])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_CLIENT}/v1/history/whatsapp2`)
      .then(res => res.json())
      .then((data: { raw_event: any; received_at: string }[]) => {
        // 1) Filtra eventos válidos
        const valid = data.filter(evt => evt.raw_event != null)
  
        // 2) Agrupa por senderId
        const chatsMap: Record<string, Omit<ChatsType, 'excerpt' | 'recent'>> = {}
        valid.forEach(evt => {
          const raw = evt.raw_event
          const senderId = raw.from || raw.sender || 'unknown'
  
          // Se ainda não existe este chat, inicializa
          if (!chatsMap[senderId]) {
            chatsMap[senderId] = {
              id: senderId,
              name: raw.fromName       // ou raw.contact?.name, depende do seu payload
                || raw.profileName     // outra opção, ajuste conforme payload
                || senderId,
              thumb: raw.profilePic    // ou raw.avatarUrl, ajuste conforme payload
                || '/images/profile/default.jpg',
              status: raw.presence     // ou 'offline' se não vier no histórico
                || 'offline',
              messages: []
            }
          }

          // Mapeia a mensagem
          const msg: MessageType = mapRawEventToChat(evt)
          chatsMap[senderId].messages.push(msg)
        })
  
        // 3) Constrói o array final de ChatsType
        const initialChats: ChatsType[] = Object.values(chatsMap).map(chat => ({
          ...chat,
          // excerpt = última mensagem
          excerpt: chat.messages[chat.messages.length - 1]?.msg || '',
          // recent só pra satisfazer o tipo, aqui pode usar boolean ou date
          recent: true
        }))
  
        dispatch(getChats(initialChats))
      })
      .catch(err => console.error('Erro ao carregar histórico:', err))
  
    const socket = dispatch(subscribeChats())
    return () => {
      socket.close()
    }
  }, [dispatch])

  // Sync local messages when chat changes or new messages arrive
  useEffect(() => {
    setConversationMessages(chatDetails ? chatDetails.messages : [])
  }, [chatDetails?.messages])

  // If no chat selected, show placeholder
  if (!chatDetails) {
    return (
      <Box display="flex" alignItems="center" p={2}>
        {!lgUp && <IconMenu2 stroke={1.5} onClick={toggleChatSidebar} />}
        <Typography variant="h4">Select Chat</Typography>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
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
        <Stack direction="row" spacing={1}>
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

      {/* Messages */}
      <Box display="flex">
        <Box width="100%">
          <Box sx={{ height: '650px', overflow: 'auto', maxHeight: '800px' }} p={3}>
            {conversationMessages.map((msg) => (
              <Box key={`${msg.id}-${msg.createdAt}`} mb={2}>
                {msg.senderId === chatDetails.id ? (
                  <Box display="flex">
                    <ListItemAvatar>
                      <Avatar alt={chatDetails.name} src={chatDetails.thumb} sx={{ width: 40, height: 40 }} />
                    </ListItemAvatar>
                    <Box>
                      <Typography variant="body2" color="grey.400" mb={1}>
                        {chatDetails.name}, {msg.createdAt ? formatDistanceToNowStrict(new Date(msg.createdAt), { addSuffix: false }) : ''} ago
                      </Typography>
                      {msg.type === 'text' ? (
                        <Box p={1} sx={{ backgroundColor: 'grey.100', mr: 'auto', maxWidth: 320 }}>
                          {msg.msg}
                        </Box>
                      ) : (
                        <Box sx={{ overflow: 'hidden', lineHeight: 0 }} mb={1}>
                          <Image src={msg.msg} alt="attach" width={150} height={150} />
                        </Box>
                      )}
                    </Box>
                  </Box>
                ) : (
                  <Box display="flex" flexDirection="column" alignItems="flex-end">
                    <Typography variant="body2" color="grey.400" mb={1}>
                      {msg.createdAt ? formatDistanceToNowStrict(new Date(msg.createdAt), { addSuffix: false }) : ''} ago
                    </Typography>
                    {msg.type === 'text' ? (
                      <Box p={1} sx={{ backgroundColor: 'primary.light', ml: 'auto', maxWidth: 320 }} mb={1}>
                        {msg.msg}
                      </Box>
                    ) : (
                      <Box sx={{ overflow: 'hidden', lineHeight: 0 }} mb={1}>
                        <Image src={msg.msg} alt="attach" width={250} height={165} />
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>
        <Box flexShrink={0}>
          <ChatInsideSidebar isInSidebar={lgUp} chat={chatDetails} />
        </Box>
      </Box>
    </Box>
  )
}

export default ChatContent

