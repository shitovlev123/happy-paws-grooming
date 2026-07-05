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
    `Новая заявка ${booking.id}`,
    `Статус: ${statusLabels[booking.status] || booking.status}`,
    `Клиент: ${booking.ownerName}`,
    `Телефон: ${booking.phone}`,
    `Питомец: ${booking.petName} (${petTypeLabels[booking.petType] || 'Другое'})`,
    `Порода: ${booking.breed || 'не указана'}`,
    `Услуга: ${booking.serviceName}`,
    `Дата: ${booking.preferredDate}`,
    `Время: ${booking.preferredTime || 'не указано'}`,
    `Комментарий: ${booking.comment || 'нет комментария'}`,
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

export const mainKeyboard = {
  keyboard: [[{ text: 'Админ-панель' }]],
  resize_keyboard: true,
}

export const adminPanelKeyboard = {
  inline_keyboard: [
    [{ text: 'Последние заявки', callback_data: 'panel:bookings' }],
    [{ text: 'Выдать админку', callback_data: 'panel:grant' }],
    [{ text: 'Администраторы', callback_data: 'panel:admins' }],
  ],
}

export const adminPanelText = [
  'Админ-панель Счастливые лапки',
  'Здесь приходят новые заявки с сайта.',
  'Вы можете подтверждать, выполнять или отменять заявки кнопками под сообщением.',
].join('\n')

export const formatHelpMessage = (isAdminUser) => {
  if (!isAdminUser) {
    return 'Здравствуйте! Доступ к админ-панели выдаёт действующий администратор.'
  }

  return 'Нажмите кнопку «Админ-панель», чтобы открыть управление заявками и администраторами.'
}
