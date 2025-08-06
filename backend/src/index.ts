import { AppImpl } from "./app.impl";
import { ENV } from "./config";
import { container } from "./di/container";
import { TYPES } from "./di/types";

const app = container.get<AppImpl>(TYPES.App)

app.setup()