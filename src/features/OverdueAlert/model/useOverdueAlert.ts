import { ref } from 'vue'
import { $api } from '@/shared/api/api'
import { startOfToday } from '@/shared/lib/date'

// Module-level, so it survives the redirect to the dashboard.
const isOpen = ref(false)

async function checkOverdueLeads() {
    try {
        const response = await $api.get<{ count: number }>(
            'companies/overdue/count',
            { params: { before: startOfToday().toISOString() } },
        )
        isOpen.value = response.data.count > 0
    } catch (error) {
        // Never block the login.
        console.error('Overdue leads check failed:', error)
    }
}

export const useOverdueAlert = () => ({ isOpen, checkOverdueLeads })
