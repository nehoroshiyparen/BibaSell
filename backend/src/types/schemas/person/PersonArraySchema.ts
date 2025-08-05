import { z } from 'zod'
import { PersonSchema } from './Person.schema'


export const PersonArraySchema = z.array(PersonSchema)
export type PersonArray = z.infer<typeof PersonArraySchema>