import { $api } from '@/shared/api/api'
import { useMutation, useQueryClient } from 'vue-query'
import { useToast } from 'vue-toastification'
import type { Campaign } from '@/entities/Campaign'
import { getApiErrorMessage } from '../lib/getApiErrorMessage'

export const useUpdateCampaign = (onSuccess?: () => void) => {
    const toast = useToast()
    const queryClient = useQueryClient()

    return useMutation(
        'update-campaign',
        async ({ id, title }: { id: string; title: string }) => {
            const response = await $api.put<Campaign>(`campaigns/${id}`, {
                title,
            })
            return response.data
        },
        {
            onSuccess: () => {
                toast.success('Pomyślnie zmieniono nazwę kampanii')
                queryClient.invalidateQueries('campaigns')
                // The lead table shows campaign names.
                queryClient.invalidateQueries('companies')
                onSuccess?.()
            },
            onError: (error) => {
                toast.error(
                    getApiErrorMessage(
                        error,
                        'Nie udało się zmienić nazwy kampanii. Spróbuj ponownie później',
                    ),
                )
            },
        },
    )
}
