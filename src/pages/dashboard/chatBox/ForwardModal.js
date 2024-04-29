import HeaderModal from '../../../components/common/HeaderModal'
import CustomButton from '../../../components/common/CustomButton'
export default function ForwardModal() {
    return (
        <div className='w-[400px] h-auto flex flex-col bg-white p-5'>
            <HeaderModal name={"Forward message"} />
            <div className='flex justify-end items-center'><CustomButton name={'Confirm'} /></div>
        </div>
    )
}