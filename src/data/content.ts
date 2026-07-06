import type { Groomer, Review, Service } from '../types/booking'

export const services: Service[] = [
  {
    id: 'full-grooming',
    title: 'Полный груминг',
    description: 'Купание, сушка, стрижка, вычесывание, ушки и когти за один визит.',
    price: 'от 4 200 ₽',
    duration: '2-3 часа',
    accent: '#e45b43',
  },
  {
    id: 'haircut',
    title: 'Стрижка',
    description: 'Форма под породу, шерсть и привычный образ питомца.',
    price: 'от 2 700 ₽',
    duration: '90 минут',
    accent: '#e45b43',
  },
  {
    id: 'bath',
    title: 'Купание',
    description: 'Деликатное очищение, кондиционер по типу шерсти и мягкая сушка.',
    price: 'от 1 900 ₽',
    duration: '60 минут',
    accent: '#e45b43',
  },
  {
    id: 'deshedding',
    title: 'Вычесывание',
    description: 'Снимаем подшерсток, уменьшаем линьку и возвращаем шерсти легкость.',
    price: 'от 2 100 ₽',
    duration: '75 минут',
    accent: '#e45b43',
  },
  {
    id: 'nails',
    title: 'Когти и лапки',
    description: 'Стрижка когтей, шлифовка и уход за подушечками для комфортных прогулок.',
    price: 'от 900 ₽',
    duration: '20 минут',
    accent: '#e45b43',
  },
  {
    id: 'express-care',
    title: 'Экспресс-уход',
    description: 'Освежим питомца перед встречей, поездкой или семейной съемкой.',
    price: 'от 1 400 ₽',
    duration: '40 минут',
    accent: '#e45b43',
  },
]

export const groomers: Groomer[] = [
  {
    name: 'Яна',
    role: 'Грумер собак малых пород',
    experience: '6 лет опыта',
    description: 'Аккуратно собирает форму и подробно объясняет владельцу, как поддерживать шерсть дома.',
    tone: 'linear-gradient(145deg, #f4c6ba, #fff6e9)',
    avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=Yana&backgroundColor=f8d7d0',
  },
  {
    name: 'Мия',
    role: 'Специалист по кошкам',
    experience: '7 лет опыта',
    description: 'Работает короткими этапами, чтобы кошке было проще перенести уход и сушку.',
    tone: 'linear-gradient(145deg, #cddff4, #fff8ef)',
    avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=Mia&backgroundColor=dceaf8',
  },
  {
    name: 'Лера',
    role: 'Первый груминг щенков',
    experience: '4 года опыта',
    description: 'Помогает щенкам привыкнуть к инструментам, воде и фену в комфортном темпе.',
    tone: 'linear-gradient(145deg, #cde6ef, #fff8ea)',
    avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=Roma&backgroundColor=d8edf4',
  },
  {
    name: 'Марк',
    role: 'Стрижки средних и крупных пород',
    experience: '8 лет опыта',
    description: 'Любит четкую форму, аккуратные контуры и понятный план ухода для активных собак.',
    tone: 'linear-gradient(145deg, #d7d1f1, #fff6ea)',
    avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=Mark&backgroundColor=e4dcf7',
  },
  {
    name: 'Ася',
    role: 'SPA-уход и восстановление шерсти',
    experience: '5 лет опыта',
    description: 'Подбирает маски, кондиционеры и мягкий уход для сухой, пушащейся или плотной шерсти.',
    tone: 'linear-gradient(145deg, #f6cfdc, #fff9ee)',
    avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=Asya&backgroundColor=f8dce7',
  },
  {
    name: 'Рома',
    role: 'Вычесывание и сезонная линька',
    experience: '6 лет опыта',
    description: 'Помогает пережить сезонную линьку и объясняет, как ухаживать за шерстью между визитами.',
    tone: 'linear-gradient(145deg, #f7d88f, #fff5ea)',
    avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=Lera&backgroundColor=f8e5b0',
  },
]

export const reviews: Review[] = [
  {
    author: 'Юлия К.',
    pet: 'корги Макс',
    text: 'Макс обычно нервничает, а здесь быстро успокоился. Шерсть мягкая, пахнет чисто, и мне заранее объяснили цену.',
  },
  {
    author: 'Ольга Р.',
    pet: 'кот Марс',
    text: 'Понравилась чистота и тихий подход. Марс перенес вычесывание спокойнее, чем в прошлых салонах.',
  },
  {
    author: 'Ника С.',
    pet: 'шпиц Луна',
    text: 'Мастер уточнила все пожелания заранее. Луна вернулась аккуратной, чистой и абсолютно бодрой.',
  },
  {
    author: 'Даша М.',
    pet: 'метис Тедди',
    text: 'Запись заняла меньше минуты. Перед визитом мне спокойно объяснили, как пройдет уход и что взять с собой.',
  },
  {
    author: 'Игорь П.',
    pet: 'лабрадор Норд',
    text: 'После вычесывания дома стало заметно меньше шерсти. Норд вышел довольный, а мастер дала простые советы по уходу.',
  },
  {
    author: 'Марина В.',
    pet: 'мейн-кун Симба',
    text: 'Понравилось, что кошку не торопили. Мне прислали фото после процедуры и написали, как лучше расчесывать шерсть.',
  },
  {
    author: 'Алина Т.',
    pet: 'йорк Боня',
    text: 'Стрижка получилась аккуратной и естественной. В салоне чисто, светло, и запись подтвердили быстро.',
  },
]

export const petTypeLabels = {
  dog: 'Собака',
  cat: 'Кот',
  other: 'Другое',
} as const
