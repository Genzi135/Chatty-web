import { useDispatch, useSelector } from "react-redux";
import Chat from "./chatBox";
import SideBar from "./sideBar/SideBar";
import SubSideBar from "./sideBar/SubSideBar";
import Contact from "./contact";
import { useSocket } from "../../hooks/context/socket";
import { useEffect, useRef } from "react";
import { addMessage, setCurrentConversation, setListConversation, setListMessage } from "../../hooks/redux/reducer";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/ReactToastify.css';

export default function Dashboard() {
    const viewState = useSelector(state => state.view);
    const { socket } = useSocket();
    const currentConversation = useSelector(state => state.currentConversation);
    const listConversation = useSelector(state => state.listConversation);
    const listMessage = useSelector(state => state.listMessage);

    const dispatch = useDispatch();

    const currentConversationRef = useRef(currentConversation);
    const listConversationRef = useRef(listConversation);
    const listMessageRef = useRef(listMessage);

    useEffect(() => {
        currentConversationRef.current = currentConversation;
        listConversationRef.current = listConversation;
        listMessageRef.current = listMessage;
    }, [currentConversation, listConversation, listMessage]);

    useEffect(() => {
        const handleReceiveMessage = (response) => {
            if (currentConversationRef.current._id === response.conversation._id) {
                dispatch(addMessage(response));
            }

            const newList = listConversationRef.current.map(conversation => {
                if (conversation._id === response.conversation._id) {
                    if (conversation._id === currentConversationRef.current._id) {
                        return { ...conversation, lastMessage: response, isReadMessage: true };
                    }
                    return { ...conversation, lastMessage: response, isReadMessage: false };
                }
                return conversation;
            });

            dispatch(setListConversation(newList));
        };

        const handleDeleteMessage = (response) => {
            const newList = listMessageRef.current.map((e) => {
                if (response.id === e._id) {
                    return { ...e, content: "This message has been deleted", isDelete: true };
                }
                return e;
            });
            dispatch(setListMessage(newList));
        };

        const handleNotification = (data) => {
            if (currentConversationRef.current._id) {
                if (data) {
                    if (currentConversationRef.current._id === data.conservationId) {
                        dispatch(addMessage(data.messages[0]));
                        toast(data.messages[0].content);
                        dispatch(setCurrentConversation(data.conversation));
                    }
                }
            }
        };

        const handleDisbandConversation = (data) => {
            if (data.conservationId === currentConversationRef.current._id) {
                dispatch(setCurrentConversation({}));
            }
            const newList = listConversationRef.current.filter(e => e._id !== data.conservationId);
            dispatch(setListConversation(newList));
            toast("Group had been disbanded");
        };

        const handleNewConversation = (data) => {
            const newList = [data.conversation, ...listConversationRef.current];
            dispatch(setListConversation(newList));
            toast("Create new group successful")
        };

        socket.on("message:receive", handleReceiveMessage);
        socket.on("message:deleted", handleDeleteMessage);
        socket.on("message:notification", handleNotification);
        socket.on("conversation:disband", handleDisbandConversation);
        socket.on("conversation:new", handleNewConversation);

        return () => {
            socket.off("message:receive", handleReceiveMessage);
            socket.off("message:deleted", handleDeleteMessage);
            socket.off("message:notification", handleNotification);
            socket.off("conversation:disband", handleDisbandConversation);
            socket.off("conversation:new", handleNewConversation);
        };
    }, [socket, dispatch]);

    return (
        <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', position: 'relative' }}>
            <SideBar />
            <SubSideBar />
            {viewState.subSideBar === 'chat' && <Chat />}
            {viewState.subSideBar === "contact" && <Contact />}
            <div className="absolute bottom-2 right-2"><ToastContainer /></div>
        </div>
    );
}
