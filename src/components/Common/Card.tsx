const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white dark:bg-slate-800/80 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm ${className}`}>
    {children}
  </div>
);
export default Card;