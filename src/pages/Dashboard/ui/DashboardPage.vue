<script setup lang="ts">
import { ref, computed } from 'vue'
import cls from './DashboardPage.module.scss'
import Flex from '@/shared/ui/Flex/Flex.vue'
import Breadcrumbs from '@/shared/ui/Breadcrumbs/Breadcrumbs.vue'
import { breadcrumbs } from '../model/consts/breadcrumbs'
import { CompaniesFilter, CompaniesTable } from '@/features/Company/index'

const selectionCount = ref<number>(0)
const selectedCompanies = ref<string[]>([])

const selectionCountValue = computed(() => selectionCount.value)

const companiesTable = ref<InstanceType<typeof CompaniesTable> | null>(null)

// After a multi-edit. The checkboxes are driven by the table's own Set, so it
// must be cleared there; the table then emits the empty selection back here.
const handleClearSelection = () => {
    selectedCompanies.value = []
    selectionCount.value = 0
    companiesTable.value?.clearSelectedCompanies()
}
</script>

<template>
    <div :class="cls.DashboardPage">
        <Flex
            gap="32"
            direction="column"
            align="start"
        >
            <Breadcrumbs :items="breadcrumbs" />
            <Flex
                gap="16"
                direction="column"
                align="start"
            >
                <CompaniesFilter
                    :selection-count="selectionCountValue"
                    :selected-companies="selectedCompanies"
                    @update-selected-companies="handleClearSelection"
                />

                <CompaniesTable
                    ref="companiesTable"
                    @update-selection-count="
                        (count) => {
                            selectionCount = count
                        }
                    "
                    @update-selected-companies="
                        (companies) => {
                            selectedCompanies = companies
                        }
                    "
                />
            </Flex>
        </Flex>
    </div>
</template>
