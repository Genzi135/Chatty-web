import { useEffect, useState } from "react";
import Button from "../../../../components/common/Button";
import HeaderModal from "../../../../components/common/HeaderModal";
import ConversationSkeleton from "../../../../components/common/ConversationSkeleton";
import CustomButton from "../../../../components/common/CustomButton";
import { handleSearchFriendAPI } from "../../../../components/shared/api";

export default function AddFriendModal({ onClose }) {
    const [option, setOption] = useState('');
    const [email, setEmail] = useState('');

    const setInputEmail=(e)=>{
        setEmail(e.target.value)
    }

    useEffect(() => {
        if (option === 'cancel') {
            setOption('')
            onClose('addFriendModal');
        }
    }, [option])

    return (
        <div className="flex flex-col justify-between bg-white p-5 w-96 rounded-xl">
            <HeaderModal name={"Add friend"} />
            <div className="w-60 h-10 bg-pink-100 input input-bordered flex items-center gap-5">
                <div><input type="text" className="w-60" placeholder="Search" onChange={setInputEmail}/></div>
                <div onClick={()=>handleSearchFriendAPI(email)}><CustomButton name={"Search"} /></div>
            </div>
            <div>
                <ConversationSkeleton />
            </div>
            <Button value={setOption} />
        </div>
    )
}