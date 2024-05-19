import axios from "axios";
import ConversationCard from "../../../components/common/ConversationCard";
import ConversationSkeleton from "../../../components/common/ConversationSkeleton";
import icons from "../../../components/shared/icon";
import AddFriendModal from "./modals/AddFriendModal";
import { BASE_URL, getConversationById, getListConversation, getListMessageByConversation, userToken } from "../../../components/shared/api";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentConversation, setListConversation, setListMessage, setViewState } from "../../../hooks/redux/reducer";
import CreateGroupModal from "./modals/CreateGroupModal";

export default function SubSideBar() {

    const dispatch = useDispatch();

    var listConversation = useSelector((state) => state.listConversation);
    const viewState = useSelector((state) => state.view);

    const [isLoading, setLoading] = useState(false);

    const [inputValue, setInput] = useState((''))
    const [dataSource, setDataSource] = useState([])

    const [filterTag, setFilterTag] = useState('All')

    useEffect(() => {
        setDataSource(listConversation)
    }, [listConversation])

    const setInputValue = (e) => {
        setInput(e.target.value)
    }

    const onClose = (id) => {
        id && document.getElementById(id).close();
    }

    const onConversationClick = async (e) => {
        getConversationById(e._id)
            .then(response => {
                dispatch(setCurrentConversation(response))
                const readUpdate = listConversation.map(conversation => {
                    if (conversation._id === e._id) {
                        return { ...conversation, isReadMessage: true };
                    }
                    return conversation
                })
                getListMessageByConversation(e._id, dispatch)
                dispatch(setListConversation(readUpdate))
            })
    }

    const setViewList = (box) => {
        dispatch(setViewState({
            box: box,
            subSideBar: 'contact'
        }))
    }

    useEffect(() => {
        getListConversation(dispatch);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function searchUser() {
        let found = [];
        listConversation.map((e) => {
            if (e.name.includes(inputValue)) {
                found.push(e);
            }
        })
        setDataSource(found)
    }

    const keyPressed = (e) => {
        if (e.key === 'Enter')
            searchUser()
    }

    // const onFilterTagClick = () => {
    //     if (filterTag === 'all') {
    //         setDataSource(listConversation)
    //     } else if (filterTag === 'Provate') {
    //         const newList = listConversation.map(e => {
    //             if (e.type === 'private') {
    //                 return e;
    //             }
    //             return e
    //         })
    //         setDataSource(newList)
    //     } else if (filterTag === 'Group') {
    //         const newList = listConversation.map(e => {
    //             if (e.type === 'Group') {
    //                 return e;
    //             }
    //             return e
    //         })
    //         setDataSource(newList)
    //     }
    // }

    useEffect(() => {
        if (filterTag === 'All') {
            setDataSource(listConversation)
        } else if (filterTag === 'Private') {
            const newList = []
            listConversation.map(e => {
                if (e.type === 'private') {
                    return newList.push(e)
                }
            })
            setDataSource(newList)
        } else if (filterTag === 'Group') {
            const newList = []
            listConversation.map(e => {
                if (e.type === 'group') {
                    return newList.push(e)
                }
                return e
            })
            setDataSource(newList)
        }
    }, [filterTag, listConversation])

    return (
        <div style={{ width: 'auto', minWidth: '320px', height: '100%', maxHeight: '100vh', overflow: 'auto' }} >
            {viewState && viewState.subSideBar === 'chat' && <div style={{ width: 320 }} className="bg-gray-100 flex flex-col w-full h-full">
                <div className="flex flex-col w-full h-auto">
                    <div className="w-full bg-white flex justify-between items-center gap-2 p-4">
                        <label className="w-48 h-10 bg-pink-100 input input-bordered flex items-center gap-2">
                            <input type="text" className="grow" placeholder="Search" onChange={setInputValue} onKeyDown={keyPressed} />
                        </label>
                        <div className="text-black hover:bg-pink-200 p-2 rounded-lg cursor-pointer" onClick={() => document.getElementById("addFriendModal").showModal()}>{icons.addFriend}</div>
                        <div className="text-black hover:bg-pink-200 p-2 rounded-lg cursor-pointer" onClick={() => document.getElementById("createGroupModal").showModal()}>{icons.createGroup}</div>
                    </div>
                    <div className="flex gap-4 bg-white pl-2">
                        <label className={`cursor-pointer ${filterTag === 'All' ? 'text-secondary font-semibold border-b-4 border-secondary' : ''}`} onClick={() => { setFilterTag('All') }}>All</label>
                        <label className={`cursor-pointer ${filterTag === 'Private' ? 'text-secondary font-semibold border-b-4 border-secondary' : ''}`} onClick={() => { setFilterTag('Private') }}>Private</label>
                        <label className={`cursor-pointer ${filterTag === 'Group' ? 'text-secondary font-semibold border-b-4 border-secondary' : ''}`} onClick={() => { setFilterTag('Group') }}>Group</label>
                    </div>
                </div>
                <div className="overflow-auto max-h-[90%] h-full scroll-smooth text-ellipsis flex-nowrap">
                    {!isLoading && dataSource ? (dataSource.map((e) => (<div key={e._id} onClick={() => onConversationClick(e)}>
                        <ConversationCard props={e} />
                    </div>
                    ))) : (<ConversationSkeleton />)}
                </div>
                <div style={{ width: '100%', height: 10, position: 'relative' }}>

                </div>
                <dialog id="addFriendModal" className="modal">
                    <AddFriendModal onClose={onClose} />
                </dialog>
                <dialog id="createGroupModal" className="modal">
                    <CreateGroupModal onClose={onClose} />
                </dialog>
            </div>}
            {viewState && viewState.subSideBar === 'contact' && <div style={{ width: 320 }} className="bg-gray-100 flex flex-col">
                <div className="w-full bg-white flex justify-between items-center gap-2 p-4">
                    <label className="w-48 h-10 bg-pink-100 input input-bordered flex items-center gap-2">
                        <input type="text" className="grow" placeholder="Search" />
                    </label>
                    <div className="text-black hover:bg-pink-200 p-2 rounded-lg cursor-pointer" onClick={() => document.getElementById("addFriendModal").showModal()}>{icons.addFriend}</div>
                    <div className="text-black hover:bg-pink-200 p-2 rounded-lg cursor-pointer" onClick={() => document.getElementById("createGroupModal").showModal()}>{icons.createGroup}</div>
                </div>
                <div className="overflow-auto flex flex-col scroll-smooth mt-2 gap-2 p-2">
                    {/* body */}
                    <div onClick={() => setViewList('contact')} className={`flex items-center w-full gap-2 p-4 ${viewState.box === 'contact' ? "bg-pink-300" : "bg-white hover:bg-pink-100"} `}>
                        <div>{icons.listFriend}</div>
                        <label className="font-semibold ">Friend list</label>
                    </div>
                    <div onClick={() => setViewList('group')} className={`flex items-center w-full gap-2 p-4 ${viewState.box === 'group' ? "bg-pink-300" : "bg-white hover:bg-pink-100"} `}>
                        <div>{icons.listGroup}</div>
                        <label className="font-semibold ">Group list</label>
                    </div>
                    <div onClick={() => setViewList('request')} className={`flex items-center w-full gap-2 p-4 ${viewState.box === 'request' ? "bg-pink-300" : "bg-white hover:bg-pink-100"} `}>
                        <div>{icons.listRequest}</div>
                        <label className="font-semibold ">Request list</label>
                    </div>

                </div>
                <div style={{ width: '100%', height: 10, position: 'relative' }}>

                </div>

                <dialog id="addFriendModal" className="modal">
                    <AddFriendModal onClose={onClose} />
                </dialog>
                <dialog id="createGroupModal" className="modal">
                    <CreateGroupModal onClose={onClose} />
                </dialog>
            </div>}
        </div>
    )
}