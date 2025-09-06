import { Link } from "react-router-dom"
import type { PersonPreview } from "../../model/types/PersonPreview"
import './PersonFeedPreview.css'

type PersonFeedPreviewProps = {
    person: PersonPreview
}

const PersonFeedPreview:React.FC<PersonFeedPreviewProps> = (props) => {
    return (
        <Link to={`${props.person.slug}`} className="_person-feed-preview w-full h-170 relative cursor-pointer">
            <div className="_person-feed-preview-bg"/>
            <div className="flex gap-15 h-full w-full">
                <div className="h-full">
                    <img 
                        src={props.person.image_url ? 
                            `http://localhost:8080/files/${props.person.image_url}` 
                            :
                            'images/persons/unknown.png'
                        } 
                        className="h-full aspect-[194/261] rounded-4xl"
                        style={{boxShadow: "0 0 20px rgba(0,0,0,0.4)"}}
                    />
                </div>
                <div className="flex-1 h-hull flex flex-col box-border pt-10 pb-10 gap-12">
                    <div className="_person-name">
                        <span className="text-text text-6xl font-base">
                            {props.person.name}
                        </span>
                    </div>
                    <div className="_person-desc-preview text-text text-4xl/17 font-base ">
                        <span>
                            {props.person.description}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default PersonFeedPreview