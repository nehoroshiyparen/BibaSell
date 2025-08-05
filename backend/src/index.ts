import { AppStructure } from "./types/structure";
import { ENV } from "./config";
import { db } from "./database";

const app = new AppStructure(ENV.APP_NAME, ENV.APP_PORT, [db])

app.setup()