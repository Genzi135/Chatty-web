import { useCallback, useEffect, useState } from "react";
import Button from "../../../../components/common/Button";
import HeaderModal from "../../../../components/common/HeaderModal";
import ConversationSkeleton from "../../../../components/common/ConversationSkeleton";
import CustomButton from "../../../../components/common/CustomButton";
import { handleGetFriendList } from "../../../../components/shared/api";
import FriendCard from "../../../../components/common/FriendCard";
import icons from "../../../../components/shared/icon";

export default function CreateGroupModal({ onClose }) {
    const [dataSource, setDataSource] = useState([])
    const [selectedList, setSelectedList] = useState([])
    const [isShowSelectedList, setShowSelectedList] = useState(false)
    const [option, setOption] = useState('');

    const onMouseEnter = useCallback(() => {
        setShowSelectedList(true);
    })

    const onMouseLeave = useCallback(() => {
        setShowSelectedList(false);
    })

    const onSelectedClick = (e) => {
        setSelectedList([...selectedList, e]);
        setDataSource(dataSource.filter(el => el !== e))
    }

    const removeFromSelected = (e) => {
        const removeItem = e;
        const newSelectedList = selectedList.filter(el => el !== e);
        setSelectedList(newSelectedList);
        setDataSource([...dataSource, e])
    }

    useEffect(() => {
        if (option === 'cancel') {
            setOption('')
            onClose('createGroupModal');
        } else if (option === 'confirm') {
            //API create group

            setOption('')
            onClose('createGroupModal');
        }
    }, [option])

    useEffect(() => {
        setSelectedList([])
        handleGetFriendList().then(response => setDataSource(response.data.data))
    }, [])

    return (
        <div className="flex flex-col justify-between bg-white p-5 w-[500px] rounded-xl gap-4 max-h-[600px]">
            <HeaderModal name={"Create group"} />
            <div className="w-full h-auto flex justify-between items-center gap-2">
                <div className="w-full h-11 bg-pink-100 input input-bordered flex items-center gap-5">
                    <input type="text" className="grow w-full" placeholder="Enter group name" />
                </div>
            </div>
            <div className="w-full h-auto flex justify-between items-center gap-2">
                <div className="w-full h-11 bg-pink-100 input input-bordered flex items-center gap-5">
                    <input type="text" className="grow" placeholder="Search" />
                </div>
                <CustomButton name={'Search'} />
            </div>
            <div className="overflow-auto w-full h-[auto] p-2 bg-gray-100">
                {dataSource ? dataSource.map((e, index) => (<div key={index} onClick={() => onSelectedClick(e)}>
                    <FriendCard props={e} />
                </div>))
                    : <ConversationSkeleton />
                }
            </div>
            <div className="flex justify-between items-center">
                <div
                    onMouseEnter={() => { onMouseEnter() }}
                    onMouseLeave={() => { onMouseLeave() }}
                    className="relative">
                    {isShowSelectedList && <div className="w-auto h-auto absolute bottom-6 bg-white left-0 gap-1 flex flex-col">
                        {selectedList.map((e, index,) => (<div key={e._id} className="w-auto h-12 p-2 text-nowrap flex gap-2 justify-between rounded-lg border-pink-500 border-2 text-secondary">
                            {e.name}
                            <div onClick={() => removeFromSelected(e)} className="hover:bg-pink-300 flex justify-center items-center p-1 rounded-full">{icons.xClose}</div>
                        </div>))}
                    </div>}
                    <label
                        className="cursor-pointer text-secondary font-semibold hover:bg-pink-100 p-1 rounded-lg">Show members {selectedList.length}</label>
                </div>
                <Button value={setOption} />
            </div>
        </div>
    )
}