<script setup lang="ts">
import cls from './CampaignManagementTable.module.scss'
import { computed, ref } from 'vue'
import Button from '@/shared/ui/Button/Button.vue'
import Flex from '@/shared/ui/Flex/Flex.vue'
import Icon from '@/shared/ui/Icon/Icon.vue'
import Text from '@/shared/ui/Text/Text.vue'
import AddIcon from '@/shared/assets/icons/Add.vue'
import LoaderContainer from '@/shared/ui/LoaderContainer/LoaderContainer.vue'
import ConfirmDeleteModal from '@/shared/ui/ConfirmDeleteModal/ConfirmDeleteModal.vue'
import { formatDate } from '@/shared/lib/date'
import { type Campaign, isDefaultCampaign } from '@/entities/Campaign'
import { useCampaigns } from '../../model/services/useCampaign'
import { useDeleteCampaign } from '../../model/services/useDeleteCampaign'
import CampaignNameModal from '../CampaignNameModal/CampaignNameModal.vue'

// The backend already sorts: newest first, campaign 0 last.
const { data, isLoading } = useCampaigns()
const { mutate: deleteCampaign, isLoading: isDeleting } = useDeleteCampaign()

// null = add a new campaign; a campaign = rename it.
const isNameModalOpen = ref(false)
const editedCampaign = ref<Campaign | null>(null)

const campaignToDelete = ref<Campaign | null>(null)
const isDeleteModalOpen = computed({
    get: () => !!campaignToDelete.value,
    set: (open: boolean) => {
        if (!open) campaignToDelete.value = null
    },
})

function openAdd() {
    editedCampaign.value = null
    isNameModalOpen.value = true
}

function openRename(campaign: Campaign) {
    editedCampaign.value = campaign
    isNameModalOpen.value = true
}

function confirmDelete() {
    if (campaignToDelete.value) {
        deleteCampaign(campaignToDelete.value.id)
    }
}
</script>

<template>
    <Flex
        direction="column"
        align="start"
        gap="16"
    >
        <Button
            variant="secondary"
            :max="false"
            @click="openAdd"
        >
            <Icon
                color="primary-variant"
                :icon="AddIcon"
            />
            Dodaj kampanię
        </Button>

        <!-- The app doesn't scroll the page (overflow: hidden), so the table scrolls itself. -->
        <div :class="cls.tableWrapper">
            <table :class="cls.CampaignManagementTable">
                <thead :class="cls.header">
                    <tr>
                        <th :class="cls.cell">Nazwa</th>
                        <th :class="cls.cell">Utworzono</th>
                        <th :class="cls.cell"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(campaign, index) in data"
                        :key="campaign.id"
                        :class="[cls.row, { [cls.marked]: index % 2 === 0 }]"
                    >
                        <td :class="[cls.cell, cls.name]">
                            {{ campaign.title }}
                        </td>
                        <td :class="cls.cell">
                            {{ formatDate(new Date(campaign.createdAt)) }}
                        </td>
                        <td :class="cls.cell">
                            <Text
                                v-if="isDefaultCampaign(campaign)"
                                size="size_s"
                                color="quinary"
                                >Kampania domyślna, nie można jej zmienić</Text
                            >
                            <Flex
                                v-else
                                gap="8"
                            >
                                <Button
                                    size="size_s"
                                    variant="secondary"
                                    :max="false"
                                    @click="openRename(campaign)"
                                    >Zmień nazwę</Button
                                >
                                <Button
                                    size="size_s"
                                    variant="danger"
                                    :max="false"
                                    :disabled="isDeleting"
                                    @click="campaignToDelete = campaign"
                                    >Usuń</Button
                                >
                            </Flex>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <LoaderContainer :is-loading="isLoading" />

        <CampaignNameModal
            v-model:is-modal-open="isNameModalOpen"
            :campaign="editedCampaign"
        />

        <ConfirmDeleteModal
            v-model:is-open="isDeleteModalOpen"
            title="Usunięcie kampanii"
            :message="`Czy na pewno chcesz usunąć kampanię „${campaignToDelete?.title}”? Jej leady zostaną przeniesione do kampanii 0.`"
            @confirm-delete="confirmDelete"
        />
    </Flex>
</template>
