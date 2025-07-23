<script setup>
import { ref, computed } from 'vue'
import { useSubmitReview } from '@/components/useSubmitReview'
import { useRouter } from 'vue-router'
import Payment from '@/components/Payment.vue'
import tags from '@/components/tags.json'

const props = defineProps({
  visitId: Number,
})

const coffeeOptions = ['Да', 'Нет']
const MAX_PHOTOS = 5
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const TOOLTIP_TIMEOUT = 4000

const star = ref(0)
const comment = ref('')
const selectTags = ref([])
const textareaRef = ref(null)
const showPhotoTooltip = ref(false)
const photos = ref([])
const inputFileRef = ref(null)
const coffeeIsTrue = ref('Да')
const publishOnSite = ref(false)
let tooltipTimeout = null

const { submitReview, getPayLink } = useSubmitReview()
const router = useRouter()

const starText = computed(() => {
  if (star.value <= 3)
    return 'Мы постараемся исправить любую проблему. Расскажите, что не понравилось?'
  if (star.value === 4) return 'Хорошо, но не идеально… На что нам обратить внимание?)'
  if (star.value === 5) return 'Круууть))) А что больше всего понравилось?'
  return ''
})

const currentTags = computed(() => {
  if (star.value <= 3) return tags.bad
  if (star.value === 4) return tags.normal
  if (star.value === 5) return tags.good
  return []
})

const setRating = (value) => {
  star.value = value
}

const toggleTag = (id) => {
  selectTags.value = selectTags.value.includes(id)
    ? selectTags.value.filter((tagId) => tagId !== id)
    : [...selectTags.value, id]
}

const toggleTooltip = () => {
  showPhotoTooltip.value = true
  if (tooltipTimeout) clearTimeout(tooltipTimeout)
  tooltipTimeout = setTimeout(() => {
    showPhotoTooltip.value = false
  }, TOOLTIP_TIMEOUT)
}

const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
  })
}

const onFileChange = async (event) => {
  const files = event.target.files
  if (!files?.length) return

  for (const file of Array.from(files)) {
    if (photos.value.length >= MAX_PHOTOS) break
    if (file.size > MAX_FILE_SIZE) {
      toggleTooltip()
      continue
    }
    try {
      const base64 = await toBase64(file)
      photos.value = [...photos.value, base64]
    } catch (error) {
      console.error('Ошибка при конвертации файла в base64:', error)
    }
  }
  event.target.value = ''
}

const openFileDialog = () => {
  if (photos.value.length >= MAX_PHOTOS) return
  inputFileRef.value?.click()
}

const removePhoto = (index) => {
  photos.value = photos.value.filter((_, i) => i !== index)
}

const resetForm = () => {
  star.value = 0
  comment.value = ''
  selectTags.value = []
  photos.value = []
  coffeeIsTrue.value = ''
  publishOnSite.value = true
}

