import type { Company } from '@/entities/Company'

export interface ContactPerson {
    id: string
    firstName: string
    lastName?: string
    role?: string
    phone?: string
    phone2?: string
    email?: string
    top: boolean
    company: Company
}
