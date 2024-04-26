import { useSelector } from "react-redux";
import icons from "../shared/icon";

export default function ConversationCard({ props }) {
    const currentConversation = useSelector((state) => state.currentConversation);
    const isCurrent = currentConversation._id === props._id;
    return (
        <div className="p-2 w-auto">
            <div className={`flex justify-start items-center p-4 ${isCurrent ? "bg-pink-300" : 'bg-white'} rounded-lg ${isCurrent ? " shadow-2xl" : 'shadow-sm'} gap-3 w-full   ${isCurrent ? "" : 'hover:bg-pink-100'}`}>
                <div className="avatar">
                    <div className="avatar w-16 h-16 rounded-full bg-black">
                        <img src={props.image} alt="avatar" />
                    </div>
                </div>
                <div className="flex justify-between w-full">
                    <div className="flex flex-col justify-around w-full gap-2">
                        <label className="text-black text-base font-semibold text-ellipsis whitespace-nowrap overflow-hidden w-48">
                            {props.name ? props.name : ""}
                        </label>
                        {props.isRead ? (
                            <label className="text-black text-sm text-ellipsis whitespace-nowrap overflow-hidden w-48">
                                {props.lastMessage && props.lastMessage.attachments && props.lastMessage.attachments.length > 0 ? "files" : (props.lastMessage && props.lastMessage.content ? props.lastMessage.content : "")}
                            </label>
                        ) : (
                            <label className="text-gray-500 text-sm text-ellipsis whitespace-nowrap overflow-hidden w-48">
                                {props.lastMessage && props.lastMessage.attachments && props.lastMessage.attachments.length > 0 ? "files" : (props.lastMessage && props.lastMessage.content ? props.lastMessage.content : "")}
                            </label>
                        )}
                    </div>
                    <div className="flex justify-center items-center">
                        <label className="text-red-500">
                            {props.isReadMessage ? icons.dot : ""}
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
