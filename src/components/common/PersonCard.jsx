import React from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { User } from "lucide-react"

/**
 * PersonCard
 * Props:
 * - image: string (optional)
 * - name: string
 * - subtitle: string (role or character)
 */
const PersonCard = ({ image, name, subtitle }) => {

  return (
    <div className="flex items-center gap-3 rounded-md border bg-white p-3">
      <Avatar className="h-10 w-10 flex-shrink-0">
        <AvatarImage src={image} alt={name || "Person"} />
        <AvatarFallback className="bg-muted">
            <User className="h-4 w-4 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0">
        <p className="text-sm font-medium truncate">
          {name || "Unknown"}
        </p>
        {subtitle && (
          <p className="text-xs text-muted-foreground truncate">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}

export default PersonCard
