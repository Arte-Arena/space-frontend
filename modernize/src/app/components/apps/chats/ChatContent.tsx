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
import {
  IconMenu2,
  IconPhone,
  IconLayoutSidebarRightCollapse,
  IconLayoutSidebarRightExpand,
} from '@tabler/icons-react'
import Image from 'next/image'

import ChatInsideSidebar from './ChatInsideSidebar'
import type { ChatsType, MessageType, attachType } from '../../../(DashboardLayout)/types/apps/chat'

interface ChatContentProps {
  toggleChatSidebar: () => void
}

const numeroDoSistema = process.env.NEXT_PUBLIC_NUMERO_WHATSAPP?.replace(/\D/g, '') || '551123371548'

export function mapRawEventToChat(evt: { raw_event: any; received_at: string }): MessageType {
  const raw = evt.raw_event || {}
  const entry = raw.entry?.[0]
  const change = entry?.changes?.find((c: any) => c.field === 'messages')
  const msgObj = change?.value?.messages?.[0]
  const from = msgObj?.from || raw.from || raw.sender || 'unknown'
  const to = msgObj?.to || raw.to || 'unknown'
  const msgBody = msgObj?.text?.body || raw.message || raw.body || raw.text || ''
  const msgType = msgObj?.type || (msgBody && !raw.mediaUrl && !raw.url ? 'text' : 'image')
  const timestamp: string = msgObj?.timestamp
    ? new Date(Number(msgObj.timestamp) * 1000).toISOString()
    : raw.timestamp || evt.received_at

  const attachments: attachType[] = []
  if (raw.mediaUrl || raw.url) {
    attachments.push({
      icon: raw.iconUrl || '',
      file: raw.filename || raw.url.split('/').pop() || '',
      fileSize: raw.fileSize || '—',
    })
  }

  return {
    id: msgObj?.id || raw.id || `unknown-${evt.received_at}`,
    senderId: from,
    type: msgType,
    msg: msgBody,
    attachment: attachments,
    createdAt: timestamp,
    to,
  }
}

const ChatContent: React.FC<ChatContentProps> = ({ toggleChatSidebar }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'))

  const chats = useSelector((state) => state.chatReducer.chats) as ChatsType[]
  const activeId = useSelector((state) => state.chatReducer.chatContent) as string | number
  const chatDetails = chats.find((c) => c.id === activeId)

  const [conversationMessages, setConversationMessages] = useState<MessageType[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(lgUp)

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      router.push('/auth/login')
    }
  }, [router])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_CLIENT}/v1/history/whatsapp2`)
      .then(res => res.json())
      .then((data: { raw_event: any; received_at: string }[]) => {
        const valid = data.filter(evt => evt.raw_event != null)
        const chatsMap: Record<string, Omit<ChatsType, 'excerpt' | 'recent'>> = {}
        valid.forEach(evt => {
          const msg: MessageType = mapRawEventToChat(evt)
          const participantId = msg.senderId === numeroDoSistema ? msg.to! : msg.senderId
          if (!participantId) return

          const key = String(participantId)
          if (!chatsMap[participantId]) {
            chatsMap[participantId] = {
              id: participantId,
              name: key,
              thumb: '/images/profile/default.jpg',
              status: 'offline',
              messages: [],
            }
          }

          chatsMap[participantId].messages.push(msg)
        })

        const initialChats: ChatsType[] = Object.values(chatsMap).map(chat => ({
          ...chat,
          excerpt: chat.messages[chat.messages.length - 1]?.msg || '',
          recent: true,
        }))

        dispatch(getChats(initialChats))
      })
      .catch(err => console.error('Erro ao carregar histórico:', err))

    const socket = dispatch(subscribeChats())
    return () => {
      socket.close()
    }
  }, [dispatch])

  useEffect(() => {
    setConversationMessages(chatDetails ? chatDetails.messages : [])
  }, [chatDetails?.messages])

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
      <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
        <Box display="flex" alignItems="center">
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
        </Box>

        <Stack direction="row" spacing={1}>
          <IconButton aria-label="phone"><IconPhone stroke={1.5} /></IconButton>
          {lgUp && (
            <IconButton aria-label="toggle sidebar" onClick={() => setIsSidebarOpen((prev) => !prev)}>
              {isSidebarOpen ? <IconLayoutSidebarRightCollapse stroke={1.5} /> : <IconLayoutSidebarRightExpand stroke={1.5} />}
            </IconButton>
          )}
        </Stack>
      </Box>
      <Divider />

      {/* Messages + Sidebar */}
      <Box display="flex">
        <Box width="100%">
          <Box sx={{ height: '650px', overflow: 'auto', maxHeight: '800px' }} p={3}>
            {conversationMessages.map((msg) => {
              const isMyMessage = msg.senderId === numeroDoSistema
              return (
                <Box key={`${msg.id}-${msg.createdAt}`} mb={2}>
                  {isMyMessage ? (
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
                  ) : (
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
                  )}
                </Box>
              )
            })}
          </Box>
        </Box>

        {/* Sidebar lateral (pode ser escondido) */}
        {isSidebarOpen && (
          <Box flexShrink={0}>
            <ChatInsideSidebar isInSidebar={true} chat={chatDetails} />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ChatContent
