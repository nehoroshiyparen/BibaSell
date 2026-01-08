import { useAppDispatch, useAppSelector } from "src/app/store/hooks";
import type { MapFilters } from "../model/types/MapFilters";
import { fetchMaps } from "../model/map.thunks";
import type { RootState } from "src/app/store";
import type { MapPreview } from "../model/types/MapPreview";
import { pushMaps, resetMaps, resetSelectedMap, setError, setLoading, setMaps, setSelectedMap } from "../model";
import type { MapAdvanced } from "../model/types/MapAdvanced";

export function useMap() {
    const dispatch = useAppDispatch()

    const useLoad = async(params: { offset: number, limit?: number, filters?: MapFilters }) => {
        try {
            await dispatch(fetchMaps({ page: params.offset, limit: params.limit, filters: params.filters }))
        } catch (e) {
            console.log(e)
        }
    }

    const useMapState = () => {
        const maps = useAppSelector((state: RootState) => state.map.maps)
        const page = useAppSelector((state: RootState) => state.map.page)
        const hasMore = useAppSelector((state: RootState) => state.map.hasMore)
        const error = useAppSelector((state: RootState) => state.map.error)
        const isLoading = useAppSelector((state: RootState) => state.map.isLoading)
        const searchQuery = useAppSelector((state: RootState) => state.map.searchQuery)
        const selectedMap = useAppSelector((state: RootState) => state.map.selectedMap)

        const actions = {
            setMaps: (data: MapPreview[]) => dispatch(setMaps(data)),
            pushMaps: (data: MapPreview[]) => dispatch(pushMaps(data)),
            resetMaps: () => dispatch(resetMaps()),
            setSelectedMap: (val: MapAdvanced) => dispatch(setSelectedMap(val)),
            resetSelectedMap: () => dispatch(resetSelectedMap()),
            setLoading: (val: boolean) => dispatch(setLoading(val)),
            setError: (val: string | null) => dispatch(setError(val)),
        }

        return {
            maps,
            page,
            hasMore,
            error,
            isLoading,
            searchQuery,
            selectedMap,

            ...actions
        }
    }

    return { useLoad, useMapState }
}