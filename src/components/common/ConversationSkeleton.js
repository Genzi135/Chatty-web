export default function ConversationSkeleton() {
    return (
        <div className="p-2">
            <div className="w-full flex justify-start items-center p-4 text-gray-200 shadow-2xl rounded-lg">
                <div className="flex gap-4 items-center">
                    <div className="skeleton w-16 h-16 rounded-full shrink-0 bg-gray-300"></div>
                    <div className="flex flex-col gap-4">
                        <div className="skeleton h-4 w-20 bg-gray-300"></div>
                        <div className="skeleton h-4 w-28 bg-gray-300"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

