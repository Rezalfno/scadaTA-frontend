import { useState } from 'react';

import { LoginPage } from '../components/LoginPage';
import { MainMenu } from '../components/MainMenu';
import { OEEDashboard } from '../components/OEEDashboard';
import { SCADAControl } from '../components/SCADAControl';
import { AlarmPage } from '../components/AlarmPage';
import { DataLoggerPage } from '../components/DataLoggerPage';

type Page = 'login' | 'menu' | 'oee' | 'control' | 'alarm' | 'datalogger';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');

  return (
    <div className="size-full">
      {currentPage === 'login' && (
        <LoginPage onLogin={() => setCurrentPage('menu')} />
      )}

      {currentPage === 'menu' && (
        <MainMenu
          onNavigate={(page) => setCurrentPage(page)}
          onLogout={() => setCurrentPage('login')}
        />
      )}

      {currentPage === 'oee' && (
        <OEEDashboard onLogout={() => setCurrentPage('menu')} />
      )}

      {currentPage === 'control' && (
        <SCADAControl onBack={() => setCurrentPage('menu')} />
      )}

      {currentPage === 'alarm' && (
        <AlarmPage onBack={() => setCurrentPage('menu')} />
      )}

      {currentPage === 'datalogger' && (
        <DataLoggerPage onBack={() => setCurrentPage('menu')} />
      )}
    </div>
  );
}
