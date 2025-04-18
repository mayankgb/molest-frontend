"use client"

import { leaderBoardState } from "@/store/state";
import dynamic from "next/dynamic";

const OngoingContest = dynamic(() => import("@/app/_components/VotePage/contest"))
const Candidates = dynamic(() => import("@/app/_components/VotePage/CandidateCard"))

export default function Vote() {

    const { isLeaderBoard, setisLeaderBoard } = leaderBoardState()

    return (
        <div className="pt-2 pl-2 ">
            {isLeaderBoard &&
                <div onClick={() => setisLeaderBoard()} className="py-2 bg-yellow-400 w-24 text-center cursor-pointer font-semibold mb-4 mt-3 rounded-full px-3">
                    Go Back
                </div>}
            {
                isLeaderBoard ? <Candidates /> : <OngoingContest />
            }

        </div>
    )
}