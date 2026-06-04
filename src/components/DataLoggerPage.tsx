import { useState, useEffect } from 'react';
import { ArrowLeft, Download, Calendar } from 'lucide-react';
import { BASE_URL } from '../config/api';

interface DataLoggerPageProps {
  onBack: () => void;
}

export function DataLoggerPage({ onBack }: DataLoggerPageProps) {
  const [selectedDate, setSelectedDate] =
  useState(
    new Date()
      .toISOString()
      .split('T')[0]
  );
  const [logs, setLogs] = useState<any[]>([]);

  const fetchLogs = async () => {

      try {

        const response = await fetch(
          `${BASE_URL}/api/data/datalogger`
        );

        const data = await response.json();

        setLogs(data);

      } catch (error) {

        console.error(
          'Failed fetch logs:',
          error
        );

      }

    };

    useEffect(() => {

      fetchLogs();

      const interval = setInterval(() => {

        fetchLogs();

      }, 5000);

      return () => clearInterval(interval);

    }, []);

      const handleExport = () => {
        // Create CSV content with headers only
        const headers = [
      'Timestamp',
      'Machine Status',
      'Good Product',
      'Bad Product',
      'Total Product',
      'Availability',
      'Performance',
      'Quality',
      'OEE',
      ];

      const rows = filteredLogs.map((log) => [
      new Date(log.timestamp)
        .toLocaleString('id-ID'),
      log.machine_status,
      log.good_product,
      log.bad_product,
      log.total_product,
      `${log.availability}%`,
      `${log.performance}%`,
      `${log.quality}%`,
      `${log.oee}%`
    ].join(';'));

    const csvContent = [
      headers.join(';'),
      ...rows
    ].join('\n');

        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `data_logger_${selectedDate}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      };

      const filteredLogs = logs
      .filter((log) => {

        const logDate = new Date(log.timestamp)
          .toISOString()
          .split('T')[0];

        return logDate === selectedDate;

      })

      .sort((a, b) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime()
      );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-600 via-red-400 to-white p-6">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 bg-gray-900 border-4 border-gray-800 p-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 border-2 border-red-800 shadow-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
            <span className="text-base text-white font-bold uppercase">Back</span>
          </button>
          <div className="text-center">
            <h1 className="text-white text-4xl mb-2 font-bold uppercase tracking-wider">
              DATA LOGGER
            </h1>
            <p className="text-green-300 text-lg uppercase tracking-wide font-bold">
              Production Data Logger
            </p>
          </div>
          <div className="w-32"></div>
        </div>

        {/* Filters and Export */}
        <div className="bg-gray-900 border-4 border-gray-800 mb-6">
          <div className="bg-gray-800 border-b-4 border-gray-700 p-3">
            <h3 className="text-sm text-white font-bold uppercase tracking-wide">
              FILTERS & EXPORT
            </h3>
          </div>
          <div className="p-4 flex items-end justify-between gap-4">
            <div className="flex gap-4 flex-1">
              <div className="flex-1">
                <label className="text-xs text-gray-400 uppercase block mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-3 bg-gray-800 border-2 border-gray-700 text-white font-mono text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 border-2 border-green-800 text-white font-bold uppercase transition-all"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Data Table - Empty */}
        <div className="bg-gray-900 border-4 border-gray-800">
          <div className="bg-blue-600 border-b-4 border-gray-800 p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl text-white font-bold uppercase tracking-wide">
                PRODUCTION DATA LOG
              </h3>
            </div>
            <span className="text-white font-bold text-sm">
              Total Records: {filteredLogs.length}
            </span>
          </div>
          <div className="p-4">
            <div className="bg-black border-4 border-gray-700 overflow-x-auto">
              <table className="w-full">
               <thead>
                <tr className="border-b-4 border-gray-700 bg-gray-800">
                  <th className="text-left p-3 text-gray-300 font-bold uppercase text-xs">
                    Timestamp
                  </th>
                  <th className="text-center p-3 text-gray-300 font-bold uppercase text-xs">
                    Machine
                  </th>
                  <th className="text-center p-3 text-gray-300 font-bold uppercase text-xs">
                    Good Product
                  </th>
                  <th className="text-center p-3 text-gray-300 font-bold uppercase text-xs">
                    Bad Product
                  </th>
                  <th className="text-center p-3 text-gray-300 font-bold uppercase text-xs">
                    Total Product
                  </th>
                  <th className="text-center p-3 text-gray-300 font-bold uppercase text-xs">
                    Availability
                  </th>
                  <th className="text-center p-3 text-gray-300 font-bold uppercase text-xs">
                    Performance
                  </th>
                  <th className="text-center p-3 text-gray-300 font-bold uppercase text-xs">
                    Quality
                  </th>
                  <th className="text-center p-3 text-gray-300 font-bold uppercase text-xs">
                    OEE
                  </th>
                </tr>
              </thead>
                <tbody>
                {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-gray-800 hover:bg-gray-900"
                    >
                      <td className="p-3 text-white text-sm">
                        {new Date(
                          log.timestamp
                        ).toLocaleString('id-ID')}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`
                            px-3 py-1 rounded text-xs font-bold
                            ${
                            log.machine_status === 'RUNNING'
                              ? 'bg-green-600 text-white'
                              : log.machine_status === 'IDLE'
                              ? 'bg-yellow-500 text-black'
                              : 'bg-red-600 text-white'
                          }
                          `}
                        >
                          {log.machine_status}
                        </span>
                      </td>
                      <td className="p-3 text-center text-green-400 font-bold">
                        {log.good_product}
                      </td>
                      <td className="p-3 text-center text-red-400 font-bold">
                        {log.bad_product}
                      </td>
                      <td className="p-3 text-center text-blue-400 font-bold">
                        {log.total_product}
                      </td>
                      <td className="p-3 text-center text-white">
                        {log.availability}%
                      </td>
                      <td className="p-3 text-center text-white">
                        {log.performance}%
                      </td>
                      <td className="p-3 text-center text-white">
                        {log.quality}%
                      </td>
                      <td className="p-3 text-center text-green-400 font-bold">
                        {log.oee}%
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={9}
                      className="p-12 text-center"
                    >
                      <div className="flex flex-col items-center gap-4">
                        <svg
                          className="w-16 h-16 text-gray-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span className="text-gray-500 text-lg font-bold uppercase">
                          No Data Available
                        </span>
                        <span className="text-gray-600 text-sm uppercase">
                          Start production to log data
                        </span>
                      </div>
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
  );
}
