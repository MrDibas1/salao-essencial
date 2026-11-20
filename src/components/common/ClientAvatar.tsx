import React, { useState } from 'react';

interface ClientAvatarProps {
  name: string;
  avatarUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ClientAvatar: React.FC<ClientAvatarProps> = ({
  name,
  avatarUrl,
  size = 'md',
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  };

  const initial = name ? name.trim().charAt(0).toUpperCase() : '?';

  if (avatarUrl && !hasError) {
    return (
      <div
        className={`relative rounded-full overflow-hidden shrink-0 border border-[#EAE4DE] bg-[#FAF8F6] shadow-xs ${sizeClasses[size]} ${className}`}
      >
        <img
          src={avatarUrl}
          alt={name}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`rounded-full bg-[#FDF3E7] text-[#8C530A] border border-[#EAE4DE]/60 flex items-center justify-center font-semibold shrink-0 shadow-xs ${sizeClasses[size]} ${className}`}
    >
      {initial}
    </div>
  );
};
