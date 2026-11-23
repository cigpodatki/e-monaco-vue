import type { Municipality } from '@/entities/Municipality'
import { useMunicipalityFilterStore } from '@/features/MunicipalitiesFilter'
import { $api } from '@/shared/api/api'
import { PAGE_SIZE } from '@/shared/const/pagination'
import { debounce } from 'lodash'
import { ref, type Ref } from 'vue'
import { useQuery } from 'vue-query'

export type MunicipalityData = Ref<
    { count?: number; municipalities?: Municipality[] } | undefined
>

interface UseMunicipalityData {
    data: MunicipalityData
    isLoading: Ref<boolean>
    isFetching: Ref<boolean>
    // Another page/size/filter is loading behind the old rows.
    isPreviousData: Ref<boolean>
    refetch: Ref<() => void>
}

export const useMunicipality = (): UseMunicipalityData => {
    const municipalitiesFilterStore = useMunicipalityFilterStore()
    const filters = ref<typeof municipalitiesFilterStore.$state | null>(null)

    const query = useQuery(
        ['municipalities', filters],
        async ({ queryKey }) => {
            // Filters from the query key, not the live store, so the result matches its cache entry.
            const [, keyFilters] = queryKey as [
                string,
                typeof municipalitiesFilterStore.$state | null,
            ]
            const page = keyFilters?.page || 1
            const response = await $api.get('municipalities', {
                params: {
                    ...keyFilters,
                    skip: (page - 1) * (keyFilters?.take ?? PAGE_SIZE),
                    page: undefined,
                },
            })

            return response.data
        },
        { keepPreviousData: true },
    )

    municipalitiesFilterStore.$subscribe(
        debounce((_, state) => {
            filters.value = state
        }, 500),
    )

    return query
}
