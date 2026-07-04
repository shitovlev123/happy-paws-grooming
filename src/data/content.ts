import type { Groomer, Review, Service } from '../types/booking'

export const services: Service[] = [
  {
    id: 'full-grooming',
    title: 'Полный груминг',
    description: 'Купание, стрижка, когти и ушки за один визит.',
    price: 'от 3 900 ₽',
    duration: '2-3 часа',
    accent: '#b9e6dd',
  },
  {
    id: 'haircut',
    title: 'Стрижка',
    description: 'Аккуратная форма с учетом породы и шерсти.',
    price: 'от 2 400 ₽',
    duration: '90 минут',
    accent: '#ffd8bd',
  },
  {
    id: 'bath',
    title: 'Ванна и сушка',
    description: 'Мягкое очищение и спокойная сушка.',
    price: 'от 1 600 ₽',
    duration: '60 минут',
    accent: '#c9e2ff',
  },
  {
    id: 'deshedding',
    title: 'Вычёсывание',
    description: 'Меньше линьки, больше легкости и блеска.',
    price: 'от 1 900 ₽',
    duration: '75 минут',
    accent: '#d8edc0',
  },
  {
    id: 'nails',
    title: 'Уход за когтями',
    description: 'Стрижка и шлифовка для комфортных прогулок.',
    price: 'от 700 ₽',
    duration: '20 минут',
    accent: '#ffe3ea',
  },
  {
    id: 'express-care',
    title: 'Экспресс-уход',
    description: 'Быстро освежим питомца перед важным днем.',
    price: 'от 1 200 ₽',
    duration: '40 минут',
    accent: '#eee2c9',
  },
]

export const groomers: Groomer[] = [
  {
    name: 'Анна',
    role: 'Специалист по собакам',
    experience: '5 лет опыта',
    description: 'Профессиональный уход и мягкий подход к тревожным питомцам.',
    initials: 'А',
    tone: 'linear-gradient(135deg, #eadbc9, #fff6ec)',
  },
  {
    name: 'Миа',
    role: 'Эксперт по кошкам',
    experience: '7 лет опыта',
    description: 'Создает спокойную атмосферу для чувствительных кошек.',
    initials: 'М',
    tone: 'linear-gradient(135deg, #d9e6ef, #f8fbff)',
  },
  {
    name: 'Софи',
    role: 'Эксперт по щенкам',
    experience: '3 года опыта',
    description: 'Помогает первым визитам проходить легко и дружелюбно.',
    initials: 'С',
    tone: 'linear-gradient(135deg, #eeded6, #fff4ee)',
  },
]

export const reviews: Review[] = [
  {
    author: 'Юлия',
    pet: 'Макс',
    text: 'Мой пес обычно нервничает, но здесь он был спокоен и счастлив. Запись была очень легкой.',
  },
  {
    author: 'Ольга',
    pet: 'Марс',
    text: 'Чистый салон, мягкий подход и красивая стрижка. Марс вышел довольным.',
  },
  {
    author: 'Ника',
    pet: 'Луна',
    text: 'Все быстро подтвердили, учли пожелания и сделали шерсть невероятно мягкой.',
  },
  {
    author: 'Даша',
    pet: 'Тедди',
    text: 'Понравилось, что питомцу было спокойно, а мне не пришлось долго ждать ответа.',
  },
]

export const petTypeLabels = {
  dog: 'Собака',
  cat: 'Кот',
  other: 'Другое',
} as const
