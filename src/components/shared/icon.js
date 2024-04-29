import { BsArrow90DegDown, BsCamera, BsChatDots, BsChatDotsFill, BsCollectionPlay, BsEmojiSmile, BsFillCircleFill, BsFillPeopleFill, BsFillPersonCheckFill, BsFolder, BsGear, BsGearFill, BsImage, BsJournalBookmark, BsJournalBookmarkFill, BsLayoutSidebarInset, BsLayoutSidebarInsetReverse, BsPaperclip, BsPencilSquare, BsPeople, BsPersonAdd, BsPersonFillDash, BsPersonLinesFill, BsReplyFill, BsTelephone, BsTrash, BsTrash3, BsX } from "react-icons/bs";

const icons = {
    contact: <BsJournalBookmark size={25} />,
    contactFill: <BsJournalBookmarkFill size={25} />,
    chat: <BsChatDots size={25} />,
    chatFill: <BsChatDotsFill size={25} />,
    addFriend: <BsPersonAdd size={25} />,
    removeFriend: <BsPersonFillDash size={25} />,
    createGroup: <BsPeople size={25} />,
    trash: <BsTrash size={25} />,
    image: <BsImage size={25} />,
    video: <BsCollectionPlay size={25} />,
    sideBarOpen: <BsLayoutSidebarInset size={25} />,
    sideBarClose: <BsLayoutSidebarInsetReverse size={25} />,
    xClose: <BsX size={25} />,
    xCloseAnimation: <button className="btn btn-circle">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
    </button>,
    callPhone: <BsTelephone size={25} />,
    folderFile: <BsFolder size={25} />,
    setting: <BsGear size={25} />,
    settingFill: <BsGearFill size={25} />,
    emoji: <BsEmojiSmile size={25} />,
    camera: <BsCamera size={25} />,
    pencilSquare: <BsPencilSquare size={20} />,
    loadingSmall: <span className="loading loading-spinner loading-md"></span>,
    loadingLarge: <span className="loading loading-spinner loading-2xl"></span>,
    dot: <BsFillCircleFill size={12} />,
    forward: <BsReplyFill size={18} />,
    reply: <BsArrow90DegDown size={15} />,
    removeMessage: <BsTrash3 size={16} color="red" />,
    listFriend: <BsPersonLinesFill size={25} />,
    listGroup: <BsFillPeopleFill size={25} />,
    listRequest: <BsFillPersonCheckFill size={25} />,
    attachments: <BsPaperclip size={20} />
}

export default icons;