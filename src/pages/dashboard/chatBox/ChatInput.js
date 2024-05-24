import { useDispatch, useSelector } from "react-redux";
import icons from "../../../components/shared/icon";
import { setListConversation, setReplyMessage } from "../../../hooks/redux/reducer";
import { useState } from "react";
import { BsFileZip, BsFiletypeDoc, BsFiletypeDocx, BsFiletypePdf, BsFiletypePpt, BsFiletypePptx, BsFiletypeTxt, BsFiletypeXls, BsFiletypeXlsx } from "react-icons/bs";
import { handleReplyMessage, handleSendFile, handleSendMessage } from "../../../components/shared/api";
import { useSocket } from "../../../hooks/context/socket";

export default function ChatInput() {
    const replyMessage = useSelector((state) => state.replyMessage);
    const listConversation = useSelector((state) => state.listConversation)
    const currentConversation = useSelector((state) => state.currentConversation)


    const [showImages, setShowImages] = useState(null);
    const [inputImages, setInputImages] = useState(null);
    const [inputFiles, setInputFiles] = useState(null);
    const [inputVideos, setInputVideos] = useState(null);
    const [inputMessage, setInputMessage] = useState('');
    const { socket } = useSocket()

    const dispatch = useDispatch();

    const setInput = (e) => {
        setInputMessage(e.target.value)
    }

    const removeImageFromList = (index) => {
        const newListImages = [...inputImages];
        newListImages.splice(index, 1);
        setInputImages(newListImages);

        const newShowImages = [...showImages];
        newShowImages.splice(index, 1);
        setShowImages(newShowImages);
    }

    const removeVideoFromList = (index) => {
        const newListVideo = [...inputVideos];
        newListVideo.splice(index, 1);
        setInputVideos(newListVideo);
    }

    const removeFilesFromList = (index) => {
        const newListFiles = [...inputFiles];
        newListFiles.splice(index, 1);
        setInputFiles(newListFiles);
    }

    async function SendMessage() {
        if (replyMessage != null) {
            // if (inputFiles || inputVideos || inputImages) {
            //     let formData = new FormData()
            //     if (inputFiles) {
            //         inputFiles.map(e => formData.append('files', e))
            //     }
            //     if (inputVideos) {
            //         inputVideos.map(e => formData.append('files', e))
            //     }
            //     if (inputImages) {
            //         inputImages.map(e => formData.append('files', e))
            //     }
            //     handleReplyFile(currentConversation, replyMessage, inputMessage, formData, dispatch)
            //         .then(response => {
            //             socket.emit("message:send", {
            //                 ...response,
            //                 conversation: currentConversation
            //             })
            //         })
            //         dispatch(setReplyMessage(null))
            //     }
            if (typeof replyMessage === 'object' && Object.keys(replyMessage).length !== 0) {
                handleReplyMessage(currentConversation, replyMessage, inputMessage, dispatch)
                    .then(response => {
                        console.log(response)
                        socket.emit("message:send", {
                            ...response,
                            conversation: currentConversation
                        })
                    })
                dispatch(setReplyMessage(null))
            }
        } else if (inputFiles || inputVideos || inputImages) {
            let formData = new FormData()
            if (inputFiles) {
                inputFiles.map(e => formData.append('files', e))
            }
            if (inputVideos) {
                inputVideos.map(e => formData.append('files', e))
            }
            if (inputImages) {
                inputImages.map(e => formData.append('files', e))
            }
            handleSendFile(listConversation, currentConversation, formData, dispatch)
                .then(response => {
                    socket.emit("message:send", {
                        ...response,
                        conversation: currentConversation
                    })
                })
                .then(() => {
                    if (inputMessage !== '') {
                        handleSendMessage(listConversation, currentConversation, inputMessage, dispatch)
                            .then(response => {
                                socket.emit("message:send", {
                                    ...response,
                                    conversation: currentConversation
                                })
                            })
                        }
                })
        } else if (inputMessage !== '') {
            handleSendMessage(listConversation, currentConversation, inputMessage, dispatch)
                .then(response => {
                    socket.emit("message:send", {
                        ...response,
                        conversation: currentConversation
                    })
                })
            }

        document.getElementById('chatInput').value = ''
        setInputFiles(null)
        setInputVideos(null)
        setInputImages(null)
        setShowImages(null)
    }

    const keyPressed = (e) => {
        if (e.key === 'Enter')
            SendMessage()
    }

    return (
        <div className="flex flex-col w-full h-auto">

            {showImages && showImages.length > 0 &&
                <div className="flex w-auto h-auto justify-start items-center gap-2 p-2 bg-white">
                    {showImages.map((e, index) => (<div key={index} className="w-16 h-16 border-2 relative">
                        <img src={e} alt="" />
                        <div onClick={() => removeImageFromList(index)} className="absolute top-0 right-0 bg-gray-100 rounded-full hover:bg-gray-300 z-50">{icons.xClose}</div>
                    </div>))}
                </div>}
            {inputVideos && inputVideos.length > 0 &&
                <div className="flex w-auto h-auto justify-start items-center gap-2 p-2 bg-white">
                    {inputVideos.map((e, index) => (<div key={index} className="w-16 h-16 border-2 relative border-secondary flex justify-center items-center rounded-lg text-secondary">
                        {icons.video}
                        <div onClick={() => removeVideoFromList(index)} className="absolute top-0 right-0 bg-gray-100 rounded-full hover:bg-gray-300 z-50">{icons.xClose}</div>
                    </div>))}
                </div>}
            {inputFiles && inputFiles.length > 0 &&
                <div className="flex w-auto h-auto justify-start items-center gap-8 p-2 bg-white">
                    {inputFiles.map((e, index) => (
                        <div key={index} className="w-16 h-16 relative flex justify-center items-center">
                            <div>
                                {e.name &&
                                    <>
                                        {e.name.split(".").pop() === 'docx' && <BsFiletypeDocx size={40} color='blue' />}
                                        {e.name.split(".").pop() === 'doc' && <BsFiletypeDoc size={40} color='blue' />}

                                        {e.name.split(".").pop() === 'pptx' && <BsFiletypePptx size={40} color='red' />}
                                        {e.name.split(".").pop() === 'ppt' && <BsFiletypePpt size={40} color='red' />}
                                        {e.name.split(".").pop() === 'pdf' && <BsFiletypePdf size={40} color='red' />}

                                        {e.name.split(".").pop() === 'xlsx' && <BsFiletypeXlsx size={40} color='green' />}
                                        {e.name.split(".").pop() === 'xls' && <BsFiletypeXls size={40} color='green' />}

                                        {e.name.split(".").pop() === 'rar' && <BsFileZip size={40} color='purple' />}
                                        {e.name.split(".").pop() === 'zar' && <BsFileZip size={40} color='purple' />}

                                        {e.name.split(".").pop() === 'txt' && <BsFiletypeTxt size={40} color='black' />}
                                        <div className="whitespace-nowrap text-ellipsis overflow-hidden w-20">{e.name}</div>
                                    </>

                                }
                            </div>
                            <div onClick={() => removeFilesFromList(index)} className="absolute top-0 right-0 bg-gray-100 rounded-full hover:bg-gray-300 z-50">{icons.xClose}</div>
                        </div>
                    ))}
                </div>
            }

            <div className="flex p-2 justify-start gap-2 bg-pink-300 z-20">
                <div className="p-2 rounded-lg text-white hover:bg-pink-500 relative flex justify-center items-center cursor-pointer tooltip" data-tip="Image">
                    {icons.image}
                    <input
                        type="file"
                        className="absolute w-full h-full opacity-0"
                        id="image"
                        accept="image/png, image/gif, image/jpeg"
                        value={""}
                        multiple
                        onChange={(e) => {
                            const images = e.target.files;
                            if (images.length < 5) {
                                const newImages = [];
                                const newShowImages = [];
                                for (let i = 0; i < images.length; i++) {
                                    if (images[i].type.includes("image")) {
                                        newImages.push(e.target.files[i])
                                        newShowImages.push(URL.createObjectURL(images[i]))
                                    }
                                }
                                setInputImages(newImages);
                                setShowImages(newShowImages);
                            }
                        }}
                    />
                </div>
                <div className="p-2 rounded-lg text-white hover:bg-pink-500 relative flex justify-center items-center cursor-pointer tooltip" data-tip="Video">
                    {icons.video}
                    <input
                        type="file"
                        id="file"
                        accept="video/*"
                        value={""}
                        multiple
                        onChange={(e) => {
                            const videos = e.target.files;
                            const maxSize = 10 * 1024 * 1024; // Maximum file size is 25MB
                            const newVideos = [];
                            for (let i = 0; i < videos.length; i++) {
                                const videoSize = videos[i].size;
                                const fileName = videos[i].name;
                                if (videoSize <= maxSize) {
                                    newVideos.push(videos[i]);
                                } else {
                                    alert("The file '" + fileName + "' exceeds 10MB.");
                                }
                            }
                            if (newVideos.length <= 2) {
                                setInputVideos(newVideos);
                            } else {
                                alert("Only a maximum of 2 videos can be selected.");
                            }
                        }}
                        className="absolute w-full h-full opacity-0" />
                </div>
                <div className="p-2 rounded-lg text-white hover:bg-pink-500 relative flex justify-center items-center cursor-pointer tooltip" data-tip="Files">
                    {icons.folderFile}
                    <input
                        type="file"
                        id="file"
                        value={""}
                        multiple
                        accept=".doc, .docx, .pdf, .ppt, .pptx, .xls, .xlsx, .rar, .zar, .txt, .zip"
                        onChange={(e) => {
                            const files = e.target.files;
                            if (files.length <= 5) {
                                const newFiles = [];
                                for (let i = 0; i < files.length; i++) {
                                    newFiles.push(files[i]);
                                }
                                setInputFiles(newFiles);
                            } else {
                                alert("max is 5 files");
                                e.target.value = null;
                            }
                        }}
                        className="absolute w-full h-full opacity-0" />
                </div>
                {replyMessage && <div className="flex justify-center items-center bg-white rounded-lg p-1 gap-1 max-w-[300]">
                    <label className="text-secondary font-semibold">Message:</label>{replyMessage.content}<label className="text-gray-500">{replyMessage.attachments && replyMessage.attachments.length > 0 ? <div className="flex justify-center items-center ml-2">{icons.attachments}<label>files</label></div> : ''}</label>
                    <div onClick={() => { dispatch(setReplyMessage(null)) }} className="flex justify-center items-center p-1 rounded-full bg-gray-100 hover:bg-gray-300 ml-2">{icons.xClose}</div>
                </div>}
            </div>
            <div className="flex justify-between items-center pt-2 pb-2 gap-2 p-5">
                <div className="w-full h-auto">
                    <input className="input w-full input-secondary" id='chatInput' onChange={(setInput)} onKeyDown={keyPressed}/>
                </div>
                <div className="btn btn-secondary" onClick={() => SendMessage()}>
                    <label>SEND</label>
                </div>
            </div>
        </div>
    )

}