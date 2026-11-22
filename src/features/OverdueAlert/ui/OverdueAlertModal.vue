<script setup lang="ts">
import cls from './OverdueAlertModal.module.scss'
import Modal from '@/shared/ui/Modal/Modal.vue'
import Button from '@/shared/ui/Button/Button.vue'
import { useOverdueAlert } from '../model/useOverdueAlert'

const { isOpen } = useOverdueAlert()

function close() {
    isOpen.value = false
}
</script>

<template>
    <Modal
        :is-open="isOpen"
        title="Uwaga"
        @update:is-open="close"
    >
        <div :class="cls.wrapper">
            <p>
                Uwaga, na swojej liście masz leady z datą kontaktu z
                przeszłości!
            </p>
        </div>
        <div :class="cls.footer">
            <Button
                :class="cls.button"
                @click="close"
                >OK</Button
            >
        </div>
    </Modal>
</template>
