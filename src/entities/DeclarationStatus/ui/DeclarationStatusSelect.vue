<script setup lang="ts">
import Select from '@/shared/ui/Select/Select.vue'
import { useField } from 'vee-validate'
import { toRefs, watch } from 'vue'
import {
    DeclarationStatus,
    declarationStatusOptions,
} from '../model/declarationStatus'

interface Props {
    asInput?: boolean
    label?: string
    name: string
    defaultValue?: DeclarationStatus | DeclarationStatus[]
    multiple?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update', 'update:modelValue'])

const { name, defaultValue, multiple } = toRefs(props)

const { errorMessage, value, handleChange } = useField<
    DeclarationStatus | DeclarationStatus[]
>(name, undefined, {
    initialValue:
        defaultValue?.value ??
        (multiple?.value ? [] : DeclarationStatus.UNKNOWN),
})

function onUpdate(newValue: DeclarationStatus | DeclarationStatus[]) {
    handleChange(newValue)
    emit('update', newValue)
    emit('update:modelValue', newValue)
}

watch(defaultValue!, () => {
    handleChange(defaultValue?.value)
})
</script>

<template>
    <Select
        v-bind="$props"
        v-model="value"
        :multiple="multiple"
        :hide-values="multiple"
        :options="declarationStatusOptions"
        :error-message="errorMessage"
        @update:model-value="onUpdate"
    />
</template>
