// The backend message (e.g. 409 "Kampania o nazwie … już istnieje") or the
// fallback. Validation errors from class-validator come as an array.
export function getApiErrorMessage(error: unknown, fallback: string): string {
    const message = (error as { response?: { data?: { message?: unknown } } })
        ?.response?.data?.message

    if (Array.isArray(message)) {
        return message.join(', ')
    }

    return typeof message === 'string' && message ? message : fallback
}
