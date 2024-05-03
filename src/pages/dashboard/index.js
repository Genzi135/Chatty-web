import { useDispatch, useSelector } from "react-redux";
import Chat from "./chatBox";
import SideBar from "./sideBar/SideBar";
import SubSideBar from "./sideBar/SubSideBar";
import Contact from "./contact";
import { useSocket } from "../../hooks/context/socket";
import { useEffect } from "react";
import { addMessage } from "../../hooks/redux/reducer";

export default function Dashboard() {
    const viewState = useSelector(state => state.view)
    const {socket} = useSocket()
    const currentConversation = useSelector(state => state.currentConversation)

    const dispatch = useDispatch()

    useEffect(() => {
        socket.on("message:receive", (response, currentConversation) => {
            console.log(currentConversation)
            if (currentConversation._id === response.conversation._id) {
                //dispatch(updateConversationLastMessage(response.conversation._id, response));
                dispatch(addMessage(response))
            }
            else {
                //dispatch(updateConversationLastMessage(response.conversation._id, response));
            }
        });
    }, [currentConversation])

    return (
        <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center' }}>
            <SideBar />
            <SubSideBar />
            {viewState.subSideBar === 'chat' && <Chat />}
            {viewState.subSideBar === "contact" && <Contact />}
        </div>
    )
}