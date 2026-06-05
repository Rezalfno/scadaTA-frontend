import { useState, useEffect } from 'react';
import { ArrowLeft, Bell, Calendar } from 'lucide-react';
import { BASE_URL } from '../config/api';

interface AlarmPageProps {
  onBack: () => void;
}

export function AlarmPage({ onBack }: AlarmPageProps) {
  const [selectedDate, setSelectedDate] = useState(
  new Date()
    .toISOString()
    .split('T')[0]
);

  const [alarms, setAlarms] = useState<any[]>([]);
  const fetchAlarms = async () => {
    try {

      const response = await fetch(
        `${BASE_URL}/api/alarm/history`
      );

      const data = await response.json();

      setAlarms(data);

    } catch (err) {

      console.error(err);

    }

  };

  useEffect(() => {

  fetchAlarms();

  const interval = setInterval(() => {

    fetchAlarms();

  }, 3000);

  return () => clearInterval(interval);

  }, []);
  
  const filteredAlarms = alarms.filter((alarm: any) => {

  const alarmDate =
    alarm.timestamp.split('T')[0];

  return alarmDate === selectedDate;

});

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
              ALARM SYSTEM
            </h1>
            <p className="text-red-300 text-lg uppercase tracking-wide font-bold">
              Distribution dan Sorting Station
            </p>
          </div>
          <div className="w-32"></div>
        </div>

                {/* Filters */}
        <div className="bg-gray-900 border-4 border-gray-800 mb-6">

          <div className="bg-gray-800 border-b-4 border-gray-700 p-3">

            <h3 className="text-sm text-white font-bold uppercase tracking-wide">
              FILTERS
            </h3>

          </div>

          <div className="p-4 flex items-end gap-4">

            <div className="flex-1">

              <label className="text-xs text-gray-400 uppercase block mb-2">

                <Calendar className="w-4 h-4 inline mr-1" />

                Select Date

              </label>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="
                  w-full
                  p-3
                  bg-gray-800
                  border-2
                  border-gray-700
                  text-white
                  font-mono
                  text-sm
                  focus:border-yellow-500
                  focus:outline-none
                "
              />

            </div>

          </div>

        </div>

        {/* Alarm List - Empty Table */}
        <div className="bg-gray-900 border-4 border-gray-800">
          <div className="bg-yellow-600 border-b-4 border-gray-800 p-3 flex items-center gap-3">
            <Bell className="w-6 h-6 text-white" />
            <h3 className="text-xl text-white font-bold uppercase tracking-wide">
              ALARM LIST
            </h3>
          </div>
          <div className="p-4">
            <div className="bg-black border-4 border-gray-700">
              <table className="w-full">
                <thead>
                  <tr className="border-b-4 border-gray-700 bg-gray-800">
                    <th className="w-1/4 text-left p-4 text-gray-300 font-bold uppercase text-sm">
                      Timestamp
                    </th>
                    <th className="w-1/2 text-left p-4 text-gray-300 font-bold uppercase text-sm">
                      Alarm
                    </th>
                    <th className="w-1/4 text-center p-4 text-gray-300 font-bold uppercase text-sm">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>

                {filteredAlarms.length > 0 ? (

                  filteredAlarms.map((alarm: any) => (

                    <tr
                      key={alarm.id}
                      className="border-b border-gray-800 hover:bg-gray-900"
                    >

                      <td className="p-4 text-white text-sm">

                        {
                          new Date(
                            alarm.timestamp
                          ).toLocaleString('id-ID')
                        }

                      </td>

                      <td className="p-4 text-white text-sm">

                        {alarm.alarm_message}

                      </td>

                      <td className="p-4 text-center">

                       <span
                        className={`
                          px-3
                          py-1
                          rounded
                          text-xs
                          font-bold
                          text-white

                          ${
                            alarm.status === 'ACTIVE' ||
                            alarm.status === 'FAULT'
                              ? 'bg-red-600'
                              : alarm.status === 'CLEARED'
                              ? 'bg-green-600'
                              : 'bg-gray-600'
                          }
                        `}
                      >

                        {alarm.status}

                      </span>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan={3}
                      className="p-12 text-center"
                    >

                      <div className="flex flex-col items-center gap-4">

                        <Bell className="w-16 h-16 text-gray-700" />

                        <span className="text-gray-500 text-lg font-bold uppercase">
                          No Alarms
                        </span>

                        <span className="text-gray-600 text-sm uppercase">
                          System Operating Normally
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
