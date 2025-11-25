export interface RewardFilters {
    label?: string
}


// На всякий случай. Просто апи то может по этим фильтрам выдать ответ, но клиент не может эти фильтры указать. 
// Опять же. Будет здесь просто на всякий
interface ExtendedRewardFilters {
    label: string,
    addition: string,
    description: string,
    count: number,
    releaseDate: Date,
}