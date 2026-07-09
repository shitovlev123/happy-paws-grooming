import { deleteWebhook, getUpdates } from './telegram-api.js'
import { handleTelegramUpdate } from './controller.js'

let offset = 0
let webhookDeleted = false

console.log('Счастливые лапки bot polling started')

while (true) {
  if (!webhookDeleted) {
    const webhook = await deleteWebhook()

    if (!webhook.ok) {
      console.error('Failed to delete Telegram webhook before polling', webhook)
    }

    webhookDeleted = true
  }

  const updates = await getUpdates(offset)

  if (!updates.ok) {
    console.error(updates)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    continue
  }

  for (const update of updates.result) {
    offset = update.update_id + 1
    await handleTelegramUpdate(update)
  }
}
