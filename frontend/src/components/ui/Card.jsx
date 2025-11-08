export default function Card({ 
  children, 
  className = '', 
  padding = 'default',
  hover = false,
  ...props 
}) {
  const baseStyles = 'bg-white dark:bg-neutral-800 rounded-xl shadow-subtle border border-neutral-200/60 dark:border-neutral-700/60';
  
  const paddings = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  };
  
  const hoverStyles = hover ? 'hover:shadow-lg hover:border-neutral-300 dark:hover:border-neutral-600 transition-all duration-200' : '';
  
  return (
    <div 
      className={`${baseStyles} ${paddings[padding]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// Card subcomponents for structured content
Card.Header = function CardHeader({ children, className = '' }) {
  return (
    <div className={`border-b border-neutral-200 dark:border-neutral-700 pb-4 mb-4 ${className}`}>
      {children}
    </div>
  );
};

Card.Title = function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-lg font-semibold text-neutral-900 dark:text-white ${className}`}>
      {children}
    </h3>
  );
};

Card.Body = function CardBody({ children, className = '' }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ children, className = '' }) {
  return (
    <div className={`border-t border-neutral-200 dark:border-neutral-700 pt-4 mt-4 ${className}`}>
      {children}
    </div>
  );
};
