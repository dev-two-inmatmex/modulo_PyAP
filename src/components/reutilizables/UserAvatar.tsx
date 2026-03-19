"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAvatars } from "../providers/useAvatars";

interface UserAvatarProps {
  employeeId: string | null;
  name: string | null;
  className?: string; // Para poder cambiarle el tamaño desde afuera (ej: w-24 h-24)
}

export function UserAvatar({ employeeId, name, className }: UserAvatarProps) {
  // Extraemos la primera letra para el fallback
  const { getAvatarUrl } = useAvatars();
  const avatarUrl = getAvatarUrl(employeeId?.toString() || '');
  const getInitials = (name: string) => {
    if (!name) return "";
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.substring(0, 2).toUpperCase();
  };

  return (
    <Avatar className={className}>
      <AvatarImage src={avatarUrl} alt={name?.toString() || ''} className="object-cover" />
      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
      {getInitials(name?.toString() || '')}
      </AvatarFallback>
    </Avatar>
  );
}