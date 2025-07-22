<script setup>
import { ref, watch, onMounted } from 'vue'
import { useSubmitReview } from './useSubmitReview'

// props
const props = defineProps({
  isComment: String,
  onSubmit: Function,
  selectStar: Number,
  visitId: Number,
})

// emit
const emit = defineEmits(['update:publishOnSite'])

// states
const selectTip = ref(null)
const otherTip = ref(false)
const publishOnSite = ref(false)
const price = ref('')
const showCaptcha = ref(false)
const captchaToken = ref(null)

// dates
const tipsOptions = [
  { title: 'Без чаевых', value: null },
  { title: '99 ₽', value: 99 },
  { title: '199 ₽', value: 199 },
  { title: '299 ₽', value: 299 },
]
const capthaKey = import.meta.env.VITE_CAPTCHA_KEY
console.log(capthaKey);


// Math function
const isSubmitDisabled = () => {
  return !props.selectStar && !selectTip.value && !price.value
}

// functions
const setTip = (value) => {
  selectTip.value = value
  if (value !== null) {
    otherTip.value = false
    price.value = ''
  }
}

const toggleOtherTip = () => {
  otherTip.value = !otherTip.value
  if (otherTip.value) {
    selectTip.value = null
  }
}

const handleCaptchaSuccess = (token) => {
  captchaToken.value = token
  showCaptcha.value = false
  handleSubmitWithToken()
}

const handleSubmit = async () => {
  if (props.visitId) {
    await handleSubmitWithToken()
  } else {
    showCaptcha.value = true
  }
}

const handleSubmitWithToken = async () => {
  const tipAmount = selectTip.value || (price.value ? parseInt(price.value) : null)
  await props.onSubmit({
    tipAmount,
    publishOnSite: publishOnSite.value,
    captchaToken: captchaToken.value,
  })
  captchaToken.value = null
}

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://captcha-api.yandex.ru/captcha.js'
  script.async = true
  document.head.appendChild(script)

  window.handleCaptchaSuccess = handleCaptchaSuccess
})

watch(price, (newVal) => {
  if (!newVal) {
    price.value = ''
    return
  }
  const numeric = newVal.toString().replace(/\D/g, '')
  price.value = numeric
})

watch(publishOnSite, (newVal) => {
  emit('update:publishOnSite', newVal)
})
</script>

<template>
  <div class="max-w-[23.4375rem] w-full z-50 bg-white">
    <div class="p-5 text-center">
      <p class="font-medium">Чаевые мастеру</p>
      <span class="text-sm text-[#8C9497] font-light block mt-1">
        Мастер получит всю сумму ваших чаевых
      </span>

      <div class="my-5 px-10 flex justify-center flex-row gap-[0.3125rem] flex-nowrap">
        <button
          v-for="tip in tipsOptions"
          :key="tip.value"
          type="button"
          @click="setTip(tip.value)"
          :class="[
            'h-[3.4375rem] w-15 rounded-[0.3125rem] cursor-pointer border transition',
            selectTip === tip.value
              ? 'bg-[#274138] text-white border-[#274138]'
              : 'bg-white border-[#8C9497]',
            tip.title === 'Без чаевых' ? 'text-[0.75rem]' : 'text-sm',
          ]"
        >
          {{ tip.title }}
        </button>
      </div>

      <div class="text-center">
        <button
          type="button"
          @click="toggleOtherTip"
          class="text-[#222] text-sm border-b leading-[0.9375rem] cursor-pointer"
        >
          Другая сумма
        </button>
      </div>
      <Transition name="fade">
        <div
          v-if="otherTip"
          class="mx-10 my-5 border border-[#8C9497] rounded-sm pt-[0.3125rem] text-left px-[0.9375rem] pb-2.5"
        >
          <label for="price" class="text-[#8C9497] text-sm font-light">Введите сумму</label>
          <input
            type="number"
            v-model="price"
            name="price"
            class="m-0 p-0 focus:outline-0 w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </Transition>

      <div class="px-5 pt-5">
        <button
          :disabled="isSubmitDisabled()"
          type="button"
          @click="handleSubmit"
          class="py-[0.9375rem] bg-[#274138] text-white w-full rounded-sm cursor-pointer transition disabled:bg-[#8C9497]"
        >
          {{ selectTip || price ? 'Оставить чаевые' : 'Отправить отзыв' }}
        </button>
      </div>
    </div>
    <div v-if="props.isComment" class="pb-[1.0625rem] flex justify-center">
      <button
        type="button"
        @click="publishOnSite = !publishOnSite"
        class="cursor-pointer flex justify-center items-center gap-[0.1875rem]"
      >
        <span v-if="publishOnSite">
          <svg
            width="17"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="8.5" cy="8.5" r="8.5" fill="#274138" />
            <path
              d="M4.85742 8.50033L7.45946 11.3337L12.1431 5.66699"
              stroke="white"
              stroke-width="2"
            />
          </svg>
        </span>
        <span v-else>
          <svg
            width="17"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="8.5" cy="8.5" r="7.5" stroke="#375B4F" stroke-width="2" />
          </svg>
        </span>
        <span class="text-sm font-light">Опубликовать отзыв на сайте</span>
      </button>
    </div>
    <Transition name="fade">
      <div v-if="showCaptcha" class="p-5 text-center">
        <div
          class="smart-captcha"
          data-sitekey="ysc1_CJbaciJkIcnCK6YkmJSDWUMQ6DvxXrDbcszGdvcV3914f354"
          data-callback="handleCaptchaSuccess"
        ></div>
      </div>
    </Transition>
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
