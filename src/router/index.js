import { createRouter, createWebHistory } from 'vue-router'
import ReviewPay from '@/views/Review-pay.vue'
import PaymentPage from '@/views/PaymentPage.vue'
import ReviewPage from '@/views/ReviewPage.vue'
import SuccessReview from '@/views/SuccessReview.vue'

const routes = [
  { path: '/', name: 'ReviewPay', component: ReviewPay },
  { path: '/payment', name: 'Payment', component: PaymentPage },
  { path: '/review', name: 'Review', component: ReviewPage },
  {
    path: '/success',
    name: 'Success',
    component: SuccessReview,
    props: (route) => ({
      rating: Number(route.query.rating),
      comment: route.query.comment || '',
    }),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
