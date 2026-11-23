import { useCompanyFilterStore } from '@/features/CompanyFilter'
import { $api } from '@/shared/api/api'
import { PAGE_SIZE } from '@/shared/const/pagination'
import { debounce } from 'lodash'
import { ref, type Ref } from 'vue'
import { useQueryClient, type UseQueryOptions } from 'vue-query'
import type { Company } from '@/entities/Company'

interface CompaniesData {
    count?: number
    companies?: Company[]
}

interface UseCompaniesData {
    data: Ref<CompaniesData | undefined>
    isLoading: Ref<boolean>
    setPageSize: (pageSize: number) => void
}

export const useCompaniesData = (): UseCompaniesData => {
    const companyFilterStore = useCompanyFilterStore()
    const filters = ref(companyFilterStore.$state)
    const data = ref<CompaniesData | undefined>(undefined)
    const isLoading = ref(false)
    const queryClient = useQueryClient()

    const fetchData = async (): Promise<CompaniesData> => {
        try {
            const page = filters.value?.page || 1
            // ?? not ||: take 0 means all rows.
            const take = filters.value?.take ?? PAGE_SIZE
            const response = await $api.get('companies', {
                params: {
                    ...filters.value,
                    skip: (page - 1) * take,
                    take,
                    page: undefined,
                },
            })
            return response.data
        } catch (error) {
            console.error('Error fetching company data:', error)
            throw error
        }
    }

    const queryOptions: UseQueryOptions<CompaniesData> = {
        keepPreviousData: true,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    }

    const setPageSize = async (pageSize: number) => {
        // The new key refetches by itself; an invalidate would re-run the old query.
        filters.value.take = pageSize
    }

    companyFilterStore.$subscribe(
        debounce((_, state) => {
            Object.assign(filters.value, state)
            queryClient.invalidateQueries('companies')
        }, 500),
    )

    return {
        data,
        isLoading,
        setPageSize,
    }
}
