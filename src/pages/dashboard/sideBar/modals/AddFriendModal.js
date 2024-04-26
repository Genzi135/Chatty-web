import { useEffect, useState } from "react";
import Button from "../../../../components/common/Button";
import HeaderModal from "../../../../components/common/HeaderModal";
import ConversationSkeleton from "../../../../components/common/ConversationSkeleton";

export default function AddFriendModal({ onClose }) {
    const [option, setOption] = useState('');

    useEffect(() => {
        if (option === 'cancel') {
            setOption('')
            onClose('addFriendModal');
        }
    }, [option])

    return (
        <div className="flex flex-col justify-between bg-white p-5 w-96 rounded-xl">
            <HeaderModal name={"Add friend"} />
            <div>
                <ConversationSkeleton />
            </div>
            <Button value={setOption} />
        </div>
    )
}