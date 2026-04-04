import { useAppStore } from "../state/useAppStore";
import type { Role } from "../types";
import { ROLES } from "../constants/roles";
import ThemeToggle from "../theme/ThemeToggle";
import { LayoutDashboard, ArrowRightLeft, PieChart, Wallet, X } from "lucide-react";

const NAV_ITEMS = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "transactions", name: "Transactions", icon: ArrowRightLeft },
  { id: "insights", name: "Insights", icon: PieChart },
] as const;

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const role = useAppStore((state) => state.role);
  const setRole = useAppStore((state) => state.setRole);
  const activeTab = useAppStore((state) => state.activeTab);
  const setActiveTab = useAppStore((state) => state.setActiveTab);

  const handleNavClick = (id: typeof NAV_ITEMS[number]["id"]) => {
    setActiveTab(id);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 h-screen w-64 bg-slate-900 border-r border-slate-800 text-slate-100 p-5 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-10 px-2 mt-2">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Fintrack</h2>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mb-auto">
          <ul className="space-y-1 text-sm text-slate-400">
            {NAV_ITEMS.map((item, index) => {
              const isActive = activeTab === item.id;
              return (
                <li
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 animate-slide-in-left ${
                    isActive
                      ? "bg-indigo-600/10 text-indigo-400 font-medium shadow-sm"
                      : "hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  <item.icon className={`w-[18px] h-[18px] ${isActive ? "text-indigo-400" : ""}`} />
                  {item.name}
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-4 px-1">
          <ThemeToggle />
        </div>

        <div className="mt-4 border-t border-slate-800 pt-5 px-2">
          <label className="block mb-2 text-xs text-slate-500 uppercase tracking-widest font-semibold">
            Role
          </label>
          <select
            className="w-full p-2.5 bg-slate-800 border-none text-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer appearance-none"
            value={role}
            onChange={(event) => setRole(event.target.value as Role)}
          >
            <option value={ROLES.VIEWER}>Viewer</option>
            <option value={ROLES.ADMIN}>Admin</option>
          </select>
          <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
            {role === ROLES.ADMIN
              ? "✦ Full access to add, edit, delete."
              : "◎ Read-only access."}
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;