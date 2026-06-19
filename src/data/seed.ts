import type { JobType, Language, Listing } from '../types/listing'
import seedDb from '../../db.json'

export const seedListings = seedDb.listings as Listing[]
export const seedJobTypes = seedDb.jobTypes as JobType[]
export const seedLanguages = seedDb.languages as Language[]
