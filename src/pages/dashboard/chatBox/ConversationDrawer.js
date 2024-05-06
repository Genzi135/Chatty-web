import { useSelector } from "react-redux"
import Avatar from "../../../components/common/Avatar";
import icons from "../../../components/shared/icon";

export default function ConversationDrawer() {
    const currentConversation = useSelector(state => state.currentConversation)
    console.log(currentConversation);
    return (
        <div className="w-[400px]">
            {currentConversation && currentConversation.type === "private" && <div className="w-full h-full flex flex-col justify-between items-center pt-10">
                <div className="flex flex-col justify-center items-center">
                    <Avatar link={currentConversation.image} />
                    <label>{currentConversation.name}</label>
                    <div className="mt-4 flex justify-center items-center gap-2">
                        <label className="tooltip p-1 hover:bg-gray-300 rounded-md cursor-pointer" data-tip="Add to group">{icons.addFriend}</label>
                        <label className="tooltip text-red-500 p-1 hover:bg-red-200 rounded-md cursor-pointer" data-tip="Remove friend">{icons.removeFriend}</label>
                    </div>
                </div>
                <div>

                </div>

            </div>}
            {currentConversation && currentConversation.type === "group" && <div className="w-full h-full flex flex-col justify-between items-center pt-10">
                <div className="flex flex-col justify-center items-center">
                    <Avatar link={currentConversation.image} />
                    <label>{currentConversation.name}</label>
                    <div className="mt-4 flex justify-center items-center gap-2">
                        <label className="tooltip p-1 hover:bg-gray-300 rounded-md cursor-pointer" data-tip="Add to group">{icons.addFriend}</label>
                        <label className="tooltip text-red-500 p-1 hover:bg-red-200 rounded-md cursor-pointer" data-tip="Remove friend">{icons.removeFriend}</label>
                    </div>
                </div>
                <div>

                </div>

            </div>}
        </div>
    )
}