const handleSubmit = async ({ tipAmount, publishOnSite }) => {
  let reviewSuccess = true
  if (star.value > 0) {
    const payload = {
      visitId: props.visitId,
      star: star.value,
      comment: comment.value,
      photos: photos.value,
      selectTags: selectTags.value,
      coffeeIsTrue: coffeeIsTrue.value,
      publishOnSite,
    }
    reviewSuccess = await submitReview(payload, { withCredentials: true })
    if (!reviewSuccess) {
      alert('Ошибка при отправке отзыва, попробуйте позже.')
      return
    }
  }

  if (tipAmount) {
    const payLinkData = await getPayLink({ summ: tipAmount, visitId: props.visitId })
    if (payLinkData && payLinkData.url) {
      window.location.href = payLinkData.url
    } else {
      alert('Ошибка при получении ссылки на оплату, попробуйте позже.')
      return
    }
  }

  if (reviewSuccess && star.value > 0 && !tipAmount) {
    router.push({
      path: '/success',
      query: { rating: star.value, comment: comment.value },
    })
    resetForm()
  }
}
</script>
<template>
  <div
    class="bg-black/20 absolute inset-0 w-full h-full flex-col items-center flex overflow-y-auto"
  >
    <div
      :class="[
        'max-w-[23.4375rem]',
        'w-full',
        'z-50',
        'bg-white h-full',
        star > 0 ? 'h-full' : 'h-auto',
      ]"
    >
      <div>
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
        <div class="px-[3.875rem] py-[1.875rem] flex flex-col justify-center">
          <p class="text-xl text-center">Как вам визит?</p>
          <div
            class="flex items-center justify-center text-[#8C9497] font-light text-sm pt-[0.3125rem]"
          >
            21.05.2022 | Студия на Арбате
          </div>
          <div class="flex items-center justify-center pt-[1.1044rem]">
            <div class="flex justify-center gap-2">
              <template v-for="i in 5" :key="i">
                <svg
                  @click="setRating(i)"
                  width="35"
                  height="33"
                  viewBox="0 0 35 33"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="cursor-pointer transition-colors duration-200"
                >
                  <path
                    d="M32.9728 11.793L23.0548 10.3516L18.6212 1.3633C18.5001 1.1172 18.3009 0.917983 18.0548 0.796889C17.4376 0.492202 16.6876 0.746108 16.379 1.3633L11.9454 10.3516L2.02748 11.793C1.75404 11.832 1.50404 11.961 1.31263 12.1563C1.08123 12.3941 0.953723 12.7141 0.958118 13.0459C0.962513 13.3777 1.09845 13.6942 1.33607 13.9258L8.51185 20.9219L6.81654 30.8008C6.77678 31.0306 6.80221 31.2669 6.88995 31.483C6.97768 31.6991 7.1242 31.8863 7.3129 32.0234C7.5016 32.1604 7.72493 32.2418 7.95755 32.2584C8.19018 32.275 8.4228 32.2261 8.62904 32.1172L17.5001 27.4531L26.3712 32.1172C26.6134 32.2461 26.8947 32.2891 27.1642 32.2422C27.8439 32.125 28.3009 31.4805 28.1837 30.8008L26.4884 20.9219L33.6642 13.9258C33.8595 13.7344 33.9884 13.4844 34.0275 13.211C34.1329 12.5274 33.6564 11.8945 32.9728 11.793Z"
                    :fill="i <= star ? '#FBBF24' : '#E5E7EB'"
                  />
                </svg>
              </template>
            </div>
          </div>
        </div>

        <Transition name="fade">
          <div v-if="star > 0" class="bg-[#F6F5F2] pt-5">
            <Transition name="fade">
              <div v-if="star" class="px-4">
                <p class="text-lg leading-6 text-center text-[#222222] px-1">{{ starText }}</p>
                <div class="flex flex-wrap justify-between align-start pt-6 gap-y-[0.9375rem]">
                  <button
                    v-for="tag in currentTags"
                    :key="tag.tagId"
                    type="button"
                    @click="toggleTag(tag.tagId)"
                    :class="[
                      'py-[0.3125rem] border cursor-pointer rounded-4xl px-3 text-sm leading-[1.5625rem] transition-colors duration-150',
                      selectTags.includes(tag.tagId)
                        ? 'bg-[#274138] text-[#F6F5F2] border-[#274138]'
                        : 'text-[#222]',
                    ]"
                  >
                    {{ tag.title }}
                  </button>
                </div>
              </div>
            </Transition>

            <div class="my-5 px-3">
              <textarea
                v-model="comment"
                ref="textareaRef"
                placeholder="Ваш комментарий"
                class="bg-white w-full p-[0.9375rem] focus:outline-0 resize-none rounded-md overflow-hidden"
              />
            </div>
            <div class="mt-5 mb-6 px-3">
              <div class="flex justify-start items-center gap-[0.3125rem] px-2">
                <p>Добавьте фото с вашего визита</p>
                <div class="relative w-fit flex items-center">
                  <button @click="toggleTooltip" class="focus:outline-none cursor-pointer">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7.5" stroke="#8C9497" />
                      <rect
                        x="7.5"
                        y="6.22266"
                        width="1"
                        height="6.22222"
                        rx="0.5"
                        fill="#8C9497"
                      />
                      <circle cx="8" cy="4.75" r="0.75" fill="#8C9497" />
                    </svg>
                  </button>
                  <Transition name="fade">
                    <div
                      v-show="showPhotoTooltip"
                      class="tooltip absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs rounded px-2 py-1 whitespace-nowrap z-10 bg-white text-[#8C9497]"
                    >
                      не более 5Мб
                    </div>
                  </Transition>
                </div>
              </div>
              <div class="flex items-center justify-start gap-2.5 flex-row flex-nowrap">
                <TransitionGroup
                  name="fade"
                  tag="div"
                  v-if="photos.length > 0"
                  class="flex flex-wrap gap-2 mt-3 px-2"
                >
                  <div v-for="(photo, index) in photos" :key="photo" class="relative w-12.5 h-12.5">
                    <img :src="photo" alt="photo" class="object-cover w-full h-full rounded" />
                    <button
                      @click="removePhoto(index)"
                      type="button"
                      class="absolute -top-2 -right-2 bg-white bg-opacity-50 text-white w-5 h-5 flex items-center justify-center rounded-full cursor-pointer"
                      aria-label="Удалить фото"
                    >
                      <svg
                        width="8"
                        height="8"
                        viewBox="0 0 8 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M0.146444 7.14584C-0.0488147 7.3411 -0.0488147 7.65769 0.146444 7.85296C0.341703 8.04822 0.65828 8.04822 0.853539 7.85296L3.99953 4.70686L7.14559 7.85302C7.34085 8.04829 7.65743 8.04829 7.85269 7.85302C8.04795 7.65776 8.04795 7.34117 7.85269 7.14591L4.70663 3.99974L7.85269 0.853568C8.04795 0.658302 8.04795 0.341715 7.85269 0.146449C7.65743 -0.0488162 7.34085 -0.0488167 7.14559 0.146449L3.99953 3.29262L0.853539 0.146515C0.65828 -0.0487502 0.341703 -0.0487502 0.146444 0.146515C-0.0488147 0.341781 -0.0488147 0.658369 0.146444 0.853634L3.29244 3.99974L0.146444 7.14584Z"
                          fill="#274138"
                        />
                      </svg>
                    </button>
                  </div>
                </TransitionGroup>

                <Transition name="fade">
                  <div v-if="photos.length < 5" class="mt-2.5 flex items-center justify-start px-2">
                    <button
                      type="button"
                      @click="openFileDialog"
                      class="bg-white p-[0.8125rem] w-12.5 h-12.5 cursor-pointer rounded"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <mask
                          id="mask0_13922_8210"
                          style="mask-type: alpha"
                          maskUnits="userSpaceOnUse"
                          x="1"
                          y="0"
                          width="23"
                          height="23"
                        >
                          <rect x="1.5" width="22.5" height="22.5" fill="#D9D9D9" />
                        </mask>
                        <g mask="url(#mask0_13922_8210)">
                          <path
                            d="M20.0305 8.90634V18.9696C20.0305 19.4878 19.6104 19.9079 19.0922 19.9079H3.37579C2.85759 19.9079 2.4375 19.4878 2.4375 18.9696V7.58549C2.4375 7.06728 2.85759 6.6472 3.37579 6.6472H5.90083C6.21065 6.6472 6.5005 6.49425 6.67537 6.2385L7.87578 4.48291C8.05065 4.22716 8.3405 4.07422 8.65032 4.07422H11.234H15.1924"
                            stroke="#274138"
                            stroke-width="1.5"
                            stroke-linecap="round"
                          />
                          <circle
                            cx="11.4543"
                            cy="12.2112"
                            r="3.13851"
                            stroke="#274138"
                            stroke-width="1.2"
                            stroke-linecap="round"
                          />
                          <rect x="19.5" y="1" width="1" height="6" rx="0.5" fill="#274138" />
                          <rect
                            x="17"
                            y="4.5"
                            width="1"
                            height="6"
                            rx="0.5"
                            transform="rotate(-90 17 4.5)"
                            fill="#274138"
                          />
                        </g>
                      </svg>
                    </button>
                    <input
                      type="file"
                      ref="inputFileRef"
                      accept="image/*"
                      multiple
                      class="hidden"
                      @change="onFileChange"
                    />
                  </div>
                </Transition>
              </div>
            </div>
            <div class="p-5 border-y border-[#ACB5B8]">
              <p class="text-[#222222] text-center">Предложили ли вам чай или кофе?</p>
              <div class="flex items-center justify-center gap-2.5 mt-2.5">
                <button
                  v-for="coffee in coffeeOptions"
                  :key="coffee"
                  type="button"
                  @click="coffeeIsTrue = coffee"
                  :class="[
                    'border cursor-pointer rounded-sm transition-colors text-sm duration-150 w-12.5 h-10',
                    coffeeIsTrue === coffee
                      ? 'bg-[#274138] text-[#F6F5F2] border-[#274138]'
                      : 'text-[#222] border-[#8C9497] bg-white',
                  ]"
                >
                  {{ coffee }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
      <Payment
        :is-comment="comment"
        :on-submit="handleSubmit"
        :select-star="star"
        :visit-id="visitId"
        @update:publishOnSite="publishOnSite = $event"
      />
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