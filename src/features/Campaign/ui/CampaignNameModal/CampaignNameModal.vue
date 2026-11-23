<script setup lang="ts">
import cls from './CampaignNameModal.module.scss'
import Modal from '@/shared/ui/Modal/Modal.vue'
import Flex from '@/shared/ui/Flex/Flex.vue'
import Input from '@/shared/ui/Input/Input.vue'
import Button from '@/shared/ui/Button/Button.vue'
import { Form } from 'vee-validate'
import * as yup from 'yup'
import { computed, toRefs } from 'vue'
import type { Campaign } from '@/entities/Campaign'
import { useAddCampaign } from '../../model/services/useAddCampaign'
import { useUpdateCampaign } from '../../model/services/useUpdateCampaign'

// Adds without `campaign`, renames with it.
interface Props {
    isModalOpen: boolean
    campaign?: Campaign | null
}

const props = defineProps<Props>()
const { campaign } = toRefs(props)
const emit = defineEmits(['update:isModalOpen'])

const isRename = computed(() => !!campaign?.value)

function close() {
    emit('update:isModalOpen', false)
}

const addCampaign = useAddCampaign(close)
const updateCampaign = useUpdateCampaign(close)
const isLoading = computed(
    () => addCampaign.isLoading.value || updateCampaign.isLoading.value,
)

// Uniqueness is checked by the backend (409).
const schema = yup.object({
    title: yup
        .string()
        .trim()
        .required('Nazwa kampanii jest obowiązkowa')
        .max(100, 'Nazwa kampanii może mieć najwyżej 100 znaków'),
})

function onSubmit(values: Record<string, unknown>) {
    const title = String(values.title ?? '').trim()

    if (campaign?.value) {
        updateCampaign.mutate({ id: campaign.value.id, title })
    } else {
        addCampaign.mutate({ title })
    }
}
</script>

<template>
    <Modal
        :is-open="isModalOpen"
        :title="isRename ? 'Zmiana nazwy kampanii' : 'Dodanie kampanii'"
        @update:isOpen="emit('update:isModalOpen', $event)"
    >
        <Form
            :validation-schema="schema"
            :initial-values="{ title: campaign?.title ?? '' }"
            @submit="onSubmit"
        >
            <Flex
                gap="8"
                direction="column"
                align="start"
                :class="cls.wrapper"
            >
                <Input
                    name="title"
                    :model-value="campaign?.title ?? ''"
                    label="Nazwa kampanii"
                    required
                    placeholder="Np. 15 lato"
                />
            </Flex>
            <div :class="cls.footer">
                <Button
                    :class="cls.button"
                    :disabled="isLoading"
                    >{{ isRename ? 'Zapisz' : 'Dodaj' }}</Button
                >
            </div>
        </Form>
    </Modal>
</template>
