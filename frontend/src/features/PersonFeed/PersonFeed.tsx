import type { PersonPreview as PersonPreviewType } from "src/entities/person/model/types/PersonPreview"
import PersonPreview from "src/entities/person/ui/PersonFeedPreview/PersonPreview"

type PersonFeedParams = {
    persons: PersonPreviewType[]
}

const PersonFeed: React.FC<PersonFeedParams> = ({ persons }) => {
    return (
        <div className="_feed-persons flex flex-col w-full max-w-850 gap-20">
            {persons.map(person => (
                <PersonPreview person={person} key={person.id}/>
            ))}
        </div>
    )
}

export default PersonFeed