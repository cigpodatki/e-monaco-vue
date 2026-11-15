<script setup lang="ts">
import cls from './CampaignManagementPage.module.scss'
import Breadcrumbs from '@/shared/ui/Breadcrumbs/Breadcrumbs.vue'
import Flex from '@/shared/ui/Flex/Flex.vue'
import CampaignManagementTable from '@/features/Campaign/ui/CampaignManagementTable/CampaignManagementTable.vue'
import { breadcrumbs } from '../model/consts/breadcrumbs'
</script>

<template>
    <div :class="cls.CampaignManagementPage">
        <Flex
            gap="32"
            direction="column"
            align="start"
        >
            <Breadcrumbs :items="breadcrumbs" />
            <h1>Zarządzanie kampaniami</h1>
            <CampaignManagementTable />
        </Flex>
    </div>
</template>
