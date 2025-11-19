import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getPersonBySlugApi } from "src/entities/person/api/get/getPersonsBySlug"
import type { PersonAdvanced as PersonAdvancedType} from "src/entities/person/model/types/PersonAdvanced"
import PersonAdvanced from "src/entities/person/ui/PersonAdvanced/PersonAdvanced"

const PersonPage = () => {
    const [person, setPerson] = useState<PersonAdvancedType | null>(null)

    const { slug } = useParams<{ slug: string }>()

    useEffect(() => {
        const fetch = async() => {
            const data = await getPersonBySlugApi(slug!)
            setPerson(data)
        }

        fetch()
    }, [])

    return (
        <div className="w-full flex flex-col items-center box-border pt-60">
            <div className="w-full h-50">

            </div>
            {person 
                ?
                <PersonAdvanced person={person}/>
                : 
                null 
            }
        </div>
    )
}

export default PersonPage