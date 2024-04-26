import { useCallback, useState } from "react"
import { useSelector } from "react-redux"
import icons from "../../../components/shared/icon";

export default function Message({ data }) {
    const currentUser = useSelector((state) => state.currentUser);
    const [isShowOption, setShowOption] = useState(false);

    const onMouseEnter = useCallback(() => {
        setShowOption(true)
    })

    const onMouseLeave = useCallback(() => {
        setShowOption(false)
    })
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
                {data.content &&
                    <div className={`${currentUser._id === data.sender._id ? 'bg-pink-200 rounded-lg w-full p-2' : 'bg-slate-100 rounded-lg w-full p-2'}`}>
                        {data.content}
                    </div>
                }
            </div>
            {isShowOption && <div className="ml-1 mr-1 h-auto flex justify-center items-center w-auto gap-1 p-1">
                <div className="flex bg-white rounded-md p-1">
                    <div className="p-1 hover:bg-gray-300 rounded-md">{icons.forward}</div>
                    <div className="p-1 hover:bg-gray-300 rounded-md">{icons.reply}</div>
                    {currentUser._id === data.sender._id &&
                        <div className="p-1 hover:bg-red-100 rounded-md">{icons.removeMessage}</div>
                    }
                </div>
            </div>}
        </div>
    )
}