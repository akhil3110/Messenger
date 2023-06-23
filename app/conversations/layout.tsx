
import { get } from "http"
import Sidebar from "../components/sidebar/Sidebar"
import ConversationList from "./components/ConversationList"
import getConversations from "../actions/getConversation"
import getsUsers from "../actions/getUser"

export default async function ConversationsLayout ({children} :{
    children: React.ReactNode
}){

    const conversations = await getConversations();
    const users = await getsUsers();
    return(
        <Sidebar>
            <div className="h-full">
                <ConversationList 
                    users={users}
                    initialItems={conversations}
                />
                {children}
            </div>
        </Sidebar>
    )
}