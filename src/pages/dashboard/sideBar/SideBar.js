import { useDispatch, useSelector } from "react-redux";
import Avatar from "../../../components/common/Avatar";
import icons from "../../../components/shared/icon";
import { setLogout, setViewState } from "../../../hooks/redux/reducer";
import { useState } from "react";
import ProfileModal from "./modals/ProfileModal";

export default function SideBar() {

    const [isSettingSelected, setSettingSelected] = useState(false);

    const userData = useSelector((state) => state.currentUser);
    const viewState = useSelector((state) => state.view)
    const dispatch = useDispatch();

    const setChatView = () => {
        setSettingSelected(false);
        const chatView = {
            subSideBar: 'chat',
            box: 'chat',
        }
        dispatch(setViewState(chatView));
    }

    const setContactView = () => {
        setSettingSelected(false);
        const contactView = {
            subSideBar: 'contact',
            box: 'contact',
        }
        dispatch(setViewState(contactView));
    }

    return (
        <div style={{ width: 80, height: '100%' }} className="bg-pink-300 flex flex-col justify-between items-center pt-4 pb-2">
            <div className="flex flex-col gap-5 justify-center items-center">
                <div onClick={() => document.getElementById('ProfileModal').showModal()}>
                    <Avatar link={userData.avatar} />
                </div>
                <div className="p-2 text-white ">
                    {viewState.subSideBar === 'chat' ? (<div className="bg-pink-500 p-3 rounded-xl cursor-pointer">{icons.chatFill}</div>) : (<div className="p-3 hover:bg-pink-400 rounded-xl cursor-pointer" onClick={() => setChatView()}>{icons.chat}</div>)}
                </div>
                <div className="p-2 text-white">
                    {viewState.subSideBar === 'contact' ? (<div className="bg-pink-500 p-3 rounded-xl cursor-pointer">{icons.contactFill}</div>) : (<div className="p-3 hover:bg-pink-400 rounded-xl cursor-pointer" onClick={() => setContactView()}>{icons.contact}</div>)}
                </div>
            </div>
            <div className="p-2 text-white" onClick={() => setSettingSelected(!isSettingSelected)}>
                {isSettingSelected ? (<div className="bg-pink-500 p-3 rounded-xl cursor-pointer">{icons.settingFill}</div>) : (<div className="p-3 hover:bg-pink-400 rounded-xl cursor-pointer">{icons.setting}</div>)}
            </div>
            <dialog id="ProfileModal" className="modal">
                <ProfileModal />
            </dialog>
        </div>
    )
}