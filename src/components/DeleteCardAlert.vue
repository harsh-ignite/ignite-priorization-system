<script setup lang="ts">
import { ref } from 'vue'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface Props {
  title?: string
  description?: string
  triggerText?: string
  open?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Delete card?',
  description: 'This will permanently delete this card. This action cannot be undone.',
  triggerText: 'Delete',
  open: false
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const isOpen = ref(props.open)

const handleConfirm = () => {
  isOpen.value = false
  emit('confirm')
}

const handleCancel = () => {
  isOpen.value = false
  emit('cancel')
}
</script>

<template>
  <AlertDialog v-model:open="isOpen">
    <AlertDialogTrigger asChild>
      <slot name="trigger">
        <Button variant="destructive">{{ triggerText }}</Button>
      </slot>
    </AlertDialogTrigger>
    <AlertDialogContent size="sm">
      <AlertDialogHeader>        
        <AlertDialogTitle>{{ title }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ description }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel variant="outline" @click="handleCancel">Cancel</AlertDialogCancel>
        <AlertDialogAction variant="destructive" @click="handleConfirm">Delete</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
