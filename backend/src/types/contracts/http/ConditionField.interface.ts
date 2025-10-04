type ConditionFn = () => boolean

export interface ConditionCase {
    condition: ConditionFn
    status: number,
    message: string,
}