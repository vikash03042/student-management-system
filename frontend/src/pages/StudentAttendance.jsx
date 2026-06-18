import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getToken } from "../utils/auth";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Attendance.css"; // Custom styling overrides

const API_ATTENDANCE = "http://localhost:8080/attendance";

export default function StudentAttendance() {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const getHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getToken()}`
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [histRes, statsRes] = await Promise.all([
        fetch(`${API_ATTENDANCE}/my`, { headers: getHeaders() }),
        fetch(`${API_ATTENDANCE}/my/stats`, { headers: getHeaders() })
      ]);

      const histJson = await histRes.json();
      const statsJson = await statsRes.json();

      if (histJson.success) setRecords(histJson.data);
      if (statsJson.success) setStats(statsJson.data);
    } catch (err) {
      toast.error("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split("T")[0];
      const record = records.find(r => r.date === dateStr);
      if (record) {
        return record.status === "PRESENT" ? "tile-present" : "tile-absent";
      }
    }
    return null;
  };

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
      
      {stats && (
        <div className="student-grid" style={{ width: '100%', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <div className="form-card" style={{ textAlign: 'center' }}>
            <h3>Total Days</h3>
            <h2 style={{ color: 'var(--primary)', fontSize: '2.5rem' }}>{stats.totalDays}</h2>
          </div>
          <div className="form-card" style={{ textAlign: 'center' }}>
            <h3>Present</h3>
            <h2 style={{ color: 'var(--success)', fontSize: '2.5rem' }}>{stats.presentDays}</h2>
          </div>
          <div className="form-card" style={{ textAlign: 'center' }}>
            <h3>Absent</h3>
            <h2 style={{ color: 'var(--danger)', fontSize: '2.5rem' }}>{stats.absentDays}</h2>
          </div>
          <div className="form-card" style={{ textAlign: 'center' }}>
            <h3>Percentage</h3>
            <h2 style={{ color: stats.attendancePercentage >= 75 ? 'var(--success)' : 'var(--danger)', fontSize: '2.5rem' }}>
              {stats.attendancePercentage}%
            </h2>
          </div>
        </div>
      )}

      <div className="form-card" style={{ width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        {loading ? (
          <div className="spinner"></div>
        ) : (
          <Calendar 
            tileClassName={getTileClassName}
          />
        )}
      </div>

    </div>
  );
}
