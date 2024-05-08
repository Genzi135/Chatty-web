import { useEffect, useState } from "react";
import Button from "../../../../components/common/Button";
import HeaderModal from "../../../../components/common/HeaderModal";
import ConversationSkeleton from "../../../../components/common/ConversationSkeleton";
import CustomButton from "../../../../components/common/CustomButton";
import { handleSearchFriendAPI, handleSearchFriendID } from "../../../../components/shared/api";
import AddFriendCard from "../../../../components/common/AddFriendCard";

export default function AddFriendModal({ onClose }) {
    const [option, setOption] = useState('');
    const [email, setEmail] = useState('');
    const [dataSource, setDataSource] = useState(null)

    const setInputEmail = (e) => {
        setEmail(e.target.value)
    }

    useEffect(() => {
        if (option === 'cancel') {
            setOption('')
            onClose('addFriendModal');
        }
    }, [option])

    function searchFriend() {
        handleSearchFriendAPI(email)
            .then((response) => {
                handleSearchFriendID(response.data.data._id)
                    .then(response => {
                        console.log(response)
                    })
                setDataSource(response.data.data)
            })
        console.log(dataSource)
    }



    return (
        <div className="flex flex-col justify-between bg-white p-5 w-96 rounded-xl">
            <HeaderModal name={"Add friend"} />
            <div className="w-60 h-10 bg-pink-100 input input-bordered flex items-center gap-5">
                <div><input type="text" className="w-60" placeholder="Search" onChange={setInputEmail} /></div>
                <div onClick={() => searchFriend()}><CustomButton name={"Search"} /></div>
            </div>
            <div>
                {dataSource ? (
                    <div>
                        <AddFriendCard props={dataSource} />
                    </div>
                ) : (
                    <div className="mt-5"><ConversationSkeleton /></div>
                )}
            </div>
            <Button value={setOption} />
        </div>
    )
}