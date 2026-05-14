export const getImageUrl = (image, backendUrl) => {
  if (!image) return ''
  if (image.startsWith('http')) return image
  if (!backendUrl) return image

  const normalizedImage = image.replace(/\\/g, '/').replace(/^\/+/, '')

  if (normalizedImage.startsWith('uploads/')) {
    return `${backendUrl}/${normalizedImage}`
  }

  if (!normalizedImage.includes('/')) {
    return `${backendUrl}/uploads/${normalizedImage}`
  }

  return `${backendUrl}/${normalizedImage}`
}
