export type PetType = 'dog' | 'cat' | 'other'

export type BookingRequest = {
  ownerName: string
  phone: string
  petName: string
  petType: PetType
  breed: string
  serviceId: string
  serviceName: string
  preferredDate: string
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
  initials: string
  tone: string
}

export type Review = {
  author: string
  pet: string
  text: string
}
