"use client"

import { useEffect, useState } from "react"
import { getParticipant } from "../actions/getInfo"
import Image from "next/image"
import { Trophy, Medal, Award, ThumbsUp, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"

interface Data {
    upvote: number;
    user: {
        name: string | null;
        image: string | null;
        branch: {
            name: string;
        } | null;
    };
}

export function LeaderBoard({ contestId }: { contestId: string }) {
    const [error, setError] = useState("")
    const [data, setData] = useState<Data[]>()
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const fetchData = async () => {
        setIsLoading(true)
        setError("")
        try {
            const response = await getParticipant(contestId)
            
            if (!response) {
                setError("Something went wrong")
                return
            }
            
            // Sort participants by upvotes (highest first)
            const sortedData = response?.sort((a, b) => b.upvote - a.upvote)
            setData(sortedData)
        } catch (err) {
            setError("Failed to fetch participants")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [contestId])

    // Function to render trophy or medal based on rank
    const getRankIcon = (index: number) => {
        switch (index) {
            case 0:
                return <Trophy className="text-yellow-400 w-6 h-6" />
            case 1:
                return <Medal className="text-gray-400 w-6 h-6" />
            case 2:
                return <Medal className="text-amber-700 w-6 h-6" />
            default:
                return <Award className="text-black w-5 h-5" />
        }
    }

    // Function to get background style based on rank
    const getCardStyle = (index: number) => {
        switch (index) {
            case 0:
                return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-400 shadow-md"
            case 1:
                return "bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300"
            case 2:
                return "bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-600"
            default:
                return "bg-white border border-gray-200 hover:border-yellow-300"
        }
    }

    return (
        <div className="bg-gray-50 rounded-lg shadow-lg p-4 sm:p-6 max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-center sm:text-left mb-1">Contest Leaderboard</h2>
                    <p className="text-center sm:text-left text-gray-600">Vote for the hottest guy from the institute</p>
                </div>
                
                <button
                    onClick={() => router.push("/vote")}
                    className="mt-4 sm:mt-0 flex cursor-pointer items-center justify-center gap-2 px-4 py-2 rounded-full font-semibold transition-colors bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                    <ThumbsUp className="w-4 h-4" />
                    Vote
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
                </div>
            ) : error ? (
                <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center justify-between">
                    <p>{error}</p>
                    <button 
                        onClick={fetchData}
                        className="text-red-700 hover:text-red-900"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
            ) : data && data.length > 0 ? (
                <div className="space-y-4">
                    {data.map((participant, index) => (
                        <div
                            key={participant.user.name}
                            className={`transform transition-all duration-200 ${
                                index < 3 ? "hover:scale-102" : "hover:scale-100"
                            } ${getCardStyle(index)} rounded-lg overflow-hidden`}
                        >
                            {/* Top 3 indicators */}
                            {index < 3 && (
                                <div className={`h-1 w-full ${
                                    index === 0 ? "bg-yellow-400" : 
                                    index === 1 ? "bg-gray-400" : 
                                    "bg-amber-700"
                                }`}></div>
                            )}
                            
                            <div className="p-4">
                                {/* Desktop layout */}
                                <div className="hidden sm:flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                                            index === 0 ? "bg-yellow-200" : 
                                            index === 1 ? "bg-gray-200" : 
                                            index === 2 ? "bg-amber-200" : 
                                            "bg-gray-100"
                                        }`}>
                                            {getRankIcon(index)}
                                        </div>

                                        <div className="flex items-center">
                                            {participant.user.image ? (
                                                <div className="relative mr-3">
                                                    <Image
                                                        src={participant.user.image}
                                                        alt={participant.user.name || "User"}
                                                        width={48}
                                                        height={48}
                                                        className={`rounded-full ${
                                                            index === 0 ? "border-2 border-yellow-400" : 
                                                            index === 1 ? "border-2 border-gray-400" : 
                                                            index === 2 ? "border-2 border-amber-700" : 
                                                            "border border-gray-200"
                                                        }`}
                                                    />
                                                </div>
                                            ) : (
                                                <div className={`w-12 h-12 rounded-full mr-3 flex items-center justify-center ${
                                                    index === 0 ? "bg-yellow-200 text-yellow-800" : 
                                                    index === 1 ? "bg-gray-200 text-gray-800" : 
                                                    index === 2 ? "bg-amber-200 text-amber-800" : 
                                                    "bg-gray-200 text-gray-700"
                                                }`}>
                                                    <span className="text-lg font-medium">
                                                        {participant.user.name?.charAt(0) || "?"}
                                                    </span>
                                                </div>
                                            )}

                                            <div>
                                                <p className="font-semibold text-gray-800">{participant.user.name || "Anonymous"}</p>
                                                <p className="text-sm text-gray-500">{participant.user.branch?.name || "No Branch"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <div className={`${
                                            index === 0 ? "bg-yellow-500 text-black" : 
                                            index === 1 ? "bg-gray-600 text-white" : 
                                            index === 2 ? "bg-amber-700 text-white" : 
                                            "bg-black text-yellow-400"
                                        } px-4 py-2 rounded-full font-semibold`}>
                                            {participant.upvote} {participant.upvote === 1 ? "vote" : "votes"}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Mobile layout */}
                                <div className="sm:hidden">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center">
                                            <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-2 ${
                                                index === 0 ? "bg-yellow-200" : 
                                                index === 1 ? "bg-gray-200" : 
                                                index === 2 ? "bg-amber-200" : 
                                                "bg-gray-100"
                                            }`}>
                                                {getRankIcon(index)}
                                            </div>
                                            <span className="font-bold text-lg">
                                                #{index + 1}
                                            </span>
                                        </div>
                                        
                                        <div className={`${
                                            index === 0 ? "bg-yellow-500 text-black" : 
                                            index === 1 ? "bg-gray-600 text-white" : 
                                            index === 2 ? "bg-amber-700 text-white" : 
                                            "bg-black text-yellow-400"
                                        } px-3 py-1 rounded-full font-semibold text-sm`}>
                                            {participant.upvote} {participant.upvote === 1 ? "vote" : "votes"}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center mt-2">
                                        {participant.user.image ? (
                                            <div className="relative mr-3">
                                                <Image
                                                    src={participant.user.image}
                                                    alt={participant.user.name || "User"}
                                                    width={40}
                                                    height={40}
                                                    className={`rounded-full ${
                                                        index === 0 ? "border-2 border-yellow-400" : 
                                                        index === 1 ? "border-2 border-gray-400" : 
                                                        index === 2 ? "border-2 border-amber-700" : 
                                                        "border border-gray-200"
                                                    }`}
                                                />
                                            </div>
                                        ) : (
                                            <div className={`w-10 h-10 rounded-full mr-3 flex items-center justify-center ${
                                                index === 0 ? "bg-yellow-200 text-yellow-800" : 
                                                index === 1 ? "bg-gray-200 text-gray-800" : 
                                                index === 2 ? "bg-amber-200 text-amber-800" : 
                                                "bg-gray-200 text-gray-700"
                                            }`}>
                                                <span className="font-medium">
                                                    {participant.user.name?.charAt(0) || "?"}
                                                </span>
                                            </div>
                                        )}

                                        <div>
                                            <p className="font-semibold text-gray-800">{participant.user.name || "Anonymous"}</p>
                                            <p className="text-xs text-gray-500">{participant.user.branch?.name || "No Branch"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-white rounded-lg shadow">
                    <p className="text-gray-500 mb-3">No participants found</p>
                    <button 
                        onClick={fetchData}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center mx-auto gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                </div>
            )}
        </div>
    )
}