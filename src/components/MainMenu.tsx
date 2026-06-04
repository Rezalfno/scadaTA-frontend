import { ArrowLeft, BarChart3, Gauge, TriangleAlert, FileText } from 'lucide-react';

interface MainMenuProps {
  onNavigate: (page: 'oee' | 'control' | 'alarm' | 'datalogger') => void;
  onLogout: () => void;
}

export function MainMenu({ onNavigate, onLogout }: MainMenuProps) {

  const role = localStorage.getItem("role")

  const menus = []

  if (role === "manager") {
    menus.push("oee")
  }

  if (role === "supervisor") {
    menus.push("control", "alarm")
  }

  if (role === "maintenance") {
    menus.push("control", "alarm", "datalogger")
  }

  if (role === "operator") {
    menus.push("oee", "control", "alarm", "datalogger")
  }

  const gridClass =
    menus.length === 1
      ? "grid-cols-1"
      : menus.length === 2
      ? "grid-cols-2"
      : "grid-cols-2"

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-600 via-red-400 to-white p-6 flex items-start justify-center">

      <div className="max-w-6xl w-full">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8 bg-gray-900 border-4 border-gray-800 p-4">
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 border-2 border-red-800"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
            <span className="text-white font-bold uppercase">Logout</span>
          </button>

          <div className="text-center">
            <h1 className="text-white text-4xl font-bold uppercase">
              WEB-SCADA MODULAR PRODUCTION SYSTEM
            </h1>
            <p className="text-white text-2xl font-bold uppercase">
              DISTRIBUTION & SORTING STATION
            </p>
          </div>

          <div className="w-32"></div>
        </div>

        {/* MENU */}
        <div className={`grid ${gridClass} gap-8`}>

          {menus.includes("oee") && (
            <div
              onClick={() => onNavigate('oee')}
              className="cursor-pointer bg-gray-900 border-4 border-gray-800 hover:border-red-500 transition-all"
            >
              <div className="bg-red-600 p-4 text-center text-white font-bold text-2xl">
                OEE DASHBOARD
              </div>
              <div className="p-16 text-center text-white">
                <BarChart3 size={70} className="mx-auto mb-4"/>
                Overall Equipment Effectiveness
              </div>
            </div>
          )}

          {menus.includes("control") && (
            <div
              onClick={() => onNavigate('control')}
              className="cursor-pointer bg-gray-900 border-4 border-gray-800 hover:border-green-500 transition-all"
            >
              <div className="bg-green-600 p-4 text-center text-white font-bold text-2xl">
                MONITORING MACHINE
              </div>
              <div className="p-16 text-center text-white">
                <Gauge size={70} className="mx-auto mb-4"/>
                Distribution & Sorting Machine
              </div>
            </div>
          )}

          {menus.includes("alarm") && (
            <div
              onClick={() => onNavigate('alarm')}
              className="cursor-pointer bg-gray-900 border-4 border-gray-800 hover:border-yellow-500 transition-all"
            >
              <div className="bg-yellow-600 p-4 text-center text-white font-bold text-2xl">
                ALARM SYSTEM
              </div>
              <div className="p-16 text-center text-white">
                <TriangleAlert size={70} className="mx-auto mb-4"/>
                Alarm & Event Management
              </div>
            </div>
          )}

          {menus.includes("datalogger") && (
            <div
              onClick={() => onNavigate('datalogger')}
              className="cursor-pointer bg-gray-900 border-4 border-gray-800 hover:border-blue-500 transition-all"
            >
              <div className="bg-blue-600 p-4 text-center text-white font-bold text-2xl">
                DATA LOGGER
              </div>
              <div className="p-16 text-center text-white">
                <FileText size={70} className="mx-auto mb-4"/>
                Production Data Logger
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}