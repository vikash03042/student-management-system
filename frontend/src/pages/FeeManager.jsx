import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getToken } from "../utils/auth";
import { Banknote, CreditCard, AlertCircle } from "lucide-react";

const API_FEES = "http://localhost:8080/fees";
const API_STUDENTS = "http://localhost:8080/students";

export default function FeeManager() {
  const [stats, setStats] = useState(null);
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({ studentId: "", amount: "", paymentDate: new Date().toISOString().split("T")[0], status: "PAID" });

  const getHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getToken()}`
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, feesRes, studentsRes] = await Promise.all([
        fetch(`${API_FEES}/stats`, { headers: getHeaders() }),
        fetch(API_FEES, { headers: getHeaders() }),
        fetch(`${API_STUDENTS}?size=1000`, { headers: getHeaders() })
      ]);

      const statsJson = await statsRes.json();
      const feesJson = await feesRes.json();
      const studentsJson = await studentsRes.json();

      if (statsJson.success) setStats(statsJson.data);
      if (feesJson.success) setFees(feesJson.data);
      if (studentsJson.success) setStudents(studentsJson.data.content);
    } catch (err) {
      toast.error("Failed to load fee data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const recordFee = async (e) => {
    e.preventDefault();
    if (!formData.studentId) return toast.error("Select a student");
    if (!formData.amount || formData.amount <= 0) return toast.error("Enter a valid amount");

    try {
      const res = await fetch(API_FEES, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(formData)
      });
      const json = await res.json();

      if (json.success || res.status === 201) {
        toast.success("Fee recorded successfully");
        setFormData({ ...formData, studentId: "", amount: "" });
        fetchData();
      } else {
        toast.error(json.message || "Failed to record fee");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  return (
    <div className="layout" style={{ display: 'block' }}>
      
      {stats && (
        <div className="student-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '2rem' }}>
          <div className="form-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Banknote size={40} color="var(--primary)" />
            <div>
              <h3>Expected Collection</h3>
              <h2 style={{ fontSize: '2rem', margin: 0 }}>₹{stats.totalExpected}</h2>
            </div>
          </div>
          <div className="form-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <CreditCard size={40} color="var(--success)" />
            <div>
              <h3>Amount Paid</h3>
              <h2 style={{ fontSize: '2rem', margin: 0, color: 'var(--success)' }}>₹{stats.totalPaid}</h2>
            </div>
          </div>
          <div className="form-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <AlertCircle size={40} color="var(--danger)" />
            <div>
              <h3>Pending Amount</h3>
              <h2 style={{ fontSize: '2rem', margin: 0, color: 'var(--danger)' }}>₹{stats.totalPending}</h2>
            </div>
          </div>
        </div>
      )}

      <div className="layout" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', alignItems: 'start' }}>
        <aside>
          <div className="form-card">
            <h2>Record Payment</h2>
            <form onSubmit={recordFee}>
              <div className="form-group">
                <label>Student</label>
                <select name="studentId" value={formData.studentId} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <option value="">Select Student</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.roll})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Amount (₹)</label>
                <input type="number" name="amount" value={formData.amount} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" name="paymentDate" value={formData.paymentDate} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <option value="PAID">Paid</option>
                  <option value="PENDING">Pending (Invoice)</option>
                </select>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Submit Payment</button>
            </form>
          </div>
        </aside>

        <main>
          <div className="form-card" style={{ padding: '0' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ margin: 0 }}>Recent Transactions</h2>
            </div>
            {loading ? (
              <div className="spinner-container" style={{ padding: '2rem' }}><div className="spinner"></div></div>
            ) : fees.length === 0 ? (
              <p style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No fee records found.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: '1rem' }}>ID</th>
                    <th style={{ padding: '1rem' }}>Student Name</th>
                    <th style={{ padding: '1rem' }}>Course</th>
                    <th style={{ padding: '1rem' }}>Date</th>
                    <th style={{ padding: '1rem' }}>Amount</th>
                    <th style={{ padding: '1rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map(fee => (
                    <tr key={fee.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem' }}>#{fee.id}</td>
                      <td style={{ padding: '1rem', fontWeight: 'bold' }}>{fee.studentName}</td>
                      <td style={{ padding: '1rem' }}>{fee.courseName}</td>
                      <td style={{ padding: '1rem' }}>{fee.paymentDate}</td>
                      <td style={{ padding: '1rem', fontWeight: 'bold' }}>₹{fee.amount}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '999px', 
                          fontSize: '0.85rem', 
                          fontWeight: 'bold',
                          background: fee.status === 'PAID' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          color: fee.status === 'PAID' ? '#166534' : '#991b1b'
                        }}>
                          {fee.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
