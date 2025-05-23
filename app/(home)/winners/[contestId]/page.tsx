import { Winner } from "@/app/_components/Winner/WinnerPage"

export default async function ({params} : {params: Promise<{contestId: string}>}) {

    const contestId = (await params).contestId

    if (!contestId) {
        return (
            <div>
                Invalid id 
            </div>
        )
    }

    return(
        <Winner contestId={contestId}/>
    )

}