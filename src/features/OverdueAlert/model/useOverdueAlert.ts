import { ref } from 'vue'
import { $api } from '@/shared/api/api'
import { startOfToday } from '@/shared/lib/date'

// Module-level, so it survives the redirect from the login page to the
// dashboard (where the modal is rendered). Reset on a full page reload.
const isOpen = ref(false)

// CR task 10: after login, warn the user if they own leads with a
// next-contact date in the past.
async function checkOverdueLeads() {
    try {
        const response = await $api.get<{ count: number }>(
            'companies/overdue/count',
            { params: { before: startOfToday().toISOString() } },
        )
        isOpen.value = response.data.count > 0
    } catch (error) {
        // Only a reminder: a failure here must never block the login.
        console.error('Overdue leads check failed:', error)
    }
}

export const useOverdueAlert = () => ({ isOpen, checkOverdueLeads })
