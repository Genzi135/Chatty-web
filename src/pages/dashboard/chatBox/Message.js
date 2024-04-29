import { useCallback, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import icons from "../../../components/shared/icon";
import { formatTime } from "../../../helpers/formatDate";
import { setReplyMessage, setSelectedMessage } from "../../../hooks/redux/reducer";
import { BsFileZip, BsFiletypeDoc, BsFiletypeDocx, BsFiletypePdf, BsFiletypePpt, BsFiletypePptx, BsFiletypeTxt, BsFiletypeXls, BsFiletypeXlsx } from "react-icons/bs";
import ForwardModal from "./ForwardModal";

export default function Message({ data }) {
    const currentUser = useSelector((state) => state.currentUser);
    const [selectedImage, setSelectedImage] = useState('');
    const [isShowOption, setShowOption] = useState(false);

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
        id && document.getElementById(id).close();
    }

    const showSelectedImage = (url) => {
        setSelectedImage(url)
    }
    return (
        <div
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={`${currentUser._id === data.sender._id ? 'flex flex-row-reverse mb-2 pr-2' : 'flex mb-2 pl-2'}`}>
            {currentUser._id === data.sender._id ? <div>
            </div> : <div className="avatar">
                <div className="avatar rounded-full w-8 h-8 mr-2">
                    <img src={data.avatar} alt="avatar" />
                </div>
            </div>}
            <div className={`${currentUser._id === data.sender._id ? 'w-[auto] max-w-[60%] p-2 bg-pink-400 rounded-lg flex flex-col' : 'w-[auto] max-w-[60%] p-2 bg-slate-300 rounded-lg flex flex-col'}`}>
                <div className="font-semibold p-2">
                    {data.name}
                </div>
                <div className="">
                    {data.attachments && data.attachments.map(e => (<div className="h-auto inline-block" key={e.url}>
                        {e.type === 'image' && <img onClick={() => showSelectedImage(e.url)} src={e.url} alt="" className="cursor-pointer" />}
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
                                <label className="text-ellipsis whitespace-nowrap w-24 ">{e.url.split("/").pop()}</label>
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
                        <div className="p-1 hover:bg-red-100 rounded-md tooltip" data-tip="Remove">{icons.removeMessage}</div>
                    }
                </div>
            </div>}
            {selectedImage && <div className="fixed bg-black bg-opacity-75 top-0 left-0 w-full h-full flex justify-center items-center z-50">
                <img src={selectedImage} alt="Selected" className="max-w-full max-h-full" />
                <div className="absolute top-2 right-2" onClick={() => setSelectedImage('')}>{icons.xCloseAnimation}</div>
            </div>}
            <dialog id="ForwardModal" className="modal">
                <ForwardModal onClose={onClose}/>
            </dialog>
        </div>
    )
}