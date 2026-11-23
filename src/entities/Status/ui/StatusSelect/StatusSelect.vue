<script setup lang="ts">
import cls from './StatusSelect.module.scss'
import selectCls from '@/shared/ui/Select/Select.module.scss'
import { computed, ref, toRefs, watch } from 'vue'
import { useField } from 'vee-validate'
import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from '@headlessui/vue'
import { Float } from '@headlessui-float/vue'
import { useToast } from 'vue-toastification'
import SelectIcon from '@/shared/assets/icons/Select.vue'
import CheckIcon from '@/shared/assets/icons/Check.vue'
import Text from '@/shared/ui/Text/Text.vue'
import Error from '@/shared/ui/Error/Error.vue'
import { useStatusTree } from '../../model/services/useStatusTree'
import {
    findStatus,
    isAllowedFrom,
    validateStatusChange,
} from '../../model/lib/statusRules'
import { getStatusColors } from '../../model/consts/status'
import type { CompanyStatus, StatusDefinition } from '../../model/types/status'

interface Props {
    name: string
    defaultValue?: CompanyStatus | null
    label?: string
    asInput?: boolean
    placeholder?: string
    // Multi-edit: offer every selectable status (leads differ); the backend
    // checks each lead.
    showAllStatuses?: boolean
    // Status the transition rules start from when the field is empty
    // (e.g. a new lead starts at 1.1/1.2).
    from?: CompanyStatus
    // When given, a change that misses its requirement is refused right away.
    hasDate?: boolean
    hasPhone?: boolean
}

const props = defineProps<Props>()
const { name, defaultValue } = toRefs(props)
const emit = defineEmits(['update', 'update:modelValue'])
const toast = useToast()

const { tree } = useStatusTree()

const { errorMessage, value, handleChange } = useField<CompanyStatus | null>(
    name,
    undefined,
    { initialValue: defaultValue?.value ?? null },
)

watch(
    () => props.defaultValue,
    (next) => handleChange(next ?? null),
)

const current = computed(() => findStatus(tree.value, value.value))
const colors = computed(() =>
    getStatusColors(current.value?.code, current.value?.group),
)

// Groups the user unfolded; the current status's group starts unfolded.
const expanded = ref(new Set<string>())
const toggleGroup = (id: string) => {
    const next = new Set(expanded.value)
    next.has(id) ? next.delete(id) : next.add(id)
    expanded.value = next
}
function onOpen() {
    expanded.value = new Set(current.value?.group ? [current.value.group] : [])
}

type Entry =
    | { type: 'group'; id: string; label: string }
    | { type: 'status'; status: StatusDefinition; inGroup: boolean }

const isOffered = (status: StatusDefinition) =>
    status.code === value.value ||
    (status.selectable !== false &&
        (props.showAllStatuses ||
            isAllowedFrom(tree.value, status, value.value ?? props.from)))

// Tree order; a group shows when it has at least one offered sub-status.
const entries = computed<Entry[]>(() => {
    const result: Entry[] = []
    const seenGroups = new Set<string>()

    for (const status of tree.value.statuses.filter(isOffered)) {
        if (!status.group) {
            result.push({ type: 'status', status, inGroup: false })
            continue
        }
        if (!seenGroups.has(status.group)) {
            seenGroups.add(status.group)
            const group = tree.value.groups.find((g) => g.id === status.group)
            result.push({
                type: 'group',
                id: status.group,
                label: group?.label ?? status.group,
            })
        }
        if (expanded.value.has(status.group)) {
            result.push({ type: 'status', status, inGroup: true })
        }
    }
    return result
})

function select(target: CompanyStatus) {
    if (target === value.value) return

    if (props.hasDate !== undefined && props.hasPhone !== undefined) {
        const error = validateStatusChange(
            tree.value,
            value.value ?? props.from,
            target,
            { hasDate: props.hasDate, hasPhone: props.hasPhone },
        )
        if (error) {
            toast.error(error)
            return
        }
    }

    handleChange(target)
    emit('update', target)
    emit('update:modelValue', target)
}
</script>

<template>
    <div :class="selectCls.Select">
        <label
            v-if="label"
            :class="selectCls.label"
        >
            {{ label }}
        </label>
        <Listbox
            :model-value="value"
            @update:model-value="select"
        >
            <Float
                transition-name="fade"
                placement="bottom-start"
                :offset="4"
                portal
                origin-class="body"
            >
                <ListboxButton
                    :class="[selectCls.button, { [selectCls.input]: asInput }]"
                    :style="{
                        color: colors?.color,
                        backgroundColor: colors?.bgColor,
                    }"
                    @click="onOpen"
                >
                    <Text
                        v-if="!current"
                        size="size_s"
                        weight="medium"
                        color="secondary"
                        >{{ placeholder ?? 'Wybierz' }}</Text
                    >
                    <span v-else>{{ current.label }}</span>
                    <SelectIcon :style="{ fill: colors?.color }" />
                </ListboxButton>

                <ListboxOptions :class="selectCls.optionsWrapper">
                    <template
                        v-for="entry in entries"
                        :key="
                            entry.type === 'group'
                                ? `g:${entry.id}`
                                : entry.status.code
                        "
                    >
                        <!-- Not an option: clicking unfolds the group, the list stays open. -->
                        <button
                            v-if="entry.type === 'group'"
                            type="button"
                            :class="[selectCls.option, cls.group]"
                            @click.stop="toggleGroup(entry.id)"
                        >
                            <span
                                :class="[
                                    cls.chevron,
                                    { [cls.expanded]: expanded.has(entry.id) },
                                ]"
                                >›</span
                            >
                            {{ entry.label }}
                        </button>
                        <ListboxOption
                            v-else
                            v-slot="{ selected }"
                            :value="entry.status.code"
                            :class="[
                                selectCls.option,
                                { [cls.child]: entry.inGroup },
                            ]"
                        >
                            <span :class="cls.row">
                                {{ entry.status.label }}
                                <span
                                    v-show="selected"
                                    :class="cls.check"
                                    ><CheckIcon
                                /></span>
                            </span>
                        </ListboxOption>
                    </template>
                </ListboxOptions>
            </Float>
        </Listbox>
        <Error
            v-if="errorMessage"
            :value="errorMessage"
        />
    </div>
</template>
