import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getToken } from "../utils/auth";
import { Book, CreditCard, AlertCircle } from "lucide-react";

const API_FEES = "http://localhost:8080/fees";

export default function StudentFees() {
  const [stats, setStats] = useState(null);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  const getHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getToken()}`
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, feesRes] = await Promise.all([
        fetch(`${API_FEES}/my/stats`, { headers: getHeaders() }),
        fetch(`${API_FEES}/my`, { headers: getHeaders() })
      ]);

      const statsJson = await statsRes.json();
      const feesJson = await feesRes.json();

      if (statsJson.success) setStats(statsJson.data);
      if (feesJson.success) setFees(feesJson.data);
    } catch (err) {
      toast.error("Failed to load fee data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="layout" style={{ display: 'block' }}>
      
      {stats && (
        <div className="student-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '2rem' }}>
          <div className="form-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Book size={40} color="var(--primary)" />
            <div>
              <h3>Total Course Fees</h3>
              <h2 style={{ fontSize: '2rem', margin: 0 }}>₹{stats.courseFees}</h2>
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
              <h3>Remaining Balance</h3>
              <h2 style={{ fontSize: '2rem', margin: 0, color: 'var(--danger)' }}>₹{stats.remainingBalance}</h2>
            </div>
          </div>
        </div>
      )}

      <div className="form-card" style={{ padding: '0' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ margin: 0 }}>My Payment History</h2>
        </div>
        {loading ? (
          <div className="spinner-container" style={{ padding: '2rem' }}><div className="spinner"></div></div>
        ) : fees.length === 0 ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No fee records found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>Transaction ID</th>
                <th style={{ padding: '1rem' }}>Date</th>
                <th style={{ padding: '1rem' }}>Amount</th>
                <th style={{ padding: '1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {fees.map(fee => (
                <tr key={fee.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>#{fee.id}</td>
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
    </div>
  );
}
