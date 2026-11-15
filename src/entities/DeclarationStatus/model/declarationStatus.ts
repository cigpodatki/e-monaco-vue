import type { SelectOption } from '@/shared/ui/Select/types'

export enum DeclarationStatus {
    UNKNOWN = 'unknown',
    NO = 'no',
    DECLARATION = 'declaration',
    FULL = 'full',
}

export const declarationStatusLabels: Record<DeclarationStatus, string> = {
    [DeclarationStatus.UNKNOWN]: '?',
    [DeclarationStatus.NO]: 'NIE',
    [DeclarationStatus.DECLARATION]: 'DEKL',
    [DeclarationStatus.FULL]: 'PEŁN',
}

export const declarationStatusOptions: SelectOption[] = Object.values(
    DeclarationStatus,
).map((status) => ({ id: status, name: declarationStatusLabels[status] }))
