import { useEffect } from "react"
import { startLoading } from "src/app/store/slices/loader.slice"
import { usePersons } from "src/entities/person/hooks/usePersons"
import SearchPeople from "src/features/SearchPeople/ui/SearchPeople"
import PersonFeed from "src/widgets/PersonFeed/PersonFeed"

const PersonFeedPage = () => {
    const { persons, isLoading , error, load } = usePersons()

    useEffect(() => {
        load()
    }, [])

    return (
        <div className="w-screen flex justify-center">
            <div className="w-full box-border pl-70 pr-70">
                <div className="flex flex-col gap-20 box-border pt-25 items-center">
                    <SearchPeople/>
                    <PersonFeed persons={persons}/>
                </div>
            </div>
        </div>
    )
}

export default PersonFeedPage