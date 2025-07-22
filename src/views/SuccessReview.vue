<script setup>
import ReviewBlock from '@/components/ReviewBlock.vue'

defineProps({
  rating: Number,
  comment: String,
})
</script>
<template>
  <div
    class="bg-black/20 absolute inset-0 w-full h-full flex-col items-center flex overflow-y-auto"
  >
    <ReviewBlock :rating="rating" :comment="comment" />
  </div>
</template>
