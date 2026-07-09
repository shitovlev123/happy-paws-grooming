export type PetType = 'dog' | 'cat' | 'other'

export type BookingRequest = {
  idempotencyKey?: string
  ownerName: string
  phone: string
  petName: string
  petType: PetType
  breed: string
  serviceId: string
  serviceName: string
  preferredDate: string
  preferredTime: string
  comment: string
}

export type Service = {
  id: string
  title: string
  description: string
  price: string
  duration: string
  accent: string
}

export type Groomer = {
  name: string
  role: string
  experience: string
  description: string
  tone: string
  avatar: string
}

export type Review = {
  author: string
  pet: string
  text: string
}
