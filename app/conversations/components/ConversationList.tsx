'use client'


import useConversation from "@/app/hooks/useConversation"
import { FullConversationType } from "@/app/types"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import clsx from "clsx"
import { MdOutlineGroupAdd } from "react-icons/md"
import ConversationBox from "./ConversationBox"
import GroupChatModal from "./GroupChatModal"
import { User } from "@prisma/client"
import { useSession } from "next-auth/react"
import { pusherClient } from "@/app/libs/pusher"
import { find, update } from "lodash"


interface ConversationListProps {
    initialItems: FullConversationType[]
    users: User[]
}


const ConversationList: React.FC<ConversationListProps> = ({initialItems,users}) => {
    
    const [items, setItems] = useState(initialItems)
    const router = useRouter()
    const [isModelOpen, setModelOpen] = useState(false)
    const session = useSession()

    
    const {conversationId , isOpen} = useConversation()

    const pusheKey = useMemo(()=>{
        return session.data?.user?.email
    },[session.data?.user?.email])

    useEffect(()=>{
        if(!pusheKey) return

        pusherClient.subscribe(pusheKey);

        const newHandler = (consversation: FullConversationType) =>{
            setItems((current)=>{
                if(find(current,{id:consversation.id})) return current

                return [consversation,...current]
            })
        }

        const updateHandler= (consversation: FullConversationType) =>{
            setItems((current)=> current.map((currentConversation)=>{
                if(currentConversation.id === consversation.id) {
                    return {
                        ...currentConversation,
                        messages: consversation.messages,
                    }
                }
                return currentConversation
            }))
        }

        const deleteHandler = (consversation: FullConversationType) =>{
            setItems((current)=>{
                return [...current.filter((convo)=> convo.id !== consversation.id)]
            })

            if(conversationId === consversation.id){
                router.push('/conversations')
            }
        }

        pusherClient.bind('conversation:new',newHandler)
        pusherClient.bind('conversation:update',updateHandler)
        pusherClient.bind('conversation:remove',deleteHandler)

        return ()=>{
            pusherClient.unsubscribe(pusheKey)
            pusherClient.unbind('conversation:new',newHandler)
            pusherClient.unbind('conversation:update',updateHandler)
            pusherClient.unbind('conversation:remove',deleteHandler)
        }
    },[pusheKey,conversationId,router])

    return (
    <> 
    <GroupChatModal 
        users={users}
        isOpen={isModelOpen}
        onClose={() => setModelOpen(false)}
    />
    <aside
        className={clsx(`
            fixed
            inset-y-0
            pb-20
            lg:pb-0
            lg:left-20
            lg:w-80
            lg:block
            overflow-y-auto
            border-r
            border-gray-200
            `,
            isOpen? 'hidden' : 'block w-full left-0'
            )}
    >
        <div className="px-5">
            <div className="flex justify-between mb-4 pt-4">
                <div className="text-2xl font-bold text-neutral-800">
                    Messages
                </div>
                <div  
                    className="
                        rounded-full
                        p-2
                        bg-gray-100
                        text-gray-600
                        hover:opacity-80
                        cursor-pointer
                        trasition   "
                        onClick={() => setModelOpen(true)}
                >
                    <MdOutlineGroupAdd size={20}  />
                </div>
            </div>
            {items.map((item) => (
                <ConversationBox 
                    key={item.id}
                    data={item}
                    selected = { conversationId === item.id}
                />   
            ))}
        </div>
    </aside>
    </>
  )
}

export default ConversationList
