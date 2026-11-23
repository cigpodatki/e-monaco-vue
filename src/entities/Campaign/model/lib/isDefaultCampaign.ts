import type { Campaign } from '../types/campaign'

// Same rule as the backend: name '0', case- and space-insensitive.
export const isDefaultCampaign = (campaign: Campaign) =>
    campaign.title.trim().toLowerCase() === '0'
