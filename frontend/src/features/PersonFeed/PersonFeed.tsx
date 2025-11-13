import type { PersonPreview } from "src/entities/person/model/types/PersonPreview"
import PersonFeedPreview from "src/entities/person/ui/PersonFeedPreview/PersonFeedPreview"

type PersonFeedParams = {
    persons: PersonPreview[]
}

const PersonFeed: React.FC<PersonFeedParams> = ({ persons }) => {
    return (
        <div className="_feed-persons flex flex-col w-full max-w-850 gap-20">
            {persons.map(person => (
                <PersonFeedPreview person={person} key={person.id}/>
            ))}
        </div>
    )
}

export default PersonFeed