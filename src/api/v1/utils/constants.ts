export const ROLES = ['admin', 'customer'] as const

export const INTERNAL_ERROR_MESSAGE =
  'Something went wrong from our end, please try again later. Report the issue if it persists' as const

export const UNAUTHORIZE_ERROR_MESSAGE =
  "You do not have permission to access this resource. Please ensure you're logged in with the correct account or contact support for assistance." as const

export const UNAUTHENTICATED_ERROR_MESSAGE =
  'You need to log in to access this resource. Please sign in with your account to continue.' as const
