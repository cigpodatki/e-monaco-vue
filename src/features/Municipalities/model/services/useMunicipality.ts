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
    refetch: Ref<() => void>
}

export const useMunicipality = (): UseMunicipalityData => {
    const municipalitiesFilterStore = useMunicipalityFilterStore()
    const filters = ref<typeof municipalitiesFilterStore.$state | null>(null)

    const query = useQuery(
        ['municipalities', filters],
        async () => {
            const page = filters.value?.page || 1
            const response = await $api.get('municipalities', {
                params: {
                    ...filters.value,
                    // Use the selected page size (it used the default 16, so
                    // page 2 of a 50-row page started at row 17).
                    skip: (page - 1) * (filters.value?.take ?? PAGE_SIZE),
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
