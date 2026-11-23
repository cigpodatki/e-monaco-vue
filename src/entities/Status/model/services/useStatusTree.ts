import { $api } from '@/shared/api/api'
import { computed } from 'vue'
import { useQuery } from 'vue-query'
import type { StatusTree } from '../types/status'

const EMPTY: StatusTree = { groups: [], statuses: [] }

// Loaded once per session and shared by every status dropdown.
export const useStatusTree = () => {
    const query = useQuery(
        ['statuses'],
        async () => (await $api.get<StatusTree>('statuses')).data,
        { staleTime: Infinity, refetchOnWindowFocus: false },
    )
    const tree = computed(() => query.data.value ?? EMPTY)

    return { tree, isLoading: query.isLoading }
}
