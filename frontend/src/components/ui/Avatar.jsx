export default function Avatar({ 
  src, 
  alt = 'User',
  size = 'md',
  name,
  className = '',
  ...props 
}) {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };
  
  // Generate initials from name
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };
  
  // Generate a consistent color from name
  const getColorFromName = (name) => {
    if (!name) return 'from-neutral-400 to-neutral-600';
    const colors = [
      'from-blue-400 to-blue-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-green-400 to-green-600',
      'from-yellow-400 to-yellow-600',
      'from-red-400 to-red-600',
      'from-indigo-400 to-indigo-600',
      'from-teal-400 to-teal-600',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };
  
  const baseStyles = 'rounded-full flex items-center justify-center font-medium overflow-hidden';
  
  if (src) {
    return (
      <img 
        src={src} 
        alt={alt}
        className={`${baseStyles} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
  
  return (
    <div 
      className={`${baseStyles} ${sizes[size]} bg-gradient-to-br ${getColorFromName(name)} text-white ${className}`}
      {...props}
    >
      {getInitials(name || alt)}
    </div>
  );
}

// Avatar Group component for showing multiple avatars
Avatar.Group = function AvatarGroup({ children, max = 3, className = '' }) {
  const childArray = Array.isArray(children) ? children : [children];
  const visibleChildren = childArray.slice(0, max);
  const remainingCount = childArray.length - max;
  
  return (
    <div className={`flex -space-x-2 ${className}`}>
      {visibleChildren}
      {remainingCount > 0 && (
        <div className="w-10 h-10 rounded-full bg-neutral-300 dark:bg-neutral-600 flex items-center justify-center text-neutral-700 dark:text-neutral-200 text-sm font-medium border-2 border-white dark:border-neutral-800">
          +{remainingCount}
        </div>
      )}
    </div>
  );
};
