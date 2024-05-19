import { useState, useEffect, useRef } from "react";
import ConversationDrawer from "./ConversationDrawer";
import { useSelector } from "react-redux";
import Avatar from "../../../components/common/Avatar";
import icons from "../../../components/shared/icon";
import ChatInput from "./ChatInput";
import LandingPage from "../../../components/common/LandingPage";
import Message from "./Message";
import { formatDate } from "../../../helpers/formatDate";
import { handleGetFriendList } from "../../../components/shared/api";

export default function ChatBox() {
    const currentConversation = useSelector((state) => state.currentConversation);
    const listMessage = useSelector((state) => state.listMessage);

    const [isShowDrawer, setShowDrawer] = useState(false);
    const messagesEndRef = useRef(null);

    const [isFriend, setIsFriend] = useState(false)

    useEffect(() => {
        scrollToBottom();
    }, [listMessage]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        if (currentConversation.type == 'group') {
            setIsFriend(true)
            return
        }
        else if (Object.keys(currentConversation) == 0) {
            return
        }
        handleGetFriendList()
            .then((response) => {
                let found = false;
                response.data.data.map(friend => {
                    if (friend.userId === currentConversation.members[1]._id) {
                        found = true
                        return
                    }
                })
                if (found) {
                    setIsFriend(true)
                }
                else
                    setIsFriend(false)
            })
    }, [currentConversation])

    let prevDate = null;

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            {Object.keys(currentConversation).length === 0 ? (
                <LandingPage />
            ) : (
                <div style={{ width: '100%', height: '100%' }} className="bg-gray-100 flex justify-between">
                    <div className="flex flex-col justify-between items-center w-full h-full min-w-[500]">
                        <div className="flex justify-between w-full h-24 p-3 items-center bg-pink-300 shadow-xl">
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
                            {listMessage.map((message, index) => {
                                const showDateDivider = prevDate !== formatDate(message.createdAt);
                                prevDate = formatDate(message.createdAt);

                                return (
                                    <div key={message._id} className="w-auto h-auto">
                                        {showDateDivider && (
                                            <div style={{ width: '100%', height: 40, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <div style={{ width: 100, height: 30, backgroundColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: '30%', borderRadius: 30, marginTop: 10, marginBottom: 10, color: 'white' }}>{prevDate}</div>
                                            </div>
                                        )}
                                        <div className="mt-2 mb-2 h-[auto]">
                                            <Message key={message._id} data={message} />
                                        </div>
                                    </div>
                                );

                            })}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="w-full">
                            {/*Input */}
                            {isFriend && <ChatInput />}

                        </div>
                    </div>
                    {isShowDrawer && <ConversationDrawer />}
                </div>
            )}
        </div>
    );
}
