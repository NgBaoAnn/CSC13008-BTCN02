import React from 'react'
import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'

function HeartIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" className="size-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.172 5.172a4 4 0 015.656 0L12 8.343l3.172-3.171a4 4 0 115.656 5.656L12 21.657 3.172 10.828a4 4 0 010-5.656z" />
    </svg>
  )
}

export default function FavoriteToggle({ pressed, onPressedChange, disabled, className, size = 'default' }) {
  return (
    <Toggle
      aria-label={pressed ? 'Remove from favorites' : 'Add to favorites'}
      pressed={pressed}
      onPressedChange={onPressedChange}
      disabled={disabled}
      size={size}
      className={cn(
        'transition-colors',
        pressed ? 'text-red-600' : 'text-muted-foreground',
        className,
      )}
    >
      <HeartIcon filled={pressed} />
    </Toggle>
  )
}
