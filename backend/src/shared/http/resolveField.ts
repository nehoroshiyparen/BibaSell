import { ConditionCase } from "#src/types/contracts/http/ConditionField.interface.js";

export function resolveCase<V>(cases: ConditionCase[]): ConditionCase | undefined {
    return cases.find(c => c.condition())
}