import type { Company } from '@/entities/Company'
import { $api } from '@/shared/api/api'
import { getApiErrorMessage } from '@/shared/lib/getApiErrorMessage'
import { useMutation } from 'vue-query'
import { useToast } from 'vue-toastification'
import { useCompanies } from './useCompanies'

// quiet: no toast per call (multi-edit shows one summary instead).
export const useUpdateCompany = ({ quiet = false } = {}) => {
    const toast = useToast()
    const { refetch } = useCompanies()

    return useMutation(
        ['update-company'],
        async (data: Partial<Company>) => {
            const { id, ...body } = data
            const response = await $api.put(`companies/${id}`, body)
            return response.data
        },
        {
            onSuccess: (_, data) => {
                if (quiet) return
                let flag = false
                delete data.id
                Object.keys(data).forEach((name) => {
                    if (data[name as keyof Company]) {
                        flag = true
                    }
                })
                if (flag) {
                    toast.success('Pomyślnie zaktualizowano firmę')
                } else {
                    toast.success('Pomyślnie usunięte dane')
                }
            },
            onSettled: () => {
                refetch.value()
            },
            onError: (error) => {
                if (quiet) return
                toast.error(
                    getApiErrorMessage(error, 'Wystąpił błąd. Spróbuj później'),
                )
            },
        },
    )
}
