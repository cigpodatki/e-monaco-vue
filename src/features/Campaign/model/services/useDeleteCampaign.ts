import { $api } from '@/shared/api/api'
import { useMutation, useQueryClient } from 'vue-query'
import { useToast } from 'vue-toastification'
import { getApiErrorMessage } from '@/shared/lib/getApiErrorMessage'

export const useDeleteCampaign = () => {
    const toast = useToast()
    const queryClient = useQueryClient()

    return useMutation(
        'delete-campaign',
        async (id: string) => {
            const response = await $api.delete<{ movedLeads: number }>(
                `campaigns/${id}`,
            )
            return response.data
        },
        {
            onSuccess: ({ movedLeads }) => {
                toast.success(
                    movedLeads
                        ? `Usunięto kampanię. Leady przeniesione do kampanii 0: ${movedLeads}`
                        : 'Usunięto kampanię',
                )
                queryClient.invalidateQueries('campaigns')
                // Its leads moved to campaign 0.
                queryClient.invalidateQueries('companies')
            },
            onError: (error) => {
                toast.error(
                    getApiErrorMessage(
                        error,
                        'Nie udało się usunąć kampanii. Spróbuj ponownie później',
                    ),
                )
            },
        },
    )
}
