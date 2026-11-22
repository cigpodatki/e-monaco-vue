<script setup lang="ts">
import cls from './FetchingOverlay.module.scss'
// @ts-ignore
import Loader from 'vue-spinner/src/BeatLoader.vue'

// Small spinner in the centre of the screen while a table reloads in the
// background (new page, page size, filter). The first load uses LoaderContainer.
interface Props {
    isFetching: boolean
}

defineProps<Props>()
</script>

<template>
    <Teleport to="body">
        <div
            v-if="isFetching"
            :class="cls.FetchingOverlay"
            role="status"
            aria-label="Ładowanie"
        >
            <Loader
                color="var(--primary-variant-color)"
                size="10px"
            />
        </div>
    </Teleport>
</template>
