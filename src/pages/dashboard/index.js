import { useDispatch, useSelector } from "react-redux";
import Chat from "./chatBox";
import SideBar from "./sideBar/SideBar";
import SubSideBar from "./sideBar/SubSideBar";
import Contact from "./contact";
import { useSocket } from "../../hooks/context/socket";
import { useEffect } from "react";
import { addMessage, setListConversation } from "../../hooks/redux/reducer";

export default function Dashboard() {
    const viewState = useSelector(state => state.view)
    const {socket} = useSocket()
    const currentConversation = useSelector(state => state.currentConversation)
    const listConversation = useSelector(state => state.listConversation)

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

            console.log(newList)

            dispatch(setListConversation(newList))
        });

        socket.on("message:delete", (response) => {
            console.log(response)
        })
    }, [currentConversation]);

    return (
        <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center' }}>
            <SideBar />
            <SubSideBar />
            {viewState.subSideBar === 'chat' && <Chat />}
            {viewState.subSideBar === "contact" && <Contact />}
        </div>
    )
}