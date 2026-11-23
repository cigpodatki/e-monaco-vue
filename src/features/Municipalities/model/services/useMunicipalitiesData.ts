import { useMunicipalityFilterStore } from '@/features/MunicipalitiesFilter'
import { $api } from '@/shared/api/api'
import { PAGE_SIZE } from '@/shared/const/pagination'
import { debounce } from 'lodash'
import { ref, type Ref } from 'vue'
import { useQuery, useQueryClient, type UseQueryOptions } from 'vue-query'
import type { Municipality } from '@/entities/Municipality'

interface MunicipalityData {
    count?: number
    municipalities?: Municipality[]
}

interface UseMunicipalityData {
    data: Ref<MunicipalityData | undefined>
    isLoading: Ref<boolean>
    setPageSize: (pageSize: number) => void
}

export const useMunicipalityData = (): UseMunicipalityData => {
    const municipalitiesFilterStore = useMunicipalityFilterStore()
    const filters = ref(municipalitiesFilterStore.$state)
    const data = ref<MunicipalityData | undefined>(undefined)
    const isLoading = ref(false)
    const queryClient = useQueryClient()

    const fetchData = async ({
        queryKey,
    }: {
        queryKey: unknown
    }): Promise<MunicipalityData> => {
        // Filters from the query key (see useCompanies).
        const [, keyFilters] = queryKey as [string, typeof filters.value]
        try {
            const page = keyFilters?.page || 1
            // ?? not ||: take 0 means all rows.
            const take = keyFilters?.take ?? PAGE_SIZE
            const response = await $api.get('municipalities', {
                params: {
                    ...keyFilters,
                    skip: (page - 1) * take,
                    take,
                    page: undefined,
                },
            })
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            throw error
        }
    }

    const queryOptions: UseQueryOptions<MunicipalityData> = {
        keepPreviousData: true,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    }

    const query = useQuery<MunicipalityData>(
        ['municipalities', filters],
        fetchData,
        queryOptions,
    )

    const setPageSize = async (pageSize: number) => {
        // The new key refetches by itself; an invalidate would re-run the old query.
        filters.value.take = pageSize
    }

    municipalitiesFilterStore.$subscribe(
        debounce((_, state) => {
            Object.assign(filters.value, state)
            queryClient.invalidateQueries('municipalities')
        }, 500),
    )

    return {
        data,
        isLoading,
        setPageSize,
    }
}
