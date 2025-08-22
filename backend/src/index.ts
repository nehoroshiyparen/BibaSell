import { AppImpl } from "./app.impl.js";
import { container } from "./di/container.js";
import { TYPES } from "./di/types.js";

const app = container.get<AppImpl>(TYPES.App)

app.setup()