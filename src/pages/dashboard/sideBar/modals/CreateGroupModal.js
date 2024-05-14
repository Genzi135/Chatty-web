import { useCallback, useEffect, useState } from "react";
import Button from "../../../../components/common/Button";
import HeaderModal from "../../../../components/common/HeaderModal";
import ConversationSkeleton from "../../../../components/common/ConversationSkeleton";
import CustomButton from "../../../../components/common/CustomButton";
import { getListConversation, handleCreateGroup, handleGetFriendList } from "../../../../components/shared/api";
import FriendCard from "../../../../components/common/FriendCard";
import icons from "../../../../components/shared/icon";
import { useDispatch, useSelector } from "react-redux";

export default function CreateGroupModal({ onClose }) {
    const [dataSource, setDataSource] = useState([])
    const [selectedList, setSelectedList] = useState([])
    const [isShowSelectedList, setShowSelectedList] = useState(false)
    const [isRefresh, setRefresh] = useState(false);
    const [option, setOption] = useState('');
    const [inputAva, setInputAva] = useState(null);
    const [name, setName] = useState('');
    const [search, setSearch] = useState('');
    const [report, setReport] = useState('');

    const dispatch = useDispatch();

    const userData = useSelector((state) => state.currentUser);

    const setAva = (e) => {
        setInputAva(e.target.files[0])
    }

    const setInputName = (e) => {
        setName(e.target.value)
    }

    const setInputSearch = (e) => {
        setSearch(e.target.value)
    }

    // const onMouseEnter = useCallback(() => {
    //     setShowSelectedList(true);
    // })

    // const onMouseLeave = useCallback(() => {
    //     setShowSelectedList(false);
    // })

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
            setReport('')
            setSelectedList([])
            handleGetFriendList().then(response => setDataSource(response.data.data))
            onClose('createGroupModal');
        } else if (option === 'confirm') {
            if (name === "") {
                setReport("Please enter the group name")
                setOption('')
                return
            } else if (selectedList.length < 2) {
                setReport("Need 2 or more members to create the group")
                setOption('')
                return
            } else {
                handleCreateGroup(userData._id, selectedList, name, null).then(() => getListConversation(dispatch))
                setSelectedList([])
                handleGetFriendList().then(response => setDataSource(response.data.data))
                setOption('')
                setReport('')
                onClose('createGroupModal');
            }
        }
    }, [option])

    useEffect(() => {
        setSelectedList([])
        handleGetFriendList().then(response => setDataSource(response.data.data))
    }, [])

    function searchUser() {
        handleGetFriendList()
            .then(response => { return response.data.data })
            .then((friendList) => {
                let found = [];
                friendList.map((e) => {
                    if (e.name.includes(search)) {
                        found.push(e);
                    }
                })
                setDataSource(found)
            })
    }

    const keyPressed = (e) => {
        if (e.key === 'Enter')
            searchUser()
    }

    return (
        <div className="flex flex-col justify-between rounded-lg bg-white p-5 w-[500px] rounded-xl gap-4 max-h-[600px]">
            <HeaderModal name={"Create group"} />
            {/* <div className="w-full h-auto flex justify-between items-center gap-2">
                <div className="w-full h-11 bg-pink-100 input input-bordered flex items-center gap-5">
                    <input type="file" className="grow w-full" placeholder="Enter group name" onChange={(setAva)} />
                </div>
            </div> */}
            <div className="w-full h-auto flex justify-between items-center gap-2">
                <div className="w-full h-11 bg-pink-100 input input-bordered flex items-center gap-5">
                    <input type="text" className="grow w-full" placeholder="Enter group name" onChange={setInputName} />
                </div>
            </div>
            <div className="w-full h-auto flex justify-between items-center gap-2">
                <div className="w-full h-11 bg-pink-100 input input-bordered flex items-center gap-5">
                    <input type="text" className="grow" placeholder="Search" onChange={(setInputSearch)} onKeyDown={keyPressed} />
                </div>
                <CustomButton name={'Search'} onClick={() => { searchUser() }} />
            </div>
            <div className="w-full h-auto">
                {
                    selectedList && selectedList.length > 0 && <div className='w-full h-auto max-h-[20] flex justify-start items-center gap-2 p-2 whitespace-nowrap text-ellipsis overflow-x-auto overflow-y-hidden'>
                        {
                            selectedList.map((e) => (<div key={e._id} className="w-auto h-12 p-2 text-nowrap flex gap-2 justify-between rounded-lg border-pink-500 border-2 text-secondary">
                                {e.name}
                                <div onClick={() => removeFromSelected(e)} className="hover:bg-pink-300 flex justify-center items-center p-1 rounded-full">{icons.xClose}</div>
                            </div>))
                        }
                    </div>
                }
            </div>
            <div className="overflow-auto w-full h-[auto] p-2 bg-gray-100">
                {dataSource ? dataSource.map((e, index) => (<div key={index} onClick={() => onSelectedClick(e)}>
                    <FriendCard props={e} isRefresh={setRefresh} />
                </div>))
                    : <ConversationSkeleton />
                }
            </div>
            <span className="text-sm text-error">{report}</span>
            <div className="flex justify-end items-center">
                <Button value={setOption} />
            </div>
        </div>
    )
}