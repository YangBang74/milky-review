import { createRouter, createWebHistory } from 'vue-router'
import ReviewPay from '@/views/Review-pay.vue'
import PaymentPage from '@/views/PaymentPage.vue'
import ReviewPage from '@/views/ReviewPage.vue'

const routes = [
  { path: '/', name: 'ReviewPay', component: ReviewPay },
  { path: '/payment', name: 'Payment', component: PaymentPage, props: { masterId: 4 } },
  { path: '/review', name: 'Review', component: ReviewPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
