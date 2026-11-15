import type { Campaign } from '../types/campaign'

// Campaign 0 holds leads without a campaign; it can't be renamed or deleted.
// Same rule as the backend (name, case- and space-insensitive).
export const isDefaultCampaign = (campaign: Campaign) =>
    campaign.title.trim().toLowerCase() === '0'
