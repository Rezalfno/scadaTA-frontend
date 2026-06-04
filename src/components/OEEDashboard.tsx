import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from "react";
import { getLatestProduction } from "../services/production.service";
import { BASE_URL } from "../config/api";

interface CircularGaugeProps {
  value: number;
  label: string;
}

function CircularGauge({ value, label }: CircularGaugeProps) {
  const radius = 50;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  // Determine colors based on value
  const isGood = value > 50;
  const progressColor = isGood ? '#22c55e' : '#ef4444';
  const textColor = isGood ? '#22c55e' : '#ef4444';

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="transform -rotate-90" width="128" height="128">
          {/* Background circle */}
          <circle
            stroke="#374151"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={64}
            cy={64}
          />
          {/* Progress circle */}
          <circle
            stroke={progressColor}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={64}
            cy={64}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl" style={{ color: textColor }}>{value}%</span>
        </div>
      </div>
      <p className="text-sm text-gray-400 mt-3 text-center">{label}</p>
    </div>
  );
}

interface MetricCardProps {
  value: string | number;
  unit: string;
  label: string;
}

function MetricCard({ value, unit, label }: MetricCardProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
      <p className="text-xs text-gray-400 mb-2">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl text-green-400">{value}</span>
        <span className="text-sm text-green-400">{unit}</span>
      </div>
    </div>
  );
}

interface OEEDashboardProps {
  onLogout: () => void;
}

export function OEEDashboard({ onLogout }: OEEDashboardProps) {
    const [data, setData] = useState<any>(null);

  const [historyData, setHistoryData] =
  useState<any[]>([]);

  const [currentTime, setCurrentTime] = useState(new Date());

useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(new Date());
  }, 1000);

  return () => clearInterval(timer);
}, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getLatestProduction();
        setData(res);
        console.log("DATA BACKEND:", res);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
     const fetchHistory = async () => {

    try {

      const res = await fetch(
        `${BASE_URL}/api/data/history`
      );

      const data = await res.json();

      setHistoryData(data);

    } catch (err) {

      console.error("History fetch error:", err);
    }
  };

    fetchData();

    fetchHistory();

    const interval = setInterval(() => {
    fetchData();
    fetchHistory();
  }, 5000);
  return () => clearInterval(interval);
}, []);

  const availability = data ? +data.availability : 0;
  const performance  = data ? +data.performance : 0;
  const quality      = data ? +data.quality : 0;
  const oee          = data ? +data.oee : 0;
  const formattedDate = currentTime.toLocaleDateString("id-ID", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const formattedTime = currentTime.toLocaleTimeString("id-ID", {
  hour12: false,
});


  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-600 via-red-400 to-white p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* ================= HEADER ================= */}
<div className="flex items-center justify-between mb-6 bg-gray-900 border-4 border-gray-800 p-4">

  {/* BACK BUTTON */}
  <button
    onClick={onLogout}
    className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 border-2 border-red-800 shadow-md transition-colors"
  >
    <ArrowLeft className="w-5 h-5 text-white" />
    <span className="text-base text-white font-bold uppercase">
      Back
    </span>
  </button>

  {/* TITLE */}
  <div className="text-center">
    <h1 className="text-white text-4xl mb-2 font-bold uppercase tracking-wider">
      OVERALL EQUIPMENT EFFECTIVENESS (OEE)
    </h1>
    <p className="text-white text-2xl mb-2 font-bold uppercase tracking-wider">
      Dashboard
    </p>
  </div>

  {/* DATE & TIME */}
  <div className="text-right">
    <p className="text-white text-lg font-bold">{formattedDate}</p>
    <p className="text-white text-xl font-bold">{formattedTime}</p>
  </div>

</div>
        {/* Main Content */}
        <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6">
          {/* Top Section - Gauges and Metrics */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            {/* Availability */}
            <div className="space-y-4">
              <h3 className="text-gray-300 text-sm mb-4">Availability</h3>
              <CircularGauge value={availability} label="" />
              <div className="grid grid-cols-1 gap-3">
                <MetricCard value={data?.operating_time || 0} unit="min" label="Running Machine" />
                <MetricCard value={data?.downtime || 0} unit="min" label="Downtime Machine" />
              </div>
            </div>

            {/* Performance */}
            <div className="space-y-4">
              <h3 className="text-gray-300 text-sm mb-4">Performance</h3>
              <CircularGauge value={performance} label="" />
              <div className="grid grid-cols-1 gap-3">
                <MetricCard value={data?.total_product || 0} unit="pcs" label="Total Product" />
              </div>
            </div>

            {/* Quality */}
            <div className="space-y-4">
              <h3 className="text-gray-300 text-sm mb-4">Quality</h3>
             <CircularGauge value={quality} label="" />
              <div className="grid grid-cols-1 gap-3">
                <MetricCard value={data?.good_product || 0} unit="pcs" label="Good Product" />
                <MetricCard value={data?.bad_product || 0} unit="pcs" label="Bad Product" />
              </div>
            </div>

            {/* OEE */}
            <div className="space-y-4">
              <h3 className="text-gray-300 text-sm mb-4">OEE</h3>
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-green-500 text-3xl font-semibold">{oee}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 my-6"></div>

          {/* Bottom Section */}
          <div className="grid grid-cols-2 gap-6">

            {/* Time Shift */}
            <div className="col-span-1">
              <h3 className="text-gray-300 mb-4">Time Shift</h3>
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Start Time</span>
                  <span className="text-green-400 text-xl">08:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">End Time</span>
                  <span className="text-red-400 text-xl">17:00</span>
                </div>
              </div>
            </div>

            {/* History OEE */}
            {/* History OEE */}
<div className="col-span-1">

  <h3 className="text-gray-300 mb-4">
    History OEE
  </h3>

  <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">

    <table className="w-full text-xs">

      <thead>

        <tr className="border-b border-gray-700">

          <th className="text-left py-2 px-3 text-gray-400">
            Date
          </th>

          <th className="text-left py-2 px-3 text-gray-400">
            Loading
          </th>

          <th className="text-left py-2 px-3 text-gray-400">
            Operating
          </th>

          <th className="text-left py-2 px-3 text-gray-400">
            OEE
          </th>

          <th className="text-left py-2 px-3 text-gray-400">
            Quality
          </th>

        </tr>

      </thead>

      <tbody>

        {historyData.length > 0 ? (

          historyData.map((row, index) => (

            <tr
              key={index}
              className="border-b border-gray-700/50"
            >

              <td className="py-2 px-3 text-gray-300">

              {new Date(row.created_at).toLocaleString(
                "id-ID",
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                }
              )}

             </td>

              <td className="py-2 px-3 text-gray-300">

                {row.loading_time} Min

              </td>

              <td className="py-2 px-3 text-gray-300">

                {row.operating_time} Min

              </td>

              <td className="py-2 px-3 text-green-400">

                {row.oee}%

              </td>

              <td className="py-2 px-3 text-gray-300">

                {row.quality}%

              </td>

            </tr>

          ))

        ) : (

          <tr>

            <td
              colSpan={5}
              className="text-center py-4 text-gray-500"
            >

              No History Data

            </td>

          </tr>

        )}

      </tbody>

    </table>

  </div>

</div>
          </div>
        </div>
      </div>
    </div>
  );
}
