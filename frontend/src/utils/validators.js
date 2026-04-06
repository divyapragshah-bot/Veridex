export function isValidUrl(str) {
  if (!str || str.trim().length === 0) return false
  try {
    const url = new URL(str.startsWith('http') ? str : `https://${str}`)
    return url.hostname.includes('.')
  } catch {
    return false
  }
}

export function isValidEmail(str) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(str.trim())
}

export function containsEmailContent(str) {
  // Checks if the string looks like email content (has words/phrases)
  return str.trim().length >= 20
}

export function isValidPhone(str) {
  return /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(str.trim())
}
