'use client'



import { FullMessageType } from "@/app/types"
import { useEffect, useRef, useState } from "react"
import useConversation from "@/app/hooks/useConversation"
import MessageBox from "./MessageBox"
import axios from "axios"
import { pusherClient } from "@/app/libs/pusher"
import { find, set, update } from "lodash"

interface BodyProps {
  initialMessages: FullMessageType[]
}

const Body: React.FC<BodyProps> = ({initialMessages}) => {

  const [messages,setMessages] = useState(initialMessages)
  const bottomref = useRef<HTMLDivElement>(null) 

  const { conversationId} = useConversation();

  useEffect(()=>{
    axios.post(`/api/conversations/${conversationId}/seen`)
  },[conversationId])

  useEffect(()=>{
    pusherClient.subscribe(conversationId)
    bottomref?.current?.scrollIntoView()

    const messageHandler = (message:FullMessageType)=>{
      axios.post(`/api/conversations/${conversationId}/seen`)
      setMessages((current)=>{
        if(find(current,{id:message.id})) return current

        return [...current,message]
      });

      bottomref?.current?.scrollIntoView()

    }

    const updateMessageHandler  = (newMessages: FullMessageType)  => {

      setMessages((current)=> current.map((currentMessage)=>{
          if(currentMessage.id === newMessages.id) return newMessages 

          return currentMessage
      }))




      // axios.post(`/api/conversations/${conversationId}/seen`)
      // setMessages((current)=>{
      //   const index = current.findIndex((message)=>message.id === message.id)
      //   if(index === -1) return current

      //   const newMessages = [...current]
      //   set(newMessages,index,'seen',true)
      //   return newMessages
      // });
    }

    pusherClient.bind('messages:new', messageHandler)
    pusherClient.bind('message:update',updateMessageHandler)

    return ()=>{
      pusherClient.unsubscribe(conversationId)
      pusherClient.unbind('messages:new', messageHandler)
      pusherClient.unbind('message:update',updateMessageHandler)
    }
  },[conversationId])

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message,i)=>(
          <MessageBox 
            isLast={i === messages.length - 1}
            key={message.id}
            data={message}
          />
      ))}
      <div ref={bottomref} className="pt-24"/>
    </div>
  )
}

export default Body
