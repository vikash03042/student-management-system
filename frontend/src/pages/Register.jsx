import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UserPlus } from "lucide-react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "STUDENT", courseId: "" });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  // Load courses on mount
  useEffect(() => {
    fetch("http://localhost:8080/courses?size=100")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCourses(data?.data?.content || data?.data || []);
        else setCourses([]);
      })
      .catch(() => setCourses([]));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "email") {
      if (value && !EMAIL_REGEX.test(value)) setEmailError("Please enter a valid email address");
      else setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!EMAIL_REGEX.test(formData.email)) {
      setEmailError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if ((response.ok || response.status === 201) && data.success) {
        toast.success("Registration successful! Please login.");
        navigate("/login");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div className="form-card" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Create Account</h2>
        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="text"
              name="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ borderColor: emailError ? "var(--danger)" : undefined }}
            />
            {emailError && (
              <p style={{ color: "var(--danger)", fontSize: "0.78rem", marginTop: "0.25rem" }}>
                ⚠ {emailError}
              </p>
            )}
          </div>

          <div className="form-group">
            <label>Password <span style={{ color: "#888", fontSize: "0.75rem" }}>(min 6 characters)</span></label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Register As</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border)" }}
            >
              <option value="STUDENT">Student</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>

          {formData.role === "STUDENT" && (
            <div className="form-group">
              <label>Select Course</label>
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border)" }}
                required
              >
                <option value="">-- Choose Course --</option>
                {Array.isArray(courses) && courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.courseName}</option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", marginTop: "1rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}
            disabled={loading || !!emailError}
          >
            {loading ? <div className="spinner" /> : <><UserPlus size={18} /> Register</>}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Already have an account? <a href="/login" style={{ color: "var(--primary)" }}>Login</a>
        </p>
      </div>
    </div>
  );
}
