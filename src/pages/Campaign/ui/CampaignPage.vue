<script setup lang="ts">
import Flex from '@/shared/ui/Flex/Flex.vue'
import Breadcrumbs from '@/shared/ui/Breadcrumbs/Breadcrumbs.vue'
import CampaignTable from '@/features/Campaign/ui/CampaignTable/CampaignTable.vue'
import { useCampaigns } from '@/features/Campaign/model/services/useCampaign'
import { breadcrumbs } from '../model/const/breadcrumbs'
import cls from './CampaignPage.module.scss'

const { data } = useCampaigns()
</script>

<template>
    <div :class="cls.CampaignPage">
        <Flex
            gap="32"
            direction="column"
            align="start"
        >
            <Breadcrumbs :items="breadcrumbs" />
            <h1 :class="cls.title">Kampanie</h1>

            <Flex
                direction="column"
                align="start"
                gap="8"
                v-if="data?.length"
                :class="cls.scollable"
            >
                <div class="scrollable-wrapper">
                    <CampaignTable
                        v-for="campaign in data"
                        :key="campaign.id"
                        :campaign="campaign"
                    />
                </div>
            </Flex>
        </Flex>
    </div>
</template>
