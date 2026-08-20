import { useEffect } from "react";
import { useWallpaper } from "../context/wallpaper"
import { useSelectedConversation } from "../hook/useSelectedConversation";
import { useChatStore } from "../store/useChatStore";
import ChatSidebar from "../component/chat/ChatSidebar";
import { ChatHeader } from "../component/chat/ChatHeader";
import { MessageList } from "../component/chat/MessageList";
import { ChatComposer } from "../component/chat/ChatComposer";


const ChatPage = () => {
  const {frameStyle}=useWallpaper();
  const {getConversations,getMessages,getUsers, subscribeToMessage, unsubscribeFromMessage}=useChatStore()
const { activeConversation, activeConversationId,isLargeScreen}=useSelectedConversation()


useEffect(()=>{
  getUsers();
  getConversations()
},[getConversations,getUsers]);
useEffect(()=>{
  if(!activeConversationId) return;
  getMessages(activeConversationId);
  subscribeToMessage(activeConversationId);
  return ()=>unsubscribeFromMessage()
},[getMessages,activeConversationId,subscribeToMessage,unsubscribeFromMessage])
  return (
  <div className="flex h-dvh flex-col overflow-hidden p-2 sm:p-3 md:p-8" style={frameStyle}>
      <div className="mx-auto flex w-full max-w-6xl flex-1 overflow-hidden rounded-2xl border border-border bg-background text-foreground">
        <ChatSidebar />

        <div
          className={`flex-1 flex-col overflow-hidden ${
            !isLargeScreen && !activeConversationId ? "hidden lg:flex" : "flex"
          }`}
        >
          <ChatHeader />
          <MessageList />

          {activeConversation ? <ChatComposer /> : null}
        </div>
      </div>
    </div>
  )
}

export default ChatPage