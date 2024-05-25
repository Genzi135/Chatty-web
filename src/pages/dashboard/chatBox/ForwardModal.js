/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import HeaderModal from '../../../components/common/HeaderModal'
import CustomButton from '../../../components/common/CustomButton'
import FriendCard from '../../../components/common/FriendCard'
import ConversationSkeleton from '../../../components/common/ConversationSkeleton'
import { getListConversation, handleForwardMessage, handleGetFriendList } from '../../../components/shared/api'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../../../components/common/Button'
import { useSocket } from '../../../hooks/context/socket'
import { setListConversation } from '../../../hooks/redux/reducer'
import ConversationForwardCard from '../../../components/common/ConversationForward'
import icons from '../../../components/shared/icon'
export default function ForwardModal({ onClose }) {
    const [dataSource, setDataSource] = useState([])
    const [selectedList, setSelectedList] = useState([])
    const [search, setSearch] = useState('');
    const selectedMessage = useSelector((state) => state.selectedMessage)
    const conversationList = useSelector((state) => state.listConversation)
    const currentConversation = useSelector((state) => state.currentConversation)

    const [option, setOption] = useState('');

    const { socket } = useSocket()
    const dispatch = useDispatch()

    const setInputSearch = (e) => {
        setSearch(e.target.value)
    }

    const removeFromSelected = (e) => {
        const newSelectedList = selectedList.filter(el => el !== e);
        setSelectedList(newSelectedList);
        setDataSource([...dataSource, e])
    }

    useEffect(() => {
        setSelectedList([])
        setDataSource(conversationList)
    }, [])

    const onSelectedClick = (e) => {
        setSelectedList([...selectedList, e]);
        setDataSource(dataSource.filter(el => el !== e))
    }

    useEffect(() => {
        if (option === 'cancel') {
            setOption('')
            setDataSource(conversationList)
            setSelectedList([])
            onClose('ForwardModal');
        } else if (option === 'confirm') {
            forwardMessage()
            setDataSource(conversationList)
            setSelectedList([])
            setOption('')
            onClose('ForwardModal');
        }
    }, [option])

    function forwardMessage() {
        selectedList.map((e) => {
            var newList = conversationList.map(conversation => {
                console.log(conversation._id === e._id)
                if (conversation._id === e._id) {
                    if (conversation._id === currentConversation._id) {
                        return { ...conversation, lastMessage: selectedMessage, isReadMessage: true };
                    }
                    return { ...conversation, lastMessage: selectedMessage, isReadMessage: false };
                }
                return conversation;
            });
            dispatch(setListConversation(newList))

            handleForwardMessage(e, selectedMessage, currentConversation, dispatch)
                .then(response => {
                    console.log(response)
                    socket.emit("message:send", {
                        ...response,
                        conversation: e,
                    })
                })
        })
    }

    return (
        <div className='w-[400px] max-h-[80%] absolute h-auto flex flex-col bg-white p-5 rounded-lg'>
            <HeaderModal name={"Forward message"} />
            <div className="w-full h-auto flex justify-between items-center gap-2">
                <div className="w-full h-11 bg-pink-100 input input-bordered flex items-center gap-5">
                    <input type="text" className="grow" placeholder="Search" onChange={(setInputSearch)} />
                </div>
                <CustomButton name={'Search'} onClick={() => { }} />
            </div>
            {
                selectedList && selectedList.length > 0 && <div className='w-full mt-2 mb-2 max-h-[20] p-2 flex justify-start items-center gap-2 p-2 whitespace-nowrap text-ellipsis overflow-x-auto overflow-y-hidden'>
                    {
                        selectedList.map((e) => (<div key={e._id} className="w-auto h-12 p-2 text-nowrap flex gap-2 justify-between rounded-lg border-pink-500 border-2 text-secondary">
                            {e.name}
                            <div onClick={() => removeFromSelected(e)} className="hover:bg-pink-300 flex justify-center items-center p-1 rounded-full">{icons.xClose}</div>
                        </div>))
                    }
                </div>
            }
            <div className='w-full overflow-auto h-auto'>
                {dataSource ? dataSource.map((e, index) => (<div key={index} onClick={() => onSelectedClick(e)} >
                    <ConversationForwardCard props={e} />
                </div>))
                    : <ConversationSkeleton />
                }
            </div>
            <div className='flex justify-end items-center'><Button value={setOption} /></div>
        </div>
    )
}