import type { Groomer, Review, Service } from '../types/booking'

export const services: Service[] = [
  {
    id: 'full-grooming',
    title: 'Комплексный уход',
    description: 'Купание, сушка, стрижка, вычесывание, ушки и когти в одном спокойном визите.',
    price: 'от 3 900 ₽',
    duration: '2-3 часа',
    accent: '#8da897',
  },
  {
    id: 'haircut',
    title: 'Стрижка',
    description: 'Аккуратная форма под породу, шерсть и привычный образ питомца.',
    price: 'от 2 400 ₽',
    duration: '90 минут',
    accent: '#8da897',
  },
  {
    id: 'bath',
    title: 'Купание и сушка',
    description: 'Деликатное очищение, мягкая косметика и сушка без лишнего стресса.',
    price: 'от 1 600 ₽',
    duration: '60 минут',
    accent: '#8da897',
  },
  {
    id: 'deshedding',
    title: 'Вычесывание',
    description: 'Убираем подшерсток, уменьшаем линьку и возвращаем шерсти легкость.',
    price: 'от 1 900 ₽',
    duration: '75 минут',
    accent: '#8da897',
  },
  {
    id: 'nails',
    title: 'Когти',
    description: 'Стрижка и шлифовка когтей для комфортных прогулок и игр дома.',
    price: 'от 700 ₽',
    duration: '20 минут',
    accent: '#8da897',
  },
  {
    id: 'express-care',
    title: 'Экспресс-уход',
    description: 'Быстро освежим питомца перед встречей, поездкой или фотосессией.',
    price: 'от 1 200 ₽',
    duration: '40 минут',
    accent: '#8da897',
  },
]

export const groomers: Groomer[] = [
  {
    name: 'Анна',
    role: 'Грумер собак малых пород',
    experience: '5 лет опыта',
    description: 'Работает мягко и терпеливо, особенно с тревожными питомцами.',
    initials: 'А',
    tone: 'linear-gradient(145deg, #dfe9e1, #f7f5ef)',
  },
  {
    name: 'Миа',
    role: 'Специалист по кошкам',
    experience: '7 лет опыта',
    description: 'Создает тихую атмосферу и дает кошкам время привыкнуть к процедуре.',
    initials: 'М',
    tone: 'linear-gradient(145deg, #e1e8eb, #f8f6ef)',
  },
  {
    name: 'Софи',
    role: 'Первый груминг щенков',
    experience: '3 года опыта',
    description: 'Помогает первым визитам проходить спокойно и дружелюбно.',
    initials: 'С',
    tone: 'linear-gradient(145deg, #eadfd8, #f8f5ef)',
  },
]

export const reviews: Review[] = [
  {
    author: 'Юлия',
    pet: 'корги Макс',
    text: 'Макс обычно нервничает, а здесь быстро успокоился. После ухода шерсть мягкая, и запись подтвердили в тот же день.',
  },
  {
    author: 'Ольга',
    pet: 'кот Марс',
    text: 'Понравилась чистота и очень тихий подход. Марс перенес вычесывание спокойнее, чем в прошлых салонах.',
  },
  {
    author: 'Ника',
    pet: 'шпиц Луна',
    text: 'Мастер уточнила все пожелания заранее. Луна вернулась аккуратной, чистой и без стресса.',
  },
  {
    author: 'Даша',
    pet: 'метис Тедди',
    text: 'Запись заняла меньше минуты. Перед визитом мне спокойно объяснили, как пройдет уход.',
  },
]

export const petTypeLabels = {
  dog: 'Собака',
  cat: 'Кот',
  other: 'Другое',
} as const
