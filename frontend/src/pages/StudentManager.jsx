import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BookOpen, MapPin, Hash, Edit2, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { getToken, getUserRole } from "../utils/auth";

const API_BASE = "http://localhost:8080/students";
const COURSE_API = "http://localhost:8080/courses";

export default function StudentManager() {
  const role = getUserRole();
  const isAdmin = role === "ROLE_ADMIN";

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Sort States
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortField, setSortField] = useState("id");
  const [sortDir, setSortDir] = useState("ASC");
  
  // Search State
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  // Form & Modal States
  const [formData, setFormData] = useState({ name: "", roll: "", address: "", courseId: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const getHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getToken()}`
  });

  const fetchCourses = async () => {
    try {
      const res = await fetch(COURSE_API, { headers: getHeaders() });
      const json = await res.json();
      if (json.success) setCourses(json.data);
    } catch (err) {
      toast.error("Failed to fetch courses");
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const url = new URL(API_BASE);
      url.searchParams.append("page", currentPage);
      url.searchParams.append("size", 10);
      url.searchParams.append("sortField", sortField);
      url.searchParams.append("sortDir", sortDir);
      if (appliedSearch) url.searchParams.append("search", appliedSearch);

      const res = await fetch(url, { headers: getHeaders() });
      const json = await res.json();

      if (json.success) {
        setStudents(json.data.content);
        setTotalPages(json.data.totalPages);
        setTotalElements(json.data.totalElements);
      } else {
        toast.error(json.message || "Failed to fetch students");
      }
    } catch (err) {
      toast.error("Network error while fetching students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [currentPage, sortField, sortDir, appliedSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    setAppliedSearch(searchInput);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name.trim() || formData.name.length < 2) return toast.error("Name must be at least 2 characters") && false;
    if (!formData.roll || formData.roll <= 0) return toast.error("Enter a valid roll number") && false;
    if (!formData.address.trim()) return toast.error("Address is required") && false;
    if (!formData.courseId) return toast.error("Please select a Course") && false;
    return true;
  };

  const buildPayload = () => ({
    ...formData,
    course: formData.courseId ? { id: formData.courseId } : null
  });

  const addStudent = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(buildPayload()),
      });
      const json = await res.json();

      if (json.success || res.status === 201) {
        toast.success(json.message || "Student Added");
        setFormData({ name: "", roll: "", address: "", courseId: "" });
        fetchStudents();
      } else {
        toast.error(json.message || "Failed to add student");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE", headers: getHeaders() });
      const json = await res.json();
      if (json.success || res.status === 200) {
        toast.success("Student deleted successfully");
        fetchStudents();
      } else {
        toast.error(json.message || "Failed to delete");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  const openEditModal = (student) => {
    setEditingId(student.id);
    setFormData({
      name: student.name,
      roll: student.roll,
      address: student.address,
      courseId: student.course ? student.course.id : "",
    });
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", roll: "", address: "", courseId: "" });
  };

  const updateStudent = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await fetch(`${API_BASE}/${editingId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(buildPayload()),
      });
      const json = await res.json();

      if (json.success || res.status === 200) {
        toast.success(json.message || "Updated Successfully");
        closeEditModal();
        fetchStudents();
      } else {
        toast.error(json.message || "Failed to update student");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  return (
    <div className="layout">
      {isAdmin && (
        <aside>
          <div className="form-card">
            <h2>Add New Student</h2>
            <form onSubmit={addStudent}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" />
              </div>
              <div className="form-group">
                <label>Roll Number</label>
                <input type="number" name="roll" value={formData.roll} onChange={handleChange} placeholder="101" />
              </div>
              <div className="form-group">
                <label>Course</label>
                <select 
                  name="courseId" 
                  value={formData.courseId} 
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                >
                  <option value="">Select a Course</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.courseName}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="City, Country" />
              </div>
              <button type="submit" className="btn-primary">Add Student</button>
            </form>
          </div>
        </aside>
      )}

      <main style={{ gridColumn: isAdmin ? 'auto' : '1 / -1' }}>
        {isAdmin && (
          <div className="controls-bar">
            <form onSubmit={handleSearch} className="search-bar">
              <input 
                type="text" 
                placeholder="Search name, course, roll..." 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button type="submit" className="btn-icon">
                <Search size={20} />
              </button>
            </form>

            <select className="sort-select" onChange={(e) => {
              const [field, dir] = e.target.value.split(",");
              setSortField(field); setSortDir(dir); setCurrentPage(0);
            }} value={`${sortField},${sortDir}`}>
              <option value="id,ASC">Sort by ID (Asc)</option>
              <option value="name,ASC">Name (A-Z)</option>
              <option value="name,DESC">Name (Z-A)</option>
              <option value="roll,ASC">Roll No (Low-High)</option>
              <option value="roll,DESC">Roll No (High-Low)</option>
            </select>
          </div>
        )}

        {loading ? (
          <div className="spinner-container"><div className="spinner"></div></div>
        ) : students.length === 0 ? (
          <p className="no-data">No students found.</p>
        ) : (
          <>
            <div className="student-grid">
              {students.map((student) => (
                <div className="student-card" key={student.id}>
                  <h3>{student.name}</h3>
                  <p><Hash size={16} /> {student.roll}</p>
                  <p><BookOpen size={16} /> {student.course ? student.course.courseName : "No Course Assigned"}</p>
                  <p><MapPin size={16} /> {student.address}</p>
                  
                  <div className="card-actions">
                    <button className="btn-secondary" onClick={() => openEditModal(student)}>
                      <Edit2 size={16} /> Edit
                    </button>
                    {isAdmin && (
                      <button className="btn-danger" onClick={() => deleteStudent(student.id)}>
                        <Trash2 size={16} /> Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button disabled={currentPage === 0} onClick={() => setCurrentPage(p => p - 1)} className="btn-secondary">
                  <ChevronLeft size={18} /> Prev
                </button>
                <span className="page-info">Page <b>{currentPage + 1}</b> of {totalPages}</span>
                <button disabled={currentPage === totalPages - 1} onClick={() => setCurrentPage(p => p + 1)} className="btn-secondary">
                  Next <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Profile</h2>
            <form onSubmit={updateStudent}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Roll Number</label>
                <input type="number" name="roll" value={formData.roll} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Course</label>
                <select 
                  name="courseId" 
                  value={formData.courseId} 
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                >
                  <option value="">Select a Course</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.courseName}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeEditModal} style={{ width: '100%' }}>Cancel</button>
                <button type="submit" className="btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
