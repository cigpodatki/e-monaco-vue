import type { CompanyStatus } from '../types/status'

export interface StatusColors {
    color: string
    bgColor: string
}

const red = {
    bgColor: 'var(--status-red-medium)',
    color: 'var(--text-color-red-medium)',
}
const orange = {
    bgColor: 'var(--status-yellow-orange-medium)',
    color: 'var(--text-color-yellow-orange-medium)',
}

// Colours are a frontend concern; labels and rules come from the backend.
const groupColors: Record<string, StatusColors> = {
    base: {
        bgColor: 'var(--status-light-grey-bg-color)',
        color: 'var(--status-green-color)',
    },
    dropped: red,
    small_savings: orange,
    negative: red,
}

const statusColors: Record<CompanyStatus, StatusColors> = {
    cannot_be_called: orange,
    next_campaign: {
        bgColor: 'var(--status-purple-pastel)',
        color: 'var(--text-color-purple-pastel)',
    },
    conversation: {
        bgColor: 'var(--status-green-lightest)',
        color: 'var(--text-color-lightest-green)',
    },
    offer: {
        bgColor: 'var(--status-green-lighter)',
        color: 'var(--text-color-lighter-green)',
    },
    agreement: {
        bgColor: 'var(--status-green-light)',
        color: 'var(--text-color-light-green)',
    },
    documents: {
        bgColor: 'var(--status-green-medium)',
        color: 'var(--text-color-medium-green)',
    },
    declaration: {
        bgColor: 'var(--status-green-medium)',
        color: 'var(--text-color-medium-green)',
    },
    invoice: {
        bgColor: 'var(--status-green-medium)',
        color: 'var(--text-color-medium-green)',
    },
    our_client: {
        bgColor: 'var(--status-green-dark)',
        color: 'var(--text-color-dark-green)',
    },
    former_client: {
        bgColor: 'var(--status-brown-red-medium)',
        color: 'var(--text-color-brown-red-medium)',
    },
    other: {
        bgColor: 'var(--status-blue-bg-color)',
        color: 'var(--status-blue-color)',
    },
}

export const getStatusColors = (
    code?: CompanyStatus,
    group?: string,
): StatusColors | undefined =>
    (code && statusColors[code]) || (group ? groupColors[group] : undefined)
