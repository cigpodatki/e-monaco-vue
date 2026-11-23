// Status codes and the tree come from the backend (GET /statuses).
export type CompanyStatus = string

export interface StatusGroupDefinition {
    id: string
    number: string
    label: string
}

export interface StatusDefinition {
    code: CompanyStatus
    number: string
    label: string
    group?: string
    from: 'any' | string[]
    requiresDate?: boolean
    requiresPhone?: boolean
    selectable?: boolean
}

export interface StatusTree {
    groups: StatusGroupDefinition[]
    statuses: StatusDefinition[]
}
