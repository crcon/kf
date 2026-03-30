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
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'handbook', name: '开发手册', icon: BookOpen },
  { id: 'process', name: '流程图', icon: FileText },
  { id: 'parties', name: '责任边界', icon: Users },
  { id: 'dashboard', name: '项目总览', icon: LayoutDashboard },
  { id: 'projects', name: '项目管理', icon: FolderKanban },
];

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  const renderNavButton = (item: typeof navItems[number], mobile = false) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;

    return (
      <button
        key={item.id}
        onClick={() => onTabChange(item.id)}
        className={cn(
          mobile
            ? 'flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-all'
            : 'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all',
          isActive
            ? mobile
              ? 'border-blue-200 bg-gradient-to-r from-blue-50 to-teal-50 text-blue-700 shadow-sm'
              : 'bg-gradient-to-r from-blue-50 to-teal-50 text-blue-700 border-l-3 border-blue-600'
            : mobile
              ? 'border-slate-200 bg-white text-slate-600'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        )}
      >
        <Icon className={cn('flex-shrink-0', mobile ? 'w-4 h-4' : 'w-5 h-5', isActive && 'text-blue-600')} />
        <span
          className={cn(
            'font-medium transition-all',
            mobile ? 'opacity-100' : sidebarOpen ? 'opacity-100 text-sm' : 'opacity-0 w-0 overflow-hidden'
          )}
        >
          {item.name}
        </span>
        {!mobile && isActive && sidebarOpen && (
          <ChevronRight className="w-4 h-4 ml-auto text-blue-600" />
        )}
      </button>
    );
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xs leading-none">易储</span>
            </div>
            <div className="min-w-0">
              <div className="truncate text-base font-semibold text-slate-900">易储数能开发平台</div>
              <div className="text-xs text-slate-500">移动端快捷导航</div>
            </div>
          </div>

          <nav className="overflow-x-auto px-3 pb-3">
            <div className="flex gap-2 min-w-max">
              {navItems.map((item) => renderNavButton(item, true))}
            </div>
          </nav>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    );
  }

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
              <span className="text-white font-bold text-xs leading-none">易储</span>
            </div>
            <span className="font-semibold text-slate-800 text-sm">易储数能开发平台</span>
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
          {navItems.map((item) => renderNavButton(item))}
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
