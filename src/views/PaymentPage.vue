<script setup>
import { useSubmitReview } from '@/components/useSubmitReview'
import Payment from '@/components/Payment.vue'

const props = defineProps({
  masterId: Number,
})

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
  <div
    class="bg-black/20 absolute inset-0 w-full flex-col items-center flex overflow-y-auto"
  >
    <div class="max-w-[23.4375rem] w-full z-50 bg-white">
      <a href="#" class="bg-[#274138] py-5 flex justify-center">
        <svg
          width="110"
          height="23"
          viewBox="0 0 110 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_11901_8545)">
            <path
              d="M0 11.4626C0 16.6336 1.95075 20.6838 3.49615 22.9254H5.39623C3.69882 20.1742 2.38143 16.277 2.38143 11.4626C2.38143 6.64834 3.69882 2.72556 5.39623 0H3.49615C1.95075 2.21612 0 6.29172 0 11.4626Z"
              fill="white"
            />
            <path
              d="M29.9887 20.4735L35.0555 4.3748V20.4735H37.6396V2.00586H33.3074L28.6206 17.3913L23.9337 2.00586H19.6016V20.4735H22.1857V4.3748L27.2526 20.4735H29.9887Z"
              fill="white"
            />
            <path d="M44.5763 2.00586H41.9922V20.4735H44.5763V2.00586Z" fill="white" />
            <path
              d="M51.5284 2.00586H48.9443V20.4735H61.2315V18.2319H51.5284V2.00586Z"
              fill="white"
            />
            <path
              d="M66.0021 2.00586H63.418V20.4735H66.0021V14.6657L68.8901 11.4562L75.1985 20.4735H78.2893L70.6382 9.54574L77.5039 2.00586H74.2865L66.0021 11.3033V2.00586Z"
              fill="white"
            />
            <path
              d="M77.8643 2.00586L84.3497 13.2647V20.4735H86.9338V13.3157L93.6728 2.00586H90.8353L85.7178 11.0231L80.7016 2.00586H77.8643Z"
              fill="white"
            />
            <path
              d="M109.979 11.4626C109.979 6.29172 108.029 2.21612 106.483 0H104.583C106.255 2.7001 107.598 6.6738 107.598 11.4626C107.598 16.277 106.281 20.1742 104.583 22.9254H106.483C108.029 20.6838 109.979 16.6336 109.979 11.4626Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0_11901_8545">
              <rect width="110" height="23" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </a>
      <Payment :on-submit="handleSubmit" :master-id="masterId" :is-payment="true" />
    </div>
  </div>
</template>
<style scoped>
/* Transition styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
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
