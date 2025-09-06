import { useState } from "react";
import type { PersonPreview } from "../model/types/PersonPreview";
import { startLoading, stopLoading } from "src/app/store/slices/loader.slice";
import { getPersonsApi } from "../api";
import { ClientError } from "src/shared/lib/errors/ClientError";

export function usePersons() {
    const [persons, setPersons] = useState<PersonPreview[]>([])
    const [isLoading, setIsloading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    // const globalLoading = useAppSelector(selectLoader)

    const load = async() => {
        startLoading()
        setError(null)
        
        try {
            const data = await getPersonsApi(0, 10)
            setPersons(data)
        } catch (e) {
            if (e instanceof ClientError) setError(e.message)
            else if (e instanceof Error) setError(e.message)
            else setError(String(e))

            console.log(e)
        } finally {
            stopLoading()
        }
    }

    return { persons, isLoading, error, load }
}