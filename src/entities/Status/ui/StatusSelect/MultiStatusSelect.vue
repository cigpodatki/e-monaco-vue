<script setup lang="ts">
import Select from '@/shared/ui/Select/Select.vue'
import { useField } from 'vee-validate'
import { computed, toRefs, watch } from 'vue'
import { useStatusTree } from '../../model/services/useStatusTree'
import type { CompanyStatus } from '../../model/types/status'

interface Props {
    asInput?: boolean
    label?: string
    type?: string
    name: string
    defaultValue?: CompanyStatus[]
}

const props = defineProps<Props>()
const emit = defineEmits(['update'])

const { name, defaultValue } = toRefs(props)

const { tree } = useStatusTree()

// Flat, in tree order; sub-statuses carry their group's name. Includes the
// legacy status, so those leads can be found and reclassified.
const options = computed(() =>
    tree.value.statuses.map((status) => {
        const group = tree.value.groups.find((g) => g.id === status.group)
        return {
            id: status.code,
            name: group ? `${group.label}: ${status.label}` : status.label,
        }
    }),
)

const { errorMessage, value, handleChange } = useField<CompanyStatus[]>(
    name,
    undefined,
    { initialValue: defaultValue?.value ?? [] },
)

function onUpdate(value: CompanyStatus[]) {
    emit('update', value)
}

watch(defaultValue!, () => {
    handleChange(defaultValue?.value ?? [])
})
</script>

<template>
    <Select
        v-bind="$props"
        v-model="value"
        hide-values
        multiple
        :options="options"
        :error-message="errorMessage"
        @update:modelValue="onUpdate"
    />
</template>
