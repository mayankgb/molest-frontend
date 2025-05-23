"use client"

import Link from "next/link"
import { ImageIcon, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { createApproval, getNonParticipatedContest } from "@/app/actions/contest"
import { $Enums } from "@prisma/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Contest {
    id: string, 
    name: string, 
    category: $Enums.Category,
    endDate: Date
}

export default function Participate() {
    const session = useSession()
    const [contests, setContests] = useState<Contest[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    useEffect(() => {
        try {
            const main = async () => {
                setIsLoading(true)
                if (!session || !session.data || !session.data.user.instituteId) {
                    setIsLoading(false)
                    return
                }
                const response = await getNonParticipatedContest(session.data.user.instituteId, session.data.user.id)
                if (!response || response.length === 0) {
                    setContests([])
                } else {
                    setContests(response)
                }
                setIsLoading(false)
            }

            main()
        } catch(e) {
            console.log(e)
            setIsLoading(false)
            return
        }
    }, [])

    if (!session) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Authentication Error</h2>
                    <p className="text-gray-600 mb-4">You need to be signed in to view your profile.</p>
                    <Link href="/auth/signin">
                        <button className="bg-black hover:bg-gray-900 text-yellow-400 font-semibold py-2 px-4 rounded-lg transition-colors">
                            Sign In
                        </button>
                    </Link>
                </div>
            </div>
        )
    } 

    if (!session.data?.user.image) {
        return (
            <div className="flex items-center space-y-4 flex-col h-screen justify-center ">
                <div className="text-4xl ">
                Please Provide the Profile Photo to participate in the contest
                </div>
                <div onClick={() => router.push("/profile") } className="bg-yellow-400 cursor-pointer w-fit px-3 py-2 font-semibold rounded-xl">
                    Go to Profile
                </div>
            </div>
        )
    }

    async function handleClick(isValid: boolean, contestId: string) {
        try {
            if (!session.data?.user.id) {
                return    
            }
            if (isSubmitting) {
                toast.error("Already request in process")
                return
            }

            if (isValid) {
                toast("Processing your request...")
                setIsSubmitting(true)
                const response = await createApproval(session.data?.user.id, contestId)
                const newData = await getNonParticipatedContest(session.data.user.instituteId!, session.data.user.id)

                toast.success("Your approval is in pending state and if eligible admin will approve you soon")

                if (newData) {
                    setContests(newData)
                }
                setIsSubmitting(false)
            }
            return
        } catch(e) {
            console.log(e)
            toast.error("Something went wrong")
            setIsSubmitting(false)
            return
        }
    }

    return (
        <div className="min-h-screen w-full grow bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Available Contests</h1>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
                        <span className="ml-2 text-gray-600 font-medium">Loading contests...</span>
                    </div>
                ) : contests.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {contests.map((contest) => (
                            <div
                                key={contest.id}
                                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="h-40 bg-gray-200 flex items-center justify-center">
                                    <ImageIcon className="w-12 h-12 text-gray-400" />
                                </div>

                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-lg text-gray-800">{contest.name}</h3>
                                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                                            {contest.category}
                                        </span>
                                    </div>
                                    {contest.endDate && (
                                        <p className="text-sm text-gray-500 mb-4">
                                            Ends: {new Date(contest.endDate).toLocaleDateString("en-GB", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </p>
                                    )}

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleClick((contest.category === "MALE" && session.data.user.gender === "male") || (contest.category === "FEMALE" && session.data.user.gender === "female"), contest.id)}
                                            disabled={((contest.category === "MALE" && session.data.user.gender === "female") || (contest.category === "FEMALE" && session.data.user.gender === "male")) || isSubmitting}
                                            className={`${(((contest.category === "MALE" && session.data.user.gender === "male") || (contest.category === "FEMALE" && session.data.user.gender === "female"))) ? "bg-black text-yellow-400" : "bg-gray-500 text-black"}
                                            flex-1 cursor-pointer hover:bg-gray-900 font-medium py-2 px-4 rounded-lg transition-colors
                                            ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center justify-center">
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Processing...
                                                </span>
                                            ) : (contest.category === "MALE" && session.data.user.gender === "male") || (contest.category === "FEMALE" && session.data.user.gender === "female") ? "Participate" : 
                                            ((contest.category === "MALE") ? "Only Boys" : "Only Girls")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <p className="text-gray-600 mb-4">No contests available at your institute yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}