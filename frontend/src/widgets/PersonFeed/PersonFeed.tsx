import type { PersonPreview } from "src/entities/person/model/types/PersonPreview"
import PersonFeedPreview from "src/entities/person/ui/PersonFeedPreview/PersonFeedPreview"

type PersonFeedParams = {
    persons: PersonPreview[]
}

const PersonFeed: React.FC<PersonFeedParams> = (props) => {
    return (
        <div className="_feed flex flex-col w-full max-w-850 gap-20">
            {props.persons.map(person => (
                <PersonFeedPreview person={person} key={person.id}/>
            ))}
        </div>
    )
}

export default PersonFeed