export const isValidDateFormat = (dateString: string) => {
    const datePattern = /^\d{1,2}\.\d{1,2}\.\d{4}$/

    if (!datePattern.test(dateString)) {
        return false
    }

    const [, month] = dateString.split('.').map(Number)

    if (month < 1 || month > 12) {
        return false
    }

    return true
}

import dayjs from 'dayjs'
import 'dayjs/locale/pl'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.locale('pl')

// Start of today in the user's time zone. Next-contact dates before it are overdue.
export function startOfToday(): Date {
    return dayjs().startOf('day').toDate()
}

// CR task 10: a next-contact date before today. Today, the future and no date are fine.
export function isOverdue(date?: string | Date | null): boolean {
    return !!date && dayjs(date).isBefore(startOfToday())
}

export function formatDate(date: Date): string {
    const inputDate = dayjs(date)

    return inputDate.format('DD.MM.YYYY')
}
