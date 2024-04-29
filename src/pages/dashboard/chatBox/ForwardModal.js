import HeaderModal from '../../../components/common/HeaderModal'
import CustomButton from '../../../components/common/CustomButton'
import FriendCard from '../../../components/common/FriendCard'
import ConversationSkeleton from '../../../components/common/ConversationSkeleton'
import { getListConversation, handleForwardMessage, handleGetFriendList } from '../../../components/shared/api'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ConversationCard from '../../../components/common/ConversationCard'
import Button from '../../../components/common/Button'
export default function ForwardModal( onClose ) {
    const [dataSource, setDataSource] = useState([])
    const [selectedList, setSelectedList] = useState([])
    const selectedMessage = useSelector((state) => state.selectedMessage)
    const conversationList = useSelector((state) => state.listConversation)

    const [option, setOption] = useState('');

    const dispatch = useDispatch()

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
            //onClose('forwardModal');
        } else if (option === 'confirm') {
            forwardMessage()

            setOption('')
            //onClose('forwardModal');
        }
    }, [option])

    function forwardMessage() {
        console.log(selectedMessage)
        selectedList.map((e) => {
            handleForwardMessage(e, selectedMessage, dispatch)
        }) 
    }

    return (
        <div className='w-[400px] h-auto flex flex-col bg-white p-5'>
            <HeaderModal name={"Forward message"} />
            {dataSource ? dataSource.map((e, index) => (<div key={index} onClick={() => onSelectedClick(e)}>
                    <ConversationCard props={e} />
                </div>))
                    : <ConversationSkeleton />
            }
            <div className='flex justify-end items-center'><Button value={setOption} /></div>
        </div>
    )
}