import type { Company } from '@/entities/Company'
import { useCompanyFilterStore } from '@/features/CompanyFilter'
import { $api } from '@/shared/api/api'
import { PAGE_SIZE } from '@/shared/const/pagination'
import { debounce } from 'lodash'
import { ref, type Ref } from 'vue'
import { useQuery } from 'vue-query'

export type CompaniesData = Ref<
    { count?: number; companies?: Company[] } | undefined
>

interface UseCompaniesData {
    data: CompaniesData
    isLoading: Ref<boolean>
    isFetching: Ref<boolean>
    // Another page/size/filter is loading behind the old rows.
    isPreviousData: Ref<boolean>
    refetch: Ref<() => void>
}

type CompanyFilters = ReturnType<typeof useCompanyFilterStore>['$state']

export const useCompanies = (): UseCompaniesData => {
    const companyFilterStore = useCompanyFilterStore()
    const filters = ref<typeof companyFilterStore.$state | null>(
        companyFilterStore.$state ?? null,
    )

    const query = useQuery(
        ['companies', filters],
        async ({ queryKey }) => {
            // Filters from the query key, not the live store, so the result matches its cache entry.
            const [, keyFilters] = queryKey as [string, CompanyFilters | null]
            const page = keyFilters?.page || 1
            const response = await $api.get('companies', {
                params: {
                    ...keyFilters,
                    // ?? not ||: take 0 means all rows.
                    skip: (page - 1) * (keyFilters?.take ?? PAGE_SIZE),
                    page: undefined,
                },
            })

            return response.data
        },
        { keepPreviousData: true },
    )

    companyFilterStore.$subscribe(
        debounce((_, state) => {
            filters.value = state
        }, 500),
    )

    return query
}
