import { Link } from "react-router-dom"
import type { PersonPreview as PersonPreviewType } from "../../model/types/PersonPreview"
import './PersonPreview.css'

type PersonFeedPreviewProps = {
    person: PersonPreviewType
}

const PersonPreview:React.FC<PersonFeedPreviewProps> = ({ person }) => {
    return (
        <Link to={`${person.slug}`} className="_person-feed-preview w-full h-170 relative cursor-pointer">
            <div className="_person-feed-preview-bg"/>
            <div className="flex gap-15 h-full w-full">
                <div className="h-full">
                    <img 
                        src={person.key ? person.key : "/images/persons/unknown.png"} 
                        onLoad={(e) => (e.currentTarget.style.opacity = "1")}
                        className="h-full aspect-[194/261] rounded-4xl object-cover opacity-0 transition-opacity duration-500"
                        style={{boxShadow: "0 0 20px rgba(0,0,0,0.4)"}}
                    />
                </div>
                <div className="flex-1 h-hull flex flex-col box-border pt-10 pb-10 gap-12">
                    <div className="_person-name">
                        <span className="text-text text-6xl font-base">
                            {person.name}
                        </span>
                    </div>
                    <div className="_person-desc-preview text-text text-4xl/17 font-base ">
                        <span>
                            {person.description}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default PersonPreview