const petTypeLabels = {
  dog: 'Собака',
  cat: 'Кот',
  other: 'Другое',
}

const statusLabels = {
  new: 'Новая',
  confirmed: 'Подтверждена',
  completed: 'Выполнена',
  cancelled: 'Отменена',
}

export const formatBookingMessage = (booking) =>
  [
    `Заявка ${booking.id}`,
    `Статус: ${statusLabels[booking.status] || booking.status}`,
    `Клиент: ${booking.ownerName}`,
    `Телефон: ${booking.phone}`,
    `Питомец: ${booking.petName} (${petTypeLabels[booking.petType] || 'Другое'})`,
    `Порода: ${booking.breed || 'не указана'}`,
    `Услуга: ${booking.serviceName}`,
    `Дата: ${booking.preferredDate}`,
    `Комментарий: ${booking.comment || 'без комментария'}`,
  ].join('\n')

export const bookingKeyboard = (bookingId) => ({
  inline_keyboard: [
    [
      { text: 'Подтвердить', callback_data: `status:${bookingId}:confirmed` },
      { text: 'Выполнена', callback_data: `status:${bookingId}:completed` },
    ],
    [{ text: 'Отменить', callback_data: `status:${bookingId}:cancelled` }],
  ],
})

export const formatHelpMessage = (isAdminUser) => {
  if (!isAdminUser) {
    return 'Здравствуйте! Если администратор уже назначен, попросите его выдать вам доступ.'
  }

  return [
    'Панель администратора Happy Paws',
    '/bookings - последние заявки',
    '/admins - список администраторов',
    '/grant TELEGRAM_ID - выдать доступ администратору',
    '/status ID new|confirmed|completed|cancelled - сменить статус заявки',
  ].join('\n')
}
