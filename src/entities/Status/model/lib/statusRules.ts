import type {
    CompanyStatus,
    StatusDefinition,
    StatusTree,
} from '../types/status'

// Mirrors validateStatusChange in the backend (const/status-tree.ts), so the
// dropdown can reject a change at once. The backend still checks every change.

export const findStatus = (tree: StatusTree, code?: CompanyStatus | null) =>
    tree.statuses.find((status) => status.code === code)

export function isAllowedFrom(
    tree: StatusTree,
    target: StatusDefinition,
    current?: CompanyStatus | null,
) {
    if (target.from === 'any' || !current) return true
    const currentGroup = findStatus(tree, current)?.group
    return target.from.some((from) => from === current || from === currentGroup)
}

export function validateStatusChange(
    tree: StatusTree,
    current: CompanyStatus | null | undefined,
    target: CompanyStatus,
    lead: { hasDate: boolean; hasPhone: boolean },
): string | null {
    if (current === target) return null

    const definition = findStatus(tree, target)
    if (!definition || definition.selectable === false) {
        return `Statusu „${definition?.label ?? target}” nie można wybrać.`
    }
    if (!isAllowedFrom(tree, definition, current)) {
        const from = findStatus(tree, current)?.label ?? current
        return `Niedozwolona zmiana statusu z „${from}” na „${definition.label}”.`
    }
    if (definition.requiresPhone && !lead.hasPhone)
        return 'brak numeru telefonu'
    if (definition.requiresDate && !lead.hasDate) {
        return 'brak daty następnego kontaktu'
    }
    return null
}

export const hasPhone = (
    persons: { phone?: string | null; phone2?: string | null }[] = [],
) => persons.some((person) => !!person.phone?.trim() || !!person.phone2?.trim())
