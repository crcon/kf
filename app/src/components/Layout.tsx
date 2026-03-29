import { useState } from 'react';
import { 
  BookOpen, 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  FileText, 
  Settings,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', name: '项目总览', icon: LayoutDashboard },
  { id: 'handbook', name: '开发手册', icon: BookOpen },
  { id: 'projects', name: '项目管理', icon: FolderKanban },
  { id: 'process', name: '流程图', icon: FileText },
  { id: 'parties', name: '责任边界', icon: Users },
];

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white border-r border-slate-200 transition-all duration-300 flex flex-col",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-slate-200">
          <div className={cn(
            "flex items-center gap-3 transition-all",
            sidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
          )}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ES</span>
            </div>
            <span className="font-semibold text-slate-800 text-sm">储能开发平台</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all",
                  isActive 
                    ? "bg-gradient-to-r from-blue-50 to-teal-50 text-blue-700 border-l-3 border-blue-600" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-blue-600")} />
                <span className={cn(
                  "text-sm font-medium transition-all",
                  sidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                )}>
                  {item.name}
                </span>
                {isActive && sidebarOpen && (
                  <ChevronRight className="w-4 h-4 ml-auto text-blue-600" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all">
            <Settings className="w-5 h-5" />
            <span className={cn(
              "text-sm font-medium transition-all",
              sidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
            )}>
              设置
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
