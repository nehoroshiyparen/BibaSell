import { ConditionCase } from "./ConditionField.interface.js";

export interface ResponsePayload<T> {
    cases: ConditionCase[]
    data?: T
}