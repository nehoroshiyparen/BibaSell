import { DatabaseStructure } from "src/types/structure";
import { sequelize } from "./config";

export const db = new DatabaseStructure('db', sequelize)