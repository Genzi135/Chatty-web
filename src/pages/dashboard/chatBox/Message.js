import { useCallback, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import icons from "../../../components/shared/icon";
import { formatTime } from "../../../helpers/formatDate";
import { setListMessage, setReplyMessage, setSelectedMessage } from "../../../hooks/redux/reducer";
import { BsFileZip, BsFiletypeDoc, BsFiletypeDocx, BsFiletypePdf, BsFiletypePpt, BsFiletypePptx, BsFiletypeTxt, BsFiletypeXls, BsFiletypeXlsx } from "react-icons/bs";
import ForwardModal from "./ForwardModal";
import ModalConfirm from "../../../components/common/ModalConfirm";
import { handleDeleteMessage } from "../../../components/shared/api";
import { useSocket } from "../../../hooks/context/socket";
import HeaderModal from "../../../components/common/HeaderModal";
import Button from "../../../components/common/Button";

export default function Message({ data }) {
    const currentUser = useSelector((state) => state.currentUser);
    const listMessage = useSelector((state) => state.listMessage);
    const currentConversation = useSelector((state) => state.currentConversation);
    const [showModalConfirm, setShowModalConfirm] = useState(false);
    const [selectedMessageId, setSelectedMessageId] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [isShowOption, setShowOption] = useState(false);
    const [option, setOption] = useState('');

    const messageRef = useRef(null)

    const { socket } = useSocket()

    const dispatch = useDispatch();

    const onMouseEnter = useCallback(() => {
        setShowOption(true)
    })

    const onMouseLeave = useCallback(() => {
        setShowOption(false)
    })

    const setRepMessage = () => {
        dispatch(setReplyMessage(data))
    }

    const setForwardMessage = () => {
        dispatch(setSelectedMessage(data))
        document.getElementById('ForwardModal').showModal()
    }

    const onClose = (id) => {
        console.log(id);
        id && document.getElementById(id).close();
    }

    const showSelectedImage = (url) => {
        setSelectedImage(url)
    }

    const onClickAttachments = () => {
        const parentID = data.parent?._id;
        const parentElement = document.getElementById(parentID);
        parentElement?.scrollIntoView({ behavior: 'smooth' })
    }

    const executeHandleRemove = (id) => {
        handleDeleteMessage(id);
        const newList = listMessage.map((e) => {
            if (id === e._id) {
                return { ...e, content: "This message has been deleted", isDelete: true }
            }
            return e;
        })
        dispatch(setListMessage(newList))

        socket.emit("message:delete", {
            id: id,
            conversation: currentConversation,
        }, (response) => { console.log(response) })

        setShowModalConfirm(false)
    }
    return (
        <div
            id={data._id}
            ref={messageRef}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={`${data.sender && currentUser._id == data.sender._id ? 'flex flex-row-reverse mb-2 pr-2' : 'flex mb-2 pl-2'}`}>
            {currentUser._id === data.sender._id ? <div>
                {""}</div> : <div className="avatar">
                <div className="avatar rounded-full w-8 h-8 mr-2">
                    <img src={data.avatar} alt="avatar" />
                </div>
            </div>}
            <div className={`${currentUser._id === data.sender._id ? 'w-[auto] max-w-[60%] p-2 bg-pink-200 rounded-lg flex flex-col' : 'w-[auto] max-w-[60%] p-2 bg-slate-300 rounded-lg flex flex-col'}`}>
                <div className="font-semibold p-2">
                    {data.name}
                </div>
                {data.content !== "This message has been deleted" && data.parent && <div onClick={onClickAttachments} className="flex flex-col p-2 bg-pink-50 rounded-lg mb-2 gap-2 border-l-8 border-secondary cursor-pointer">
                    <div>{data.parent.name}</div>
                    {data.parent.attachments && data.parent.attachments.length > 0 && data.parent.content !== "This message has been deleted" ? (data.parent.attachments.map(e => (<div className="h-auto inline-block" key={e.url}>
                        {e.type === 'image' && <div className="flex gap-2 cursor-pointer">
                            {icons.image} image
                            {/* <img onClick={() => showSelectedImage(e.url)} src={e.url} style={{}} alt="" className="cursor-pointer" /> */}
                        </div>}
                        {e.type === 'application' &&
                            <div onClick={() => { window.open(e.url) }} className="cursor-pointer flex items-center bg-gray-200 p-1 rounded-lg">
                                {e.url.split(".").pop() === 'docx' && <BsFiletypeDocx size={40} color='blue' />}
                                {e.url.split(".").pop() === 'doc' && <BsFiletypeDoc size={40} color='blue' />}

                                {e.url.split(".").pop() === 'pptx' && <BsFiletypePptx size={40} color='red' />}
                                {e.url.split(".").pop() === 'ppt' && <BsFiletypePpt size={40} color='red' />}
                                {e.url.split(".").pop() === 'pdf' && <BsFiletypePdf size={40} color='red' />}

                                {e.url.split(".").pop() === 'xlsx' && <BsFiletypeXlsx size={40} color='green' />}
                                {e.url.split(".").pop() === 'xls' && <BsFiletypeXls size={40} color='green' />}

                                {e.url.split(".").pop() === 'rar' && <BsFileZip size={40} color='purple' />}
                                {e.url.split(".").pop() === 'zar' && <BsFileZip size={40} color='purple' />}

                                {e.url.split(".").pop() === 'txt' && <BsFiletypeTxt size={40} color='black' />}
                                <label className="text-ellipsis whitespace-nowrap w-24 ">{e.url.split(".").pop()}</label>
                            </div>
                        }
                        {e.type === 'video' && <div>
                            <video controls width={'auto'}>
                                <source src={e.url} type="video/mp4" />
                            </video>
                        </div>}
                    </div>))) : (<div><label>This message has been deleted</label></div>)}

                </div>}
                <div className=" flex flex-col gap-2">
                    {data.content !== "This message has been deleted" && data.attachments && data.attachments.length > 0 && data.attachments.map(e => (<div className="h-auto inline-block" key={e.url}>
                        {e.type === 'image' && <img onClick={() => showSelectedImage(e.url)} src={e.url} style={{}} alt="" className="cursor-pointer" />}
                        {e.type === 'application' &&
                            <div onClick={() => { window.open(e.url) }} className="cursor-pointer flex items-center bg-gray-100 p-1 rounded-lg">
                                {e.url.split(".").pop() === 'docx' && <BsFiletypeDocx size={40} color='blue' />}
                                {e.url.split(".").pop() === 'doc' && <BsFiletypeDoc size={40} color='blue' />}

                                {e.url.split(".").pop() === 'pptx' && <BsFiletypePptx size={40} color='red' />}
                                {e.url.split(".").pop() === 'ppt' && <BsFiletypePpt size={40} color='red' />}
                                {e.url.split(".").pop() === 'pdf' && <BsFiletypePdf size={40} color='red' />}

                                {e.url.split(".").pop() === 'xlsx' && <BsFiletypeXlsx size={40} color='green' />}
                                {e.url.split(".").pop() === 'xls' && <BsFiletypeXls size={40} color='green' />}

                                {e.url.split(".").pop() === 'rar' && <BsFileZip size={40} color='purple' />}
                                {e.url.split(".").pop() === 'zar' && <BsFileZip size={40} color='purple' />}

                                {e.url.split(".").pop() === 'txt' && <BsFiletypeTxt size={40} color='black' />}
                                <label className="text-ellipsis whitespace-nowrap w-24 ">{e.url.split(".").pop()}</label>
                            </div>
                        }
                        {e.type === 'video' && <div>
                            <video controls width={'auto'}>
                                <source src={e.url} type="video/mp4" />
                            </video>
                        </div>}
                    </div>))}

                </div>
                {data.content &&
                    <div className={`${currentUser._id === data.sender._id ? 'bg-white rounded-lg w-full p-2' : 'bg-white rounded-lg w-full p-2'}`}>
                        {data.content}
                    </div>
                }
                <div className="text-xs p-1">{formatTime(data.createdAt)}</div>
            </div>
            {isShowOption && <div className="ml-1 mr-1 h-auto flex justify-center items-center w-auto gap-1 p-1">
                <div className="flex bg-white rounded-md p-1">
                    <div onClick={() => setForwardMessage()} className="p-1 hover:bg-gray-300 rounded-md tooltip" data-tip="Forward">{icons.forward}</div>
                    <div onClick={() => setRepMessage()} className="p-1 hover:bg-gray-300 rounded-md tooltip" data-tip="Reply">{icons.reply}</div>
                    {currentUser._id === data.sender._id && data.content !== "This message has been deleted" &&
                        <div div className="p-1 hover:bg-red-100 rounded-md tooltip" data-tip="Remove" onClick={() => {
                            setSelectedMessageId(data._id);
                            setShowModalConfirm(true);
                        }}>{icons.removeMessage}</div>
                    }
                </div>
            </div>}
            {
                selectedImage && <div className="fixed bg-black bg-opacity-75 top-0 left-0 w-full h-full flex justify-center items-center z-50">
                    <img src={selectedImage} alt="Selected" className="max-w-full max-h-full" />
                    <div className="absolute top-2 right-2" onClick={() => setSelectedImage('')}>{icons.xCloseAnimation}</div>
                </div>
            }
            <dialog id="ForwardModal" className="modal">
                <ForwardModal onClose={onClose} />
            </dialog>
            <dialog id="modalConfirm" className="modal" open={showModalConfirm}>
                <div className="w-[50%] h-auto flex flex-col justify-between bg-white rounded-lg p-5">
                    <HeaderModal name={'warning'} />
                    <div className="p-5 text-lg">
                        {'Do you want to remove this message'}
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-4">
                        <form method="dialog">
                            <button className="btn btn-outline">Cancel</button>
                        </form>
                        <button className="btn btn-secondary" onClick={() => { console.log(data._id); executeHandleRemove(data._id) }}>Confirm</button>
                    </div>
                </div>
            </dialog>
        </div>
    )
}