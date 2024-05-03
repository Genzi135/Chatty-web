import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import icons from "../../../components/shared/icon";
import { formatTime } from "../../../helpers/formatDate";
import { setListMessage, setReplyMessage, setSelectedMessage } from "../../../hooks/redux/reducer";
import { BsFileZip, BsFiletypeDoc, BsFiletypeDocx, BsFiletypePdf, BsFiletypePpt, BsFiletypePptx, BsFiletypeTxt, BsFiletypeXls, BsFiletypeXlsx } from "react-icons/bs";
import ForwardModal from "./ForwardModal";
import ModalConfirm from "../../../components/common/ModalConfirm";
import { handleDeleteMessage } from "../../../components/shared/api";
import { useSocket } from "../../../hooks/context/socket";

export default function Message({ data }) {
    const currentUser = useSelector((state) => state.currentUser);
    const listMessage = useSelector((state) => state.listMessage);
    const currentConversation = useSelector((state) => state.currentConversation)
    const [selectedImage, setSelectedImage] = useState('');
    const [isShowOption, setShowOption] = useState(false);
    const [option, setOption] = useState('');

    const {socket} = useSocket()

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

    const executeHandleRemove = () => {
        console.log(data)
        // handleDeleteMessage(data._id)
    }

    const setForwardMessage = () => {
        dispatch(setSelectedMessage(data))
        document.getElementById('ForwardModal').showModal()
    }

    const onClose = (id) => {
        id && document.getElementById(id).close();
    }

    const showSelectedImage = (url) => {
        setSelectedImage(url)
    }



    useEffect(() => {
        if (option === "cancel") {
            setOption('');
            onClose('modalConfirm')
        } else if (option === "confirm") {
            executeHandleRemove()
            
            const newList = listMessage.map((e) => {
                if (data._id === e._id) {
                    return { ...e, content: "This message has been deleted", isDelete: true }
                }
                return e;
            })

            dispatch(setListMessage(newList))

            socket.emit("message:delete", {
                id: data._id,
                conversation: currentConversation,
            })

            setOption('');
            onClose('modalConfirm')
        }
    }, [option])

    return (
        <div
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={`${data.sender && currentUser._id == data.sender._id ? 'flex flex-row-reverse mb-2 pr-2' : 'flex mb-2 pl-2'}`}>
            {currentUser._id === data.sender._id ? <div>
            </div> : <div className="avatar">
                <div className="avatar rounded-full w-8 h-8 mr-2">
                    <img src={data.avatar} alt="avatar" />
                </div>
            </div>}
            <div className={`${currentUser._id === data.sender._id ? 'w-[auto] max-w-[60%] p-2 bg-pink-200 rounded-lg flex flex-col' : 'w-[auto] max-w-[60%] p-2 bg-slate-300 rounded-lg flex flex-col'}`}>
                <div className="font-semibold p-2">
                    {data.name}
                </div>
                {data.parent && <div className="flex flex-col p-2 bg-pink-50 rounded-lg mb-2 gap-2 border-l-8 border-secondary">
                    <div>{data.parent.name}</div>
                    {data.parent.attachments && data.parent.attachments.length > 0 && data.parent.attachments.map(e => (<div className="h-auto inline-block" key={e.url}>
                        {e.type === 'image' && <div className="flex gap-2">
                            {icons.image} image
                            {/* <img onClick={() => showSelectedImage(e.url)} src={e.url} style={{}} alt="" className="cursor-pointer" /> */}
                        </div>}
                        {e.type === 'application' &&
                            <div onClick={() => { window.open(e.url) }} className="cursor-pointer flex items-center bg-blue-100 p-1 rounded-lg">
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

                </div>}
                <div className=" flex flex-col gap-2">
                    {data.attachments && data.attachments.length > 0 && data.attachments.map(e => (<div className="h-auto inline-block" key={e.url}>
                        {e.type === 'image' && <img onClick={() => showSelectedImage(e.url)} src={e.url} style={{}} alt="" className="cursor-pointer" />}
                        {e.type === 'application' &&
                            <div onClick={() => { window.open(e.url) }} className="cursor-pointer flex items-center bg-blue-100 p-1 rounded-lg">
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
                    <div className={`${currentUser._id === data.sender._id ? 'bg-pink-200 rounded-lg w-full p-2' : 'bg-slate-100 rounded-lg w-full p-2'}`}>
                        {data.content}
                    </div>
                }
                <div className="text-xs p-1">{formatTime(data.createdAt)}</div>
            </div>
            {isShowOption && <div className="ml-1 mr-1 h-auto flex justify-center items-center w-auto gap-1 p-1">
                <div className="flex bg-white rounded-md p-1">
                    <div onClick={() => setForwardMessage()} className="p-1 hover:bg-gray-300 rounded-md tooltip" data-tip="Forward">{icons.forward}</div>
                    <div onClick={() => setRepMessage()} className="p-1 hover:bg-gray-300 rounded-md tooltip" data-tip="Reply">{icons.reply}</div>
                    {currentUser._id === data.sender._id &&
                        <div className="p-1 hover:bg-red-100 rounded-md tooltip" data-tip="Remove" onClick={() => document.getElementById("modalConfirm").showModal()}>{icons.removeMessage}</div>
                    }
                </div>
            </div>}
            {selectedImage && <div className="fixed bg-black bg-opacity-75 top-0 left-0 w-full h-full flex justify-center items-center z-50">
                <img src={selectedImage} alt="Selected" className="max-w-full max-h-full" />
                <div className="absolute top-2 right-2" onClick={() => setSelectedImage('')}>{icons.xCloseAnimation}</div>
            </div>}
            <dialog id="ForwardModal" className="modal">
                <ForwardModal onClose={onClose} />
            </dialog>
            <dialog id="modalConfirm" className="modal">
                <ModalConfirm onClose={onClose} setOption={setOption} title={"Wanna remove this message"} type={'Warning'} />
            </dialog>
        </div>
    )
}