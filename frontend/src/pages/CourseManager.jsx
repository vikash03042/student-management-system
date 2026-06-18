import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Edit2, Trash2, Clock, DollarSign } from "lucide-react";
import { getToken } from "../utils/auth";

const COURSE_API = "http://localhost:8080/courses";

export default function CourseManager() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form & Modal States
  const [formData, setFormData] = useState({ courseName: "", duration: "", fees: "", description: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const getHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getToken()}`
  });

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch(COURSE_API, { headers: getHeaders() });
      const json = await res.json();
      if (json.success) setCourses(json.data);
    } catch (err) {
      toast.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.courseName.trim()) return toast.error("Course name is required") && false;
    if (!formData.duration.trim()) return toast.error("Duration is required") && false;
    if (!formData.fees || formData.fees < 0) return toast.error("Enter valid fees") && false;
    return true;
  };

  const addCourse = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await fetch(COURSE_API, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(formData),
      });
      const json = await res.json();

      if (json.success || res.status === 201) {
        toast.success(json.message || "Course Added");
        setFormData({ courseName: "", duration: "", fees: "", description: "" });
        fetchCourses();
      } else {
        toast.error(json.message || "Failed to add course");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Are you sure? Deleting a course might affect assigned students.")) return;

    try {
      const res = await fetch(`${COURSE_API}/${id}`, { method: "DELETE", headers: getHeaders() });
      const json = await res.json();
      if (json.success || res.status === 200) {
        toast.success("Course deleted successfully");
        fetchCourses();
      } else {
        toast.error(json.message || "Failed to delete");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  const openEditModal = (course) => {
    setEditingId(course.id);
    setFormData({
      courseName: course.courseName,
      duration: course.duration,
      fees: course.fees,
      description: course.description || "",
    });
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ courseName: "", duration: "", fees: "", description: "" });
  };

  const updateCourse = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await fetch(`${COURSE_API}/${editingId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(formData),
      });
      const json = await res.json();

      if (json.success || res.status === 200) {
        toast.success(json.message || "Updated Successfully");
        closeEditModal();
        fetchCourses();
      } else {
        toast.error(json.message || "Failed to update course");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  return (
    <div className="layout">
      <aside>
        <div className="form-card">
          <h2>Add New Course</h2>
          <form onSubmit={addCourse}>
            <div className="form-group">
              <label>Course Name</label>
              <input type="text" name="courseName" value={formData.courseName} onChange={handleChange} placeholder="B.Tech Computer Science" />
            </div>
            <div className="form-group">
              <label>Duration</label>
              <input type="text" name="duration" value={formData.duration} onChange={handleChange} placeholder="4 Years" />
            </div>
            <div className="form-group">
              <label>Fees ($)</label>
              <input type="number" name="fees" value={formData.fees} onChange={handleChange} placeholder="5000" />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Brief details..." />
            </div>
            <button type="submit" className="btn-primary">Add Course</button>
          </form>
        </div>
      </aside>

      <main>
        {loading ? (
          <div className="spinner-container"><div className="spinner"></div></div>
        ) : courses.length === 0 ? (
          <p className="no-data">No courses found. Create one!</p>
        ) : (
          <div className="student-grid">
            {courses.map((course) => (
              <div className="student-card" key={course.id}>
                <h3>{course.courseName}</h3>
                <p><Clock size={16} /> {course.duration}</p>
                <p><DollarSign size={16} /> ${course.fees}</p>
                <p style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>{course.description}</p>
                
                <div className="card-actions">
                  <button className="btn-secondary" onClick={() => openEditModal(course)}>
                    <Edit2 size={16} /> Edit
                  </button>
                  <button className="btn-danger" onClick={() => deleteCourse(course.id)}>
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Course</h2>
            <form onSubmit={updateCourse}>
              <div className="form-group">
                <label>Course Name</label>
                <input type="text" name="courseName" value={formData.courseName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input type="text" name="duration" value={formData.duration} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Fees ($)</label>
                <input type="number" name="fees" value={formData.fees} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input type="text" name="description" value={formData.description} onChange={handleChange} />
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
