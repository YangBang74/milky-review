<script setup>
import { useSubmitReview } from '@/components/useSubmitReview'
import Payment from '@/components/Payment.vue'
import ReviewHead from '@/components/ReviewHead.vue'
import { ref } from 'vue'

const props = defineProps({
  masterId: Number,
})

console.log(props.masterId)

const paymentBlock = ref(false)

const { getPayLink } = useSubmitReview()

const handleSubmit = async ({ tipAmount }) => {
  if (tipAmount) {
    const payLinkData = await getPayLink({ summ: tipAmount, masterId: props.masterId })
    if (payLinkData && payLinkData.url) {
      window.location.href = payLinkData.url
    } else {
      alert('Ошибка при получении ссылки на оплату, попробуйте позже.')
    }
  }
}
</script>
<template>
  <div class="flex justify-center items-center h-screen">
    <button
      type="button"
      @click="paymentBlock = !paymentBlock"
      class="cursor-pointer bg-black text-white font-semibold px-6 py-2 flex justify-center items-center gap-[0.1875rem]"
    >
      <span class="text-sm font-light">Опубликовать отзыв на сайте</span>
    </button>
  </div>

  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="paymentBlock"
        class="bg-black/20 absolute inset-0 w-full z-0 flex-col justify-center items-center flex overflow-y-auto"
      >
        <div class="max-w-[23.4375rem] w-full z-50 bg-white">
          <ReviewHead />
          <Payment :on-submit="handleSubmit" :master-id="masterId" :is-payment="true" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<style scoped>
/* Transition styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
