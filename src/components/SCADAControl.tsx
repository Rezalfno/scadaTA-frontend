import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { getMonitorData } from '../services/monitor.service';
import machineImage from "../assets/machine-visual.png";

interface IndicatorLightProps {
  isOn: boolean;
  label: string;
}

function IndicatorLight({ isOn, label }: IndicatorLightProps) {
  return (
    <div className="flex items-center gap-4 bg-gray-900 p-4 border-2 border-gray-700">
      <div
        className={`w-12 h-12 rounded-full border-4 transition-all duration-200 ${
          isOn
            ? 'bg-green-500 border-green-700'
            : 'bg-red-600 border-red-800'
        }`}
      />
      <span className="text-base text-gray-100 font-bold uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}

interface CounterCardProps {
  label: string;
  value: number;
  color: 'green' | 'red' | 'blue';
}

function CounterCard({ label, value, color }: CounterCardProps) {
  const colors = {
    green: 'text-green-400 border-green-500',
    red: 'text-red-400 border-red-500',
    blue: 'text-blue-400 border-blue-500',
  };

  return (
    <div className={`bg-gray-900 border-4 ${colors[color]} p-6`}>
      <p className="text-sm text-gray-400 mb-2 uppercase tracking-wider font-bold">
        {label}
      </p>
      <p className={`text-5xl font-bold ${colors[color]}`}>{value}</p>
    </div>
  );
}

interface SCADAControlProps {
  onBack: () => void;
}

// 🔥 SAFE BOOLEAN CONVERTER
const toBool = (value: any): boolean => {
  if (value === true || value === 1 || value === '1') return true;
  if (value === false || value === 0 || value === '0') return false;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }
  return Boolean(value);
};

export function SCADAControl({ onBack }: SCADAControlProps) {

  const [monitor, setMonitor] = useState<any>({});

  // 🔧 TAMBAHAN
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {

    let isFetching = false;

    const fetchData = async () => {

      if (isFetching) return;
      isFetching = true;

      try {
        const monitorData = await getMonitorData();

        setMonitor(monitorData);
        setError(null);
        setIsConnected(true);
        setLastUpdate(new Date());

      } catch (err: any) {

        console.error('Fetch error:', err);

        setError(err.message);
        setIsConnected(false);

      } finally {
        isFetching = false;
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);

    return () => clearInterval(interval);

  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-600 via-red-400 to-white p-6">
      <div className="max-w-[1920px] mx-auto">

        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between mb-6 bg-gray-900 border-4 border-gray-800 p-4">

          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 border-2 border-red-800 shadow-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
            <span className="text-base text-white font-bold uppercase">
              Back
            </span>
          </button>

          <div className="text-center">
            <h1 className="text-white text-4xl mb-2 font-bold uppercase tracking-wider">
              WEB-SCADA MODULAR PRODUCTION SYSTEM
            </h1>
            <p className="text-white text-2xl mb-2 font-bold uppercase tracking-wider">
              Distribution & Sorting Machine Monitoring
            </p>
          </div>

          {/* 🔧 STATUS */}
          <div className="text-right text-sm">
            {isConnected ? (
              <p className="text-green-400 font-bold">● ONLINE</p>
            ) : (
              <p className="text-red-500 font-bold">● OFFLINE</p>
            )}

            {lastUpdate && (
              <p className="text-gray-400 text-xs">
                {lastUpdate.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        {/* 🔧 ERROR DISPLAY */}
        {error && (
          <div className="bg-red-800 text-white p-2 text-sm mb-4 border-2 border-red-900">
            ⚠ Error: {error}
          </div>
        )}

        {/* ================= MACHINE VISUAL ================= */}
        <div className="bg-gray-900 border-4 border-gray-800 mb-6">
          <div className="bg-red-600 border-b-4 border-gray-800 p-3">
            <h3 className="text-xl text-white font-bold uppercase tracking-wide">
              MACHINE VISUAL OVERVIEW
            </h3>
          </div>

          <div className="p-6 flex justify-center">
            <img
              src={machineImage}
              alt="Machine Visual"
              className="rounded-lg shadow-xl max-h-[420px] object-contain"
            />
          </div>
        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="grid grid-cols-12 gap-6">

          {/* LEFT PANEL */}
          <div className="col-span-8 space-y-6">

            {/* OUTPUT INDICATORS */}
            <div className="bg-gray-900 border-4 border-gray-800">
              <div className="bg-red-600 border-b-4 border-gray-800 p-3">
                <h3 className="text-xl text-white font-bold uppercase tracking-wide">
                  OUTPUT INDICATORS
                </h3>
              </div>

              <div className="p-4 grid grid-cols-2 gap-4">
                <IndicatorLight isOn={toBool(monitor?.piston_maju)} label="Piston Stack Magazine" />
                <IndicatorLight isOn={toBool(monitor?.vacuum)} label="Vacuum" />
                <IndicatorLight isOn={toBool(monitor?.rotary_kanan)} label="Changer Module Kanan" />
                <IndicatorLight isOn={toBool(monitor?.rotary_kiri)} label="Changer Module Kiri" />
                <IndicatorLight isOn={toBool(monitor?.motor_status)} label="Motor Konveyor" />
                <IndicatorLight isOn={toBool(monitor?.piston_sortir)} label="Piston Sortir (Good Product)" />
              </div>
            </div>

            {/* PRODUCTION COUNTERS */}
            <div className="bg-gray-900 border-4 border-gray-800">
              <div className="bg-red-600 border-b-4 border-gray-800 p-3">
                <h3 className="text-xl text-white font-bold uppercase tracking-wide">
                  PRODUCTION COUNTERS
                </h3>
              </div>

              <div className="p-4 grid grid-cols-3 gap-4">
                <CounterCard label="Counter Distribusi" value={monitor?.counter_distribusi ?? 0} color="blue" />
                <CounterCard label="Good Product" value={monitor?.good_product ?? 0} color="green" />
                <CounterCard label="Bad Product" value={monitor?.bad_product ?? 0} color="red" />
              </div>
            </div>

          </div>

          {/* RIGHT PANEL */}
          <div className="col-span-4 space-y-6">

            {/* DISTRIBUTION STATUS */}
            <div className="bg-gray-900 border-4 border-gray-800">
              <div className="bg-blue-600 border-b-4 border-gray-800 p-3">
                <h2 className="text-xl text-white font-bold uppercase tracking-wide">
                  DISTRIBUTION PLANT STATUS
                </h2>
              </div>

              <div className="p-4 space-y-4 bg-black border-4 border-gray-700">
                <IndicatorLight isOn={toBool(monitor?.distribution_on)} label="ON" />
                <IndicatorLight isOn={toBool(monitor?.distribution_off)} label="OFF" />
                <IndicatorLight isOn={toBool(monitor?.distribution_emergency)} label="EMERGENCY" />
              </div>
            </div>

            {/* SORTING STATUS */}
            <div className="bg-gray-900 border-4 border-gray-800">
              <div className="bg-green-600 border-b-4 border-gray-800 p-3">
                <h2 className="text-xl text-white font-bold uppercase tracking-wide">
                  SORTING PLANT STATUS
                </h2>
              </div>

              <div className="p-4 space-y-4 bg-black border-4 border-gray-700">
                <IndicatorLight isOn={toBool(monitor?.sorting_on)} label="ON" />
                <IndicatorLight isOn={toBool(monitor?.sorting_off)} label="OFF" />
                <IndicatorLight isOn={toBool(monitor?.sorting_emergency)} label="EMERGENCY" />
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}