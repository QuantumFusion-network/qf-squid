interface BrandLockupProps {
  compact?: boolean
}

export function BrandLockup({ compact = false }: BrandLockupProps) {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/brand/qf-network.png"
        alt="QF Network"
        className={compact ? "h-8 w-auto" : "h-10 w-auto sm:h-12"}
      />
      <div className="space-y-0.5">
        <div className="text-sm font-semibold tracking-[0.16em] uppercase text-foreground/80">
          QF Network
        </div>
        <div className="text-xs text-muted-foreground">Transfer Explorer</div>
      </div>
    </div>
  )
}
