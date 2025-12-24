/**
 * Generate UUID with fallback for non-secure contexts (HTTP)
 * crypto.randomUUID() only works in secure contexts (HTTPS or localhost)
 */
export function generateUUID(): string {
  // Try native crypto.randomUUID first (works in secure contexts)
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  
  // Fallback for non-secure contexts (HTTP over IP address)
  // RFC4122 version 4 compliant UUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
