import { getUpdates } from './telegram-api.js'
import { handleTelegramUpdate } from './controller.js'

let offset = 0

console.log('Happy Paws bot polling started')

while (true) {
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
