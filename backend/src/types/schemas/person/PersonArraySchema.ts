import { z } from 'zod'
import { PersonSchema } from './Person.schema'


export const PersonArrayJsonSchema = z.object({
    data: z.array(PersonSchema)
})

export const PersonArraySchema = z.array(PersonSchema)


export type TypeofPersonArraySchema = z.infer<typeof PersonArraySchema>