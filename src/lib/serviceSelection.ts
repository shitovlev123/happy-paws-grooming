export const serviceSelectionEventName = 'happy-paws:service-selection'

export type ServiceSelectionDetail = {
  serviceId: string
}

export const emitServiceSelection = (serviceId: string) => {
  window.dispatchEvent(
    new CustomEvent<ServiceSelectionDetail>(serviceSelectionEventName, {
      detail: { serviceId },
    }),
  )
}
