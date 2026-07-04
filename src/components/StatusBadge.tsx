import { statusLabels } from '../data/content'
import type { BookingStatus } from '../types/booking'

export const StatusBadge = ({ status }: { status: BookingStatus }) => {
  return <span className={`status-badge status-${status}`}>{statusLabels[status]}</span>
}
