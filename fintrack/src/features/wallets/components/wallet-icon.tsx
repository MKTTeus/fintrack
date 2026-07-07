import type { WalletItem } from '../types/wallet.types'

interface WalletIconProps {
  wallet: WalletItem
}

export function WalletIcon({ wallet }: WalletIconProps) {
  const Icon = wallet.icon
  const style = wallet.color
    ? {
        backgroundColor: `${wallet.color}1A`,
        color: wallet.color,
      }
    : undefined

  return (
    <div
      className={`
        flex
        size-11
        shrink-0
        items-center
        justify-center
        rounded-2xl
        ${wallet.iconClassName}
      `}
      style={style}
    >
      <Icon className="size-5" />
    </div>
  )
}
