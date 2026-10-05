const maxBytes = 5 * 1024 * 1024
const maxEdge = 480

export function readLogoFile(file: File) {
  if (!file.type.startsWith('image/')) {
    return Promise.reject(new Error('Choose a PNG or JPEG image.'))
  }
  if (file.size > maxBytes) {
    return Promise.reject(new Error('Use an image smaller than 5 MB.'))
  }

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read that image.'))
    reader.onload = () => {
      const image = new Image()
      image.onerror = () => reject(new Error('Could not read that image.'))
      image.onload = () => {
        const scale = Math.min(1, maxEdge / Math.max(image.width, image.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(image.width * scale))
        canvas.height = Math.max(1, Math.round(image.height * scale))
        const context = canvas.getContext('2d')
        if (!context) {
          reject(new Error('Could not read that image.'))
          return
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        const type = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
        resolve(canvas.toDataURL(type, 0.85))
      }
      image.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  })
}
