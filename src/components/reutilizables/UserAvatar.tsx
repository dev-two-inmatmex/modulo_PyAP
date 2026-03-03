import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  url?: string | null;
  name: string;
  className?: string; // Para poder cambiarle el tamaño desde afuera (ej: w-24 h-24)
}

export function UserAvatar({ url, name, className }: UserAvatarProps) {
  // Extraemos la primera letra para el fallback
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <Avatar className={className}>
      <AvatarImage src={url || undefined} alt={name} className="object-cover" />
      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
        {initial}
      </AvatarFallback>
    </Avatar>
  );
}