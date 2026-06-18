import { useState } from "react";
import { LogOut, Users, BookOpen, CalendarCheck, Banknote } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { removeToken, getUserRole, getUserName, getUserEmail } from "../utils/auth";
import StudentManager from "./StudentManager";
import CourseManager from "./CourseManager";
import AttendanceManager from "./AttendanceManager";
import StudentAttendance from "./StudentAttendance";
import FeeManager from "./FeeManager";
import StudentFees from "./StudentFees";

export default function Dashboard() {
  const navigate = useNavigate();
  const role = getUserRole();
  const isAdmin = role === "ROLE_ADMIN";

  const [activeTab, setActiveTab] = useState(isAdmin ? "STUDENTS" : "MY_PROFILE");

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1>System Dashboard</h1>
            <div style={{ padding: '0.25rem 0.75rem', background: 'var(--primary)', color: 'white', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 'bold' }}>
              {getUserName()} ({getUserEmail()})
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            {isAdmin ? (
              <>
                <button 
                  className={activeTab === "STUDENTS" ? "btn-primary" : "btn-secondary"}
                  onClick={() => setActiveTab("STUDENTS")}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                >
                  <Users size={16} /> Manage Students
                </button>
                <button 
                  className={activeTab === "COURSES" ? "btn-primary" : "btn-secondary"}
                  onClick={() => setActiveTab("COURSES")}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                >
                  <BookOpen size={16} /> Manage Courses
                </button>
                <button 
                  className={activeTab === "ATTENDANCE" ? "btn-primary" : "btn-secondary"}
                  onClick={() => setActiveTab("ATTENDANCE")}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                >
                  <CalendarCheck size={16} /> Attendance
                </button>
                <button 
                  className={activeTab === "FEES" ? "btn-primary" : "btn-secondary"}
                  onClick={() => setActiveTab("FEES")}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                >
                  <Banknote size={16} /> Fees
                </button>
              </>
            ) : (
              <>
                <button 
                  className={activeTab === "MY_PROFILE" ? "btn-primary" : "btn-secondary"}
                  onClick={() => setActiveTab("MY_PROFILE")}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                >
                  <Users size={16} /> My Profile
                </button>
                <button 
                  className={activeTab === "MY_ATTENDANCE" ? "btn-primary" : "btn-secondary"}
                  onClick={() => setActiveTab("MY_ATTENDANCE")}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                >
                  <CalendarCheck size={16} /> My Attendance
                </button>
                <button 
                  className={activeTab === "MY_FEES" ? "btn-primary" : "btn-secondary"}
                  onClick={() => setActiveTab("MY_FEES")}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                >
                  <Banknote size={16} /> My Fees
                </button>
              </>
            )}
          </div>
        </div>
        <button onClick={handleLogout} className="btn-secondary" style={{ color: 'var(--danger)' }}>
          <LogOut size={18} /> Logout
        </button>
      </header>

      {isAdmin && activeTab === "STUDENTS" && <StudentManager />}
      {isAdmin && activeTab === "COURSES" && <CourseManager />}
      {isAdmin && activeTab === "ATTENDANCE" && <AttendanceManager />}
      {isAdmin && activeTab === "FEES" && <FeeManager />}
      
      {!isAdmin && activeTab === "MY_PROFILE" && <StudentManager />}
      {!isAdmin && activeTab === "MY_ATTENDANCE" && <StudentAttendance />}
      {!isAdmin && activeTab === "MY_FEES" && <StudentFees />}
    </div>
  );
}
