import { TYPES } from "#src/di/types.js";
import { inject, injectable } from "inversify";
import { S3PersonServiceImpl } from "../services/S3Person.service.impl.js";
import { Person } from "#src/infrastructure/sequelize/models/Person/Person.model.js";
import { TypeofPersonFullSchema } from "../schemas/PersonFull.schema.js";
import { TypeofPersonPreviewSchema } from "../schemas/PersonPreview.schema.js";

@injectable()
export class PersonMapper {
    constructor(
        @inject(TYPES.S3PersonService) private s3: S3PersonServiceImpl
    ) {}

    async toFull(person: Person): Promise<TypeofPersonFullSchema> {
        const urls = await this.s3.getSignedUrls([person.key])

        const rewards = person.rewards ?? [];
        const rewardUrls = await this.s3.getSignedUrls(rewards.map(reward => reward.key))
        
        return {
            ...person.toJSON(),
            key: urls[person.key],
            rewards: person.rewards?.map(reward => ({
                key: rewardUrls[reward.key],
                label: reward.label
            }))
        }
    }

    async toPreview(persons: Person[]): Promise<TypeofPersonPreviewSchema[]>  {
        const json = persons.map(person => person.toJSON())
        const modifiedPersons = await Promise.all(json.map(async person => {
            const urls = await this.s3.getSignedUrls([person.key])
            return {
                id: person.id,
                slug: person.slug,
                key: urls[person.key],
                name: person.name,
                description: person.description
            }
        }))
        return modifiedPersons
    }
}