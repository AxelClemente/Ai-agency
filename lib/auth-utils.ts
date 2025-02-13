export const getAuthRedirectUrl = (returnUrl?: string) => {
    const baseAuthUrl = '/auth?mode=signin'
    if (returnUrl) {
      return `${baseAuthUrl}&returnUrl=${encodeURIComponent(returnUrl)}`
    }
    return baseAuthUrl
  }