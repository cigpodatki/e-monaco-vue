<script setup lang="ts">
import cls from './FetchingOverlay.module.scss'
import { onBeforeUnmount, ref, toRefs, watch } from 'vue'
// @ts-ignore
import Loader from 'vue-spinner/src/BeatLoader.vue'

// For loads the user asked for (page, size, filter, sort): pass
// isFetching && isPreviousData, so background refreshes don't show it.
interface Props {
    isFetching: boolean
    blocking?: boolean
}

// Quick reloads (e.g. after an inline edit) finish first, so nothing flashes.
const SHOW_AFTER_MS = 300

const props = defineProps<Props>()
const { isFetching } = toRefs(props)

const isVisible = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

watch(
    isFetching,
    (fetching) => {
        clearTimeout(timer)
        if (fetching) {
            timer = setTimeout(() => (isVisible.value = true), SHOW_AFTER_MS)
        } else {
            isVisible.value = false
        }
    },
    { immediate: true },
)

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
    <Teleport to="body">
        <div
            v-if="isVisible"
            :class="[cls.FetchingOverlay, { [cls.blocking]: blocking }]"
            role="status"
            aria-label="Ładowanie"
        >
            <div :class="cls.box">
                <Loader
                    color="var(--primary-variant-color)"
                    size="10px"
                />
            </div>
        </div>
    </Teleport>
</template>
