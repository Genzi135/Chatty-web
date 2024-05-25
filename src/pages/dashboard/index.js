/* eslint-disable no-unused-vars */
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
import { MdViewList } from "react-icons/md";
import { getListConversation } from "../../components/shared/api";

export default function Dashboard() {
    const viewState = useSelector(state => state.view);
    const currentUser = useSelector(state => state.currentUser)
    const { socket } = useSocket();
    const currentConversation = useSelector(state => state.currentConversation);
    const listConversation = useSelector(state => state.listConversation);
    const listMessage = useSelector(state => state.listMessage);
    const requestList = useSelector(state => state.request)

    const dispatch = useDispatch();

    const currentConversationRef = useRef(currentConversation);
    const listConversationRef = useRef(listConversation);
    const listMessageRef = useRef(listMessage);
    const currentUserRef = useRef(currentUser);

    useEffect(() => {
        currentUserRef.current = currentUser;
        currentConversationRef.current = currentConversation;
        listConversationRef.current = listConversation;
        listMessageRef.current = listMessage;
    }, [currentConversation, listConversation, listMessage, currentUser]);

    useEffect(() => {
        const handleReceiveMessage = (response) => {
            console.log(response)
            const listIds = listConversationRef.current.map(e => e._id)
            if (!listIds.includes(response.conversation._id)) return

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

            let list = [], receiver = {};
            newList.map(conversation => {
                if (conversation._id !== response.conversation._id) {
                    list.push(conversation);
                } else receiver = conversation
            })

            list = [receiver, ...list]

            dispatch(setListConversation(list));
        };

        const handleDeleteMessage = (response) => {
            if (response) {
                const newList = listMessageRef.current.map((e) => {
                    if (response.id === e._id) {
                        return { ...e, content: "This message has been deleted", isDelete: true };
                    }
                    if (e.parent) {
                        if (response.id === e.parent._id) {
                            if (e.parent.attachments.length > 0) {
                                return { ...e, parent: { attachments: [], ...e.parent, content: "This message has been deleted", isDelete: true } };
                            }
                            return { ...e, parent: { ...e.parent, content: "This message has been deleted", isDelete: true } };
                        }
                    }
                    return e
                });

                dispatch(setListMessage(newList));
                if (newList[newList.length - 1]._id === response.id) {
                    getListConversation(dispatch)
                }
            }
        };

        const handleNotification = (data) => {

            if (data) {
                if (currentConversationRef.current._id === data.conservationId) {

                    dispatch(addMessage(data.messages[0]));
                    toast(data.messages[0].content);
                    const newList = listConversationRef.current.map(e => {
                        if (e._id === data.conservationId) {
                            return { ...data.conversation }
                        }
                        return e
                    })
                    dispatch(setListConversation(newList))
                    dispatch(setCurrentConversation(data.conversation));

                }
                else if (currentConversationRef.current._id !== data.conservationId) {

                    if ((!listConversationRef.current.some((e) => e._id === data.conservationId) && (data.conversation.members.some((e) => e._id === currentUserRef.current._id)))) {
                        const newList = [data.conversation, ...listConversationRef.current]
                        toast("New conversation!")
                        dispatch(setListConversation(newList))
                    }
                }
            }

        };

        const handleRemoveMember = (data) => {
            if (data.members.includes(currentUserRef.current._id)) {
                const newList = listConversationRef.current.filter((e) => e._id !== data.conservationId)

                toast("Removed from a conversation")
                dispatch(setListConversation(newList))
                if (currentConversationRef.current._id === data.conservationId) {
                    dispatch(setCurrentConversation({}))
                }
            }
        }

        const handleDisbandConversation = (data) => {
            if (listConversationRef.current.some(e => e._id === data.conservationId)) {
                if (data.conservationId === currentConversationRef.current._id) {
                    dispatch(setCurrentConversation({}));
                }
                const newList = listConversationRef.current.filter(e => e._id !== data.conservationId);
                dispatch(setListConversation(newList));
                toast("Group has been disbanded");
            } else {
                console.log(" ");
            }
        };

        const handleNewConversation = (data) => {
            if (data.conversation.members.some(e => e._id === currentUserRef.current._id)) {
                const newList = [data.conversation, ...listConversationRef.current];
                dispatch(setListConversation(newList));
                toast("Create new group successful")
            } else {
                console.log('nothing');
            }

        };

        const handleRequest = (data) => {
            if (currentUserRef.current._id === data.userId) {
                toast("New friend request")
            }
        }

        const handleReject = (data) => {
            console.log("request reject:", data);
            if (currentUserRef.current._id === data.userId) {
                toast(`A friend had been rejected`)
            }
        }

        const handleAccept = (data) => {
            if (currentUserRef.current._id === data.userId) {
                toast(`${data.userInfo.name} accepted friend request`)
            }
            getListConversation(dispatch)
        }

        const handleCancel = (data) => {
            console.log("cancel Data:", data);
        }


        socket.on("message:receive", handleReceiveMessage);
        socket.on("message:deleted", handleDeleteMessage);
        socket.on("message:notification", handleNotification);
        socket.on("conversation:disband", handleDisbandConversation);
        socket.on("conversation:new", handleNewConversation);
        socket.on('conversation:removeMembers', handleRemoveMember);

        socket.on('friend:request', handleRequest)
        socket.on('friend:reject', handleReject)
        socket.on('friend:accept', handleAccept)
        socket.on('friend:cancel', handleCancel)

        return () => {
            socket.off("message:receive", handleReceiveMessage);
            socket.off("message:deleted", handleDeleteMessage);
            socket.off("message:notification", handleNotification);
            socket.off("conversation:disband", handleDisbandConversation);
            socket.off("conversation:new", handleNewConversation);
            socket.off('conversation:removeMembers', handleRemoveMember);

            socket.off('friend:request', handleRequest)
            socket.off('friend:reject', handleReject)
            socket.off('friend:accept', handleAccept)
            socket.off('friend:cancel', handleCancel)
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
