import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/components/Dashboard';
import { Handbook } from '@/components/Handbook';
import { ProjectManagement } from '@/components/ProjectManagement';
import { ProcessFlow } from '@/components/ProcessFlow';
import { ResponsibilityMatrix } from '@/components/ResponsibilityMatrix';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onTabChange={setActiveTab} />;
      case 'handbook':
        return <Handbook />;
      case 'projects':
        return <ProjectManagement />;
      case 'process':
        return <ProcessFlow />;
      case 'parties':
        return <ResponsibilityMatrix />;
      default:
        return <Dashboard onTabChange={setActiveTab} />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
      <Toaster />
    </Layout>
  );
}

export default App;
