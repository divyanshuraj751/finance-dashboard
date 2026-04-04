const styles = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm hover:shadow-md",
  secondary: "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 focus:ring-slate-400",
  danger: "bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-500 shadow-sm",
  ghost: "bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-slate-400",
};

const Button = ({ children, onClick, variant = "primary", className = "", disabled, title }: {
  children: React.ReactNode; onClick?: () => void; variant?: keyof typeof styles;
  className?: string; disabled?: boolean; title?: string;
}) => (
  <button onClick={onClick} disabled={disabled} title={title}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${styles[variant]} ${className}`}>
    {children}
  </button>
);
export default Button;