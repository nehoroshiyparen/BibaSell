import { TYPES } from "src/di/types";

export const ROUTES = [
    { path: '/persons', router: TYPES.PersonRouter },
    { path: '/rewards', router: TYPES.RewardRouter },
]