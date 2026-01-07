import { TYPES } from "#src/di/types.js";
import { inject, injectable } from "inversify";
import { S3MapServiceImpl } from "./S3Map.service.impl.js";
import { Map } from "#src/infrastructure/sequelize/models/map.js";
import { TypeofMapFullSchema } from "./schemas/MapFull.schema.js";
import { TypeofMapPreviewSchema } from "./schemas/MapPreview.schema.js";

@injectable()
export class MapMapper {
    constructor(
        @inject(TYPES.S3MapService) private s3: S3MapServiceImpl
    ) {}

    async toFull(map: Map): Promise<TypeofMapFullSchema> {
        const urls = await this.s3.getSignedUrls([map.key])
        return {
            id: map.id,
            slug: map.slug,
            title: map.title,
            description: map.description,
            year: map.year,
            key: urls[map.key]
        }
    }

    async toPreview(maps: Map[]): Promise<TypeofMapPreviewSchema[]> {
        const json = maps.map(map => map.toJSON())
        const modifiedMaps = await Promise.all(json.map(async map => {
            const urls = await this.s3.getSignedUrls([map.key])
            return {
                id: map.id,
                slug: map.slug,
                title: map.title,
                year: map.year,
                key: urls[map.key],
            }
        }))
        return modifiedMaps
    }
}