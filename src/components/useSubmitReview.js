export const useSubmitReview = () => {
  const API_URL = 'https://testapi.vys.su'
  const API_TOKEN = 'Bearer f270cffe34b29e1ac358be26a4490d0fe45835d2'

  const submitReview = async ({ visitId, star, comment, photos, selectTags, coffeeIsTrue, publishOnSite }) => {
    if (!star) {
      console.log('Отсутствует ID визита или оценка')
      return false
    }

    const payload = {
      visitId,
      evaluation: star,
      text: comment,
      photos,
      tags: selectTags,
      answers: coffeeIsTrue
        ? [{ question: 'Предложили ли вам чай или кофе?', answer: coffeeIsTrue }]
        : [],
      publishOnSite,
    }

    try {
      const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: API_TOKEN,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`)
      }

      const data = await response.json()
      console.log('Отзыв успешно отправлен:', data)
      return true
    } catch (error) {
      console.error('Ошибка при отправке отзыва:', error)
      return false
    }
  }

  const getPayLink = async ({ summ, visitId }) => {
    if (!summ) {
      console.log('Отсутствует сумма чаевых')
      return null
    }

    const queryParams = visitId ? `summ=${summ}&visitId=${visitId}` : `summ=${summ}&workerId=1`
    const url = `${API_URL}/tips/getPayLink?${queryParams}`
    try {
      const response = await fetch(url, {
        method: 'POST',
        redirect: 'follow',
      })

      const text = await response.text()
      if (!text) {
        throw new Error('Пустой ответ от сервера')
      }

      let data
      try {
        data = JSON.parse(text)
      } catch (error) {
        console.error('Ошибка парсинга JSON:', error, 'Ответ сервера:', text)
        throw new Error('Некорректный формат ответа сервера')
      }

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`)
      }

      if (data.status !== 'ok' || !data.data || !data.data.payURL) {
        throw new Error('Некорректный формат ответа: отсутствует payURL или status не ok')
      }

      return { url: data.data.payURL }
    } catch (error) {
      console.error('Ошибка при получении ссылки на оплату:', error)
      return null
    }
  }

  return {
    submitReview,
    getPayLink,
  }
}