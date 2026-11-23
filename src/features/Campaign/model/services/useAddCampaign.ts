import { $api } from '@/shared/api/api'
import { useMutation, useQueryClient } from 'vue-query'
import { useToast } from 'vue-toastification'
import type { Campaign } from '@/entities/Campaign'
import { getApiErrorMessage } from '@/shared/lib/getApiErrorMessage'

export const useAddCampaign = (onSuccess?: () => void) => {
    const toast = useToast()
    const queryClient = useQueryClient()

    return useMutation(
        'add-campaign',
        async (data: { title: string }) => {
            const response = await $api.post<Campaign>('campaigns', data)
            return response.data
        },
        {
            onSuccess: () => {
                toast.success('Pomyślnie dodano kampanię')
                queryClient.invalidateQueries('campaigns')
                onSuccess?.()
            },
            onError: (error) => {
                toast.error(
                    getApiErrorMessage(
                        error,
                        'Nie udało się dodać kampanii. Spróbuj ponownie później',
                    ),
                )
            },
        },
    )
}
