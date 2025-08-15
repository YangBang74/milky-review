<script setup>
import { ref, computed } from 'vue'
import { useSubmitReview } from '@/components/useSubmitReview'
import { useRouter } from 'vue-router'
import Payment from '@/components/Payment.vue'
import ReviewHead from '@/components/ReviewHead.vue'
import Review from '@/components/Review.vue'

const visitId = 2

const { submitReview, getPayLink } = useSubmitReview()
const router = useRouter()

// Refs
const star = ref(0)
const reviewBlock = ref(false)
const comment = ref('')
const selectTags = ref([])
const photos = ref([])
const coffeeIsTrue = ref('')
const publishOnSite = ref(false)
const isRating = ref(false)

// Computed and methods that interact with the form
const starText = computed(() => {
  if (star.value <= 3)
    return 'Мы постараемся исправить любую проблему. Расскажите, что не понравилось?'
  if (star.value === 4) return 'Хорошо, но не идеально… На что нам обратить внимание?)'
  if (star.value === 5) return 'Круууть))) А что больше всего понравилось?'
  return ''
})

const handleSubmit = async ({ tipAmount, publishOnSite }) => {
  let reviewSuccess = true
  if (star.value > 0) {
    const payload = {
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
    isRating.value = true
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

const resetForm = () => {
  star.value = 0
  comment.value = ''
  selectTags.value = []
  photos.value = []
  coffeeIsTrue.value = ''
  publishOnSite.value = true
}
</script>

<template>
  <ReviewBlock v-if="isRating" :rating="rating" :comment="comment" />
  <div class="flex justify-center items-center h-screen">
    <button
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
              :visitId="visitId"
              @submit="handleSubmit"
            />
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
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Existing styles remain here */
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
