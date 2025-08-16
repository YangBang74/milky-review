<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useSubmitReview } from '@/components/useSubmitReview'
import ReviewHead from '@/components/ReviewHead.vue'
import Review from '@/components/Review.vue'
import ReviewBlock from '@/components/ReviewBlock.vue'

const props = defineProps({
  visitId: Number,
})

const { submitReview } = useSubmitReview()

// Refs
const captchaKey = import.meta.env.VITE_CAPTCHA_KEY

const star = ref(0)
const comment = ref('')
const selectTags = ref([])
const textareaRef = ref(null)
const showPhotoTooltip = ref(false)
const photos = ref([])
const inputFileRef = ref(null)
const coffeeIsTrue = ref('')
const publishOnSite = ref(true)
const isRating = ref(false)
const showCaptcha = ref(false)
const captchaToken = ref(null)
const reviewBlock = ref(false)

const starText = computed(() => {
  if (star.value <= 3)
    return 'Мы постараемся исправить любую проблему. Расскажите, что не понравилось?'
  if (star.value === 4) return 'Хорошо, но не идеально… На что нам обратить внимание?)'
  if (star.value === 5) return 'Круууть))) А что больше всего понравилось?'
  return ''
})

const resetForm = () => {
  selectTags.value = []
  photos.value = []
  coffeeIsTrue.value = ''
  publishOnSite.value = true
  captchaToken.value = null
}

const handleCaptchaSuccess = (token) => {
  captchaToken.value = token
  showCaptcha.value = false
  handleSubmitWithToken()
}

const renderCaptcha = () => {
  nextTick(() => {
    const container = document.querySelector('.smart-captcha')
    if (container) {
      container.innerHTML = ''
      if (window.smartCaptcha) {
        window.smartCaptcha.render(container, {
          sitekey: captchaKey,
          callback: handleCaptchaSuccess,
        })
      }
    }
  })
}

const handleSubmit = async () => {
  if (!star.value) return

  if (!props.visitId) {
    showCaptcha.value = true
    renderCaptcha()
    return
  }

  await handleSubmitWithToken()
}
const handleSubmitWithToken = async () => {
  const payload = {
    star: star.value,
    comment: comment.value,
    photos: photos.value,
    selectTags: selectTags.value,
    coffeeIsTrue: coffeeIsTrue.value,
    publishOnSite: publishOnSite.value,
  }
  const success = await submitReview(payload)
  if (success) {
    reviewBlock.value = false
    isRating.value = true
    resetForm()
  } else {
    alert('Ошибка при отправке отзыва, попробуйте позже.')
  }
}

onMounted(() => {
  if (!document.querySelector('script[src*="captcha-api.yandex.ru"]')) {
    const script = document.createElement('script')
    script.src = 'https://captcha-api.yandex.ru/captcha.js'
    script.async = true
    script.onload = () => {
      window.handleCaptchaSuccess = handleCaptchaSuccess
    }
    document.head.appendChild(script)
  } else {
    window.handleCaptchaSuccess = handleCaptchaSuccess
  }
})
</script>

<template>
  <div class="flex justify-center flex-col gap-10 items-center h-screen">
    <ReviewBlock v-if="isRating" :rating="star" :comment="comment" />
    <button
      v-if="!isRating"
      type="button"
      @click="reviewBlock = !reviewBlock"
      class="cursor-pointer bg-black text-white font-semibold px-6 py-2 flex justify-center items-center gap-[0.1875rem]"
    >
      <span class="text-sm font-light">Оставить отзыв и чаевые</span>
    </button>
  </div>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="reviewBlock"
        class="bg-black/20 absolute inset-0 w-full flex-col justify-center items-center flex h-full overflow-y-auto"
      >
        <div
          :class="[
            'max-w-[23.4375rem]',
            'w-full',
            'z-50',
            'bg-white',
            star > 0 ? 'h-full' : 'h-auto',
          ]"
        >
          <div>
            <ReviewHead />
            <!-- Use the new ReviewForm component here -->
            <Review
              v-model:star="star"
              v-model:comment="comment"
              v-model:selectTags="selectTags"
              v-model:photos="photos"
              v-model:coffeeIsTrue="coffeeIsTrue"
              :starText="starText"
              studio-name="Студия на Арбате"
              visit-date="21.05.2025"
              :showCaptcha="true"
              :visitId="props.visitId"
              @submit="handleSubmit"
            />
            <div class="bg-white">
              <Transition name="fade">
                <div v-if="showCaptcha" class="p-5 text-center bg-white">
                  <div
                    class="smart-captcha"
                    :data-sitekey="captchaKey"
                    data-callback="handleCaptchaSuccess"
                  ></div>
                </div>
              </Transition>
              <div class="px-5 pt-5 pb-[1.0625rem]">
                <button
                  :disabled="!star"
                  type="button"
                  @click="handleSubmit"
                  class="py-[0.9375rem] bg-[#274138] text-white w-full rounded-sm cursor-pointer transition disabled:bg-[#8C9497]"
                >
                  {{
                    selectTip || price || props.isPayment ? 'Оставить чаевые' : 'Отправить отзыв'
                  }}
                </button>
              </div>
              <div class="pb-[1.0625rem] flex justify-center">
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
                      class="mb-px"
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
                      class="mb-px"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="8.5" cy="8.5" r="7.5" stroke="#375B4F" stroke-width="2" />
                    </svg>
                  </span>
                  <span class="text-sm font-light">Опубликовать отзыв на сайте</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
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

/* ToolTip style */
.tooltip::before {
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  border: solid transparent;
  border-bottom-color: #ffffff;
  border-width: 0 5px 5px 5px;
}
</style>
