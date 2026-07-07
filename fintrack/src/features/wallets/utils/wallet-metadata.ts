export interface WalletMetadata {
  agency?: string
  bank?: string
  description?: string
  observations?: string
  pixKey?: string
  pixKeyType?: string
  account?: string
}

export function parseWalletMetadata(
  description?: string | null,
): WalletMetadata {
  if (!description) {
    return {}
  }

  try {
    const parsed = JSON.parse(description) as unknown

    if (parsed && typeof parsed === 'object') {
      return parsed as WalletMetadata
    }
  } catch {
    return {
      description,
    }
  }

  return {
    description,
  }
}

export function serializeWalletMetadata(
  metadata: WalletMetadata,
) {
  const cleanMetadata = Object.fromEntries(
    Object.entries(metadata).filter(([, value]) => {
      if (value === undefined || value === null) {
        return false
      }

      if (typeof value === 'string') {
        return value.trim().length > 0
      }

      return true
    }),
  )

  if (!Object.keys(cleanMetadata).length) {
    return null
  }

  return JSON.stringify(cleanMetadata)
}

export function getWalletDescriptionText(
  description?: string | null,
) {
  const metadata = parseWalletMetadata(description)

  return (
    metadata.description ??
    metadata.observations ??
    description ??
    ''
  )
}
