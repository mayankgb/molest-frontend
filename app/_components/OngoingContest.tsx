'use client'

import { leaderBoardState, useContestId } from "@/store/state"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { getAllContest } from "../actions/contest"
import { $Enums } from "@prisma/client"

interface Data {
    id: string,
    name: string,
    category: $Enums.Category,
    endDate: Date
}

export function OngoingContest() {

    const session = useSession()
    const [response ,setResponse] = useState<Data[]>([])
    const {isLeaderBoard, setisLeaderBoard} = leaderBoardState()

    useEffect(() => {
        try{
            if (!session.data) {
                return
            }
            const main = async () => {
                
                const data = await getAllContest(session.data.user.instituteId || "")
                console.log("this is the contest data", data)

                if (data) {
                    setResponse(data)
                    return
                }
            
            }

            main()
        }catch(e) {
            console.log(e)
            return
        }
    },[session.data])

    const { setContestId } = useContestId()

    function handleClick(contestIds: string) {
        setContestId(contestIds)
        setisLeaderBoard()
    }

    return (
        <div className="">
            {(response && (response.length > 0)) ? (
                <div className="grid gap-6 md:grid-cols-2 mt-4 lg:grid-cols-3">
                    {response.map((contest) => (
                        <div key={contest.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                            <div className="p-5">
                                <div className="inline-block px-3 py-1 mb-3 text-xs font-medium rounded-full bg-gray-100">
                                    {contest.category}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{contest.name}</h3>
                                <p className="text-gray-500 text-sm mb-4">
                                    Ends on {new Date(contest.endDate).toLocaleDateString("en-GB", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric"
                                    })}
                                </p>
                                <div
                                    onClick={() => handleClick(contest.id)}
                                    className="block w-full text-center bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-md transition-colors"
                                >
                                    View Details
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-gray-50 rounded-lg py-8 w-full flex flex-col items-center justify-center space-y-4">
                    <h3 className="text-xl font-medium mb-2">No contests found</h3>
                    <p className="text-gray-600 mb-6">There are no active contests for your institute.</p>
                </div>
            )}
        </div>

    )
}