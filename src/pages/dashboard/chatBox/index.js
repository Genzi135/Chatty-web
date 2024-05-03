import { useState, useEffect, useRef } from "react";
import ConversationDrawer from "./ConversationDrawer";
import { useSelector } from "react-redux";
import Avatar from "../../../components/common/Avatar";
import icons from "../../../components/shared/icon";
import ChatInput from "./ChatInput";
import LandingPage from "../../../components/common/LandingPage";
import Message from "./Message";

export default function ChatBox() {
    const currentConversation = useSelector((state) => state.currentConversation);
    const listMessage = useSelector((state) => state.listMessage);

    const [isShowDrawer, setShowDrawer] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [listMessage]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            {Object.keys(currentConversation).length === 0 ? (
                <LandingPage />
            ) : (
                <div style={{ width: '100%', height: '100%' }} className="bg-gray-100 flex justify-between">
                    <div className="flex flex-col justify-between items-center w-full h-full min-w-[500]">
                        <div className="flex justify-between w-full h-44 p-3 items-center bg-pink-300 shadow-xl">
                            {/*Header*/}
                            <div className="flex gap-5 items-center">
                                <Avatar link={currentConversation.image} />
                                <label className="font-semibold text-lg">
                                    {currentConversation.name}
                                </label>
                            </div>
                            <div>
                                {isShowDrawer ? (
                                    <div className="flex justify-center items-center p-2 text-white rounded-lg bg-pink-500" onClick={() => setShowDrawer(!isShowDrawer)}>
                                        {icons.sideBarOpen}
                                    </div>
                                ) : (
                                    <div className="text-white" onClick={() => setShowDrawer(!isShowDrawer)}>
                                        {icons.sideBarClose}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col w-full h-full bg-gray-200 overflow-auto overflow-y-visible p-2">
                            {/*Body */}
                            {listMessage.map((message, index) => (
                                <Message key={index} data={message} />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="w-full">
                            {/*Input */}
                            <ChatInput />
                        </div>
                    </div>
                    {isShowDrawer && <ConversationDrawer />}
                </div>
            )}
        </div>
    );
}
