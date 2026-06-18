import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getToken } from "../utils/auth";
import { Save } from "lucide-react";

const API_STUDENTS = "http://localhost:8080/students";
const API_ATTENDANCE = "http://localhost:8080/attendance";

export default function AttendanceManager() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  const getHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getToken()}`
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch all students (assuming pagination is large enough or just fetching page 0 for now)
      const stRes = await fetch(`${API_STUDENTS}?size=1000`, { headers: getHeaders() });
      const stJson = await stRes.json();
      if (stJson.success) {
        setStudents(stJson.data.content);
      }

      // Fetch attendance for selected date
      const atRes = await fetch(`${API_ATTENDANCE}/date/${date}`, { headers: getHeaders() });
      const atJson = await atRes.json();
      
      const attendanceMap = {};
      if (atJson.success) {
        atJson.data.forEach(record => {
          attendanceMap[record.studentId] = record.status;
        });
      }
      setAttendance(attendanceMap);
    } catch (err) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [date]);

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    const payload = students.map(st => ({
      studentId: st.id,
      date: date,
      status: attendance[st.id] || "ABSENT" // Default to ABSENT if not marked
    }));

    try {
      const res = await fetch(`${API_ATTENDANCE}/mark`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      
      if (json.success) {
        toast.success("Attendance saved successfully!");
      } else {
        toast.error(json.message || "Failed to save attendance");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  return (
    <div className="layout" style={{ display: 'block' }}>
      <div className="form-card" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Select Date</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}
          />
        </div>
        <button className="btn-primary" onClick={handleSave}>
          <Save size={18} /> Save Attendance
        </button>
      </div>

      {loading ? (
        <div className="spinner-container"><div className="spinner"></div></div>
      ) : (
        <div className="student-grid" style={{ gridTemplateColumns: '1fr' }}>
          {students.map(student => (
            <div className="student-card" key={student.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
              <div>
                <h3 style={{ margin: 0 }}>{student.name}</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>Roll: {student.roll} | Course: {student.course?.courseName || 'N/A'}</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--success)' }}>
                  <input 
                    type="radio" 
                    name={`status-${student.id}`} 
                    checked={attendance[student.id] === 'PRESENT'}
                    onChange={() => handleStatusChange(student.id, 'PRESENT')}
                  />
                  Present
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--danger)' }}>
                  <input 
                    type="radio" 
                    name={`status-${student.id}`} 
                    checked={attendance[student.id] === 'ABSENT'}
                    onChange={() => handleStatusChange(student.id, 'ABSENT')}
                  />
                  Absent
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
