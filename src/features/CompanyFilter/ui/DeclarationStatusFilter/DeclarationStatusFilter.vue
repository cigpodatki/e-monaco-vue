<script setup lang="ts">
import FilterHeader from '@/shared/ui/FilterHeader/FilterHeader.vue'
import { useCompanyFilterStore } from '../../model/store/companyFilterStore'
import { storeToRefs } from 'pinia'
import {
    DeclarationStatusSelect,
    type DeclarationStatus,
} from '@/entities/DeclarationStatus'

const filterStore = useCompanyFilterStore()

const { getDeclarationStatuses } = storeToRefs(filterStore)

function onChangeFn(value: DeclarationStatus[]) {
    filterStore.setDeclarationStatuses(value)
}
</script>

<template>
    <FilterHeader :selected-count="getDeclarationStatuses.length">
        <DeclarationStatusSelect
            as-input
            name="declaration-status-select"
            multiple
            :default-value="filterStore.getDeclarationStatuses"
            @update="onChangeFn"
        />
    </FilterHeader>
</template>
