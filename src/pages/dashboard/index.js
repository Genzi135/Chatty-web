import { useDispatch, useSelector } from "react-redux";
import Chat from "./chatBox";
import SideBar from "./sideBar/SideBar";
import SubSideBar from "./sideBar/SubSideBar";
import Contact from "./contact";
import { useSocket } from "../../hooks/context/socket";
import { useEffect } from "react";
import { addMessage, setListConversation, setListMessage } from "../../hooks/redux/reducer";
import ConversationSkeleton from "../../components/common/ConversationSkeleton";
import { ToastContainer } from "react-toastify";
import 'react-toastify/ReactToastify.css'

export default function Dashboard() {
    const viewState = useSelector(state => state.view)
    const { socket } = useSocket()
    const currentConversation = useSelector(state => state.currentConversation)
    const listConversation = useSelector(state => state.listConversation)
    const listMessage = useSelector(state => state.listMessage)

    const dispatch = useDispatch()

    useEffect(() => {
        socket.on("message:receive", (response) => {
            if (currentConversation._id === response.conversation._id) {
                //dispatch(updateConversationLastMessage(response.conversation._id, response));
                dispatch(addMessage(response))
            }

            const newList = listConversation.map(conversation => {
                if (conversation._id === response.conversation._id) {
                    if (conversation._id === currentConversation._id) {
                        return { ...conversation, lastMessage: response, isReadMessage: true };
                    }
                    return { ...conversation, lastMessage: response, isReadMessage: false };
                }
                return conversation;
            });

            dispatch(setListConversation(newList))
        });
    }, [currentConversation]);

    useEffect(() => {
        socket.on("message:deleted", (response) => {
            const newList = listMessage.map((e) => {
                if (response.id === e._id) {
                    return { ...e, content: "This message has been deleted", isDelete: true }
                }
                return e;
            })
            dispatch(setListMessage(newList))
        })
    }, [listMessage])

    useEffect(() => {
        socket.on("message:notification", (data) => {
            if (data) {
                if (currentConversation._id === data.conversationId) {
                    console.log(data.conversation.members)
                }
            }
        })
    })

    return (
        <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', position: 'relative' }}>
            <SideBar />
            <SubSideBar />
            {viewState.subSideBar === 'chat' && <Chat />}
            {viewState.subSideBar === "contact" && <Contact />}
            <div className="absolute bottom-2 right-2"><ToastContainer /></div>
        </div>
    )
}