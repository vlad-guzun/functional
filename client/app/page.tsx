'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

interface Student {
  id: number;
  name: string;
}

interface Subject {
  id: number;
  name: string;
  students: { student: Student }[];
}

interface Mark {
  id: number;
  score: number;
  studentId: number;
  subjectId: number;
}

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [showEditSubjectModal, setShowEditSubjectModal] = useState(false);
  const [showDeleteStudentModal, setShowDeleteStudentModal] = useState(false);
  const [showDeleteSubjectModal, setShowDeleteSubjectModal] = useState(false);
  const [showDeleteMarkModal, setShowDeleteMarkModal] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [name, setName] = useState<string>('');
  const [subjectForm, setSubjectForm] = useState<{ name: string; studentIds: number[] }>({ name: '', studentIds: [] });
  const [editStudentForm, setEditStudentForm] = useState<{ id: number; name: string }>({ id: 0, name: '' });
  const [editSubjectForm, setEditSubjectForm] = useState<{ id: number; name: string; studentIds: number[] }>({ id: 0, name: '', studentIds: [] });
  const [markForm, setMarkForm] = useState<{ score: string; studentId: string; subjectId: string }>({ score: '', studentId: '', subjectId: '' });
  const [form, setForm] = useState<{ email: string; password: string }>({ email: '', password: '' });
  const [isRegister, setIsRegister] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{ type: string, id: number } | null>(null);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      setIsAuthenticated(true);
      setShowLoginModal(false);
      fetchStudents(token);
      fetchSubjects(token);
      fetchMarks(token);
    } else {
      setIsAuthenticated(false);
      setShowLoginModal(true);
    }
  }, []);

  const fetchStudents = async (token: string) => {
    try {
      const response = await axios.get<Student[]>('http://localhost:5000/students', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchSubjects = async (token: string) => {
    try {
      const response = await axios.get<Subject[]>('http://localhost:5000/subjects', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchMarks = async (token: string) => {
    try {
      const response = await axios.get<Mark[]>('http://localhost:5000/marks', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setMarks(response.data);
    } catch (error) {
      console.error('Error fetching marks:', error);
    }
  };

  const handleAddStudent = async () => {
    const token = Cookies.get('token');
    if (!token) return;
    try {
      await axios.post('http://localhost:5000/students', { name }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      fetchStudents(token);
      setShowStudentModal(false);
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const handleAddSubject = async () => {
    const token = Cookies.get('token');
    if (!token) return;
    try {
      await axios.post('http://localhost:5000/subjects', subjectForm, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      fetchSubjects(token);
      setShowSubjectModal(false);
    } catch (error) {
      console.error('Error adding subject:', error);
    }
  };

  const handleAddMark = async () => {
    const token = Cookies.get('token');
    if (!token) return;
    try {
      await axios.post('http://localhost:5000/marks', markForm, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      fetchMarks(token);
      setShowMarkModal(false);
    } catch (error) {
      console.error('Error adding mark:', error);
    }
  };

  const handleUpdateMark = async () => {
    const token = Cookies.get('token');
    if (!token) return;
    try {
      await axios.put('http://localhost:5000/marks', markForm, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      fetchMarks(token);
      setShowMarkModal(false);
    } catch (error) {
      console.error('Error updating mark:', error);
    }
  };

  const handleEditStudent = async () => {
    const token = Cookies.get('token');
    if (!token) return;
    try {
      await axios.put(`http://localhost:5000/students/${editStudentForm.id}`, { name: editStudentForm.name }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      fetchStudents(token);
      setShowEditStudentModal(false);
    } catch (error) {
      console.error('Error editing student:', error);
    }
  };

  const handleEditSubject = async () => {
    const token = Cookies.get('token');
    if (!token) return;
    try {
      await axios.put(`http://localhost:5000/subjects/${editSubjectForm.id}`, { name: editSubjectForm.name, studentIds: editSubjectForm.studentIds }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      fetchSubjects(token);
      setShowEditSubjectModal(false);
    } catch (error) {
      console.error('Error editing subject:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', { email: form.email, password: form.password }, { withCredentials: true });
      Cookies.set('token', response.data.token, { expires: 1 });
      setIsAuthenticated(true);
      setShowLoginModal(false);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5000/register', { email: form.email, password: form.password });
      handleLogin();
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    setIsAuthenticated(false);
    setShowLoginModal(true);
  };

  const handleDelete = async () => {
    const token = Cookies.get('token');
    if (!token || !deleteItem) return;

    try {
      if (deleteItem.type === 'student') {
        await axios.delete(`http://localhost:5000/students/${deleteItem.id}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        // Update state after deleting student
        setStudents((prev) => prev.filter((student) => student.id !== deleteItem.id));
        setSubjects((prev) =>
          prev.map((subject) => ({
            ...subject,
            students: subject.students.filter(({ student }) => student.id !== deleteItem.id),
          }))
        );
        setMarks((prev) => prev.filter((mark) => mark.studentId !== deleteItem.id));
      } else if (deleteItem.type === 'subject') {
        await axios.delete(`http://localhost:5000/subjects/${deleteItem.id}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setSubjects((prev) => prev.filter((subject) => subject.id !== deleteItem.id));
        setMarks((prev) => prev.filter((mark) => mark.subjectId !== deleteItem.id));
      } else if (deleteItem.type === 'mark') {
        await axios.delete(`http://localhost:5000/marks/${deleteItem.id}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setMarks((prev) => prev.filter((mark) => mark.id !== deleteItem.id));
      }

      setDeleteItem(null);
      setShowDeleteStudentModal(false);
      setShowDeleteSubjectModal(false);
      setShowDeleteMarkModal(false);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-2xl font-bold mb-4">{isRegister ? 'Register' : 'Login'}</h2>
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-2 p-2 border border-gray-300 rounded text-black"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-2 p-2 border border-gray-300 rounded text-black"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <div className="flex justify-between mt-4">
              <button onClick={isRegister ? handleRegister : handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">
                {isRegister ? 'Register' : 'Login'}
              </button>
              <button onClick={() => setIsRegister(!isRegister)} className="text-blue-500">
                {isRegister ? 'Go to Login' : 'Go to Register'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isAuthenticated && (
        <>
          <button onClick={handleLogout} className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded">Logout</button>
          <h1 className="text-4xl font-bold mb-4">Teacher Dashboard</h1>
          <div className="flex space-x-4 mb-8">
            <button onClick={() => setShowStudentModal(true)} className="bg-green-500 text-black px-4 py-2 rounded">Add Student</button>
            <button onClick={() => setShowSubjectModal(true)} className="bg-green-500 text-black px-4 py-2 rounded">Add Subject</button>
            <button onClick={() => setShowMarkModal(true)} className="bg-green-500 text-black px-4 py-2 rounded">Add Mark</button>
          </div>

          {showStudentModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 text-black">
              <div className="bg-white p-6 rounded shadow-lg w-80">
                <h2 className="text-2xl font-bold mb-4">Add Student</h2>
                <input
                  type="text"
                  placeholder="Student Name"
                  className="w-full mb-2 p-2 border border-gray-300 rounded text-black"
                  onChange={(e) => setName(e.target.value)}
                />
                <button onClick={handleAddStudent} className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
                <button onClick={() => setShowStudentModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded ml-2">Cancel</button>
              </div>
            </div>
          )}

          {showSubjectModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg w-80">
                <h2 className="text-2xl font-bold mb-4">Add Subject</h2>
                <input
                  type="text"
                  placeholder="Subject Name"
                  className="w-full mb-2 p-2 border border-gray-300 rounded text-black"
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                />
                <div className="mb-4">
                  <label className="block mb-2">Assign Students</label>
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={subjectForm.studentIds.includes(student.id)}
                        onChange={() => {
                          setSubjectForm({
                            ...subjectForm,
                            studentIds: subjectForm.studentIds.includes(student.id)
                              ? subjectForm.studentIds.filter((id) => id !== student.id)
                              : [...subjectForm.studentIds, student.id],
                          });
                        }}
                        className="mr-2"
                      />
                      {student.name}
                    </div>
                  ))}
                </div>
                <button onClick={handleAddSubject} className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
                <button onClick={() => setShowSubjectModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded ml-2">Cancel</button>
              </div>
            </div>
          )}

          {showMarkModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg w-80">
                <h2 className="text-2xl font-bold mb-4">Add Mark</h2>
                <input
                  type="number"
                  placeholder="Score"
                  className="w-full mb-2 p-2 border border-gray-300 rounded text-black"
                  value={markForm.score}
                  onChange={(e) => setMarkForm({ ...markForm, score: e.target.value })}
                />
                <select
                  className="w-full mb-2 p-2 border border-gray-300 rounded text-black"
                  value={markForm.studentId}
                  onChange={(e) => setMarkForm({ ...markForm, studentId: e.target.value })}
                >
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>{student.name}</option>
                  ))}
                </select>
                <select
                  className="w-full mb-2 p-2 border border-gray-300 rounded text-black"
                  value={markForm.subjectId}
                  onChange={(e) => setMarkForm({ ...markForm, subjectId: e.target.value })}
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
                <button onClick={handleAddMark} className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
                <button onClick={() => setShowMarkModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded ml-2">Cancel</button>
              </div>
            </div>
          )}

          {showEditStudentModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 text-black">
              <div className="bg-white p-6 rounded shadow-lg w-80">
                <h2 className="text-2xl font-bold mb-4">Edit Student</h2>
                <input
                  type="text"
                  placeholder="Student Name"
                  className="w-full mb-2 p-2 border border-gray-300 rounded text-black"
                  value={editStudentForm.name}
                  onChange={(e) => setEditStudentForm({ ...editStudentForm, name: e.target.value })}
                />
                <button onClick={handleEditStudent} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                <button onClick={() => setShowEditStudentModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded ml-2">Cancel</button>
              </div>
            </div>
          )}

          {showEditSubjectModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 text-black">
              <div className="bg-white p-6 rounded shadow-lg w-80">
                <h2 className="text-2xl font-bold mb-4">Edit Subject</h2>
                <input
                  type="text"
                  placeholder="Subject Name"
                  className="w-full mb-2 p-2 border border-gray-300 rounded text-black"
                  value={editSubjectForm.name}
                  onChange={(e) => setEditSubjectForm({ ...editSubjectForm, name: e.target.value })}
                />
                <div className="mb-4">
                  <label className="block mb-2">Assign Students</label>
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={editSubjectForm.studentIds.includes(student.id)}
                        onChange={() => {
                          setEditSubjectForm({
                            ...editSubjectForm,
                            studentIds: editSubjectForm.studentIds.includes(student.id)
                              ? editSubjectForm.studentIds.filter((id) => id !== student.id)
                              : [...editSubjectForm.studentIds, student.id],
                          });
                        }}
                        className="mr-2"
                      />
                      {student.name}
                    </div>
                  ))}
                </div>
                <button onClick={handleEditSubject} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                <button onClick={() => setShowEditSubjectModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded ml-2">Cancel</button>
              </div>
            </div>
          )}

          {showDeleteStudentModal && deleteItem?.type === 'student' && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg w-80">
                <h2 className="text-2xl font-bold mb-4">Delete Student</h2>
                <p>Are you sure you want to delete this student?</p>
                <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded mt-4">Delete</button>
                <button onClick={() => setShowDeleteStudentModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-2">Cancel</button>
              </div>
            </div>
          )}

          {showDeleteSubjectModal && deleteItem?.type === 'subject' && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg w-80">
                <h2 className="text-2xl font-bold mb-4">Delete Subject</h2>
                <p>Are you sure you want to delete this subject?</p>
                <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded mt-4">Delete</button>
                <button onClick={() => setShowDeleteSubjectModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-2">Cancel</button>
              </div>
            </div>
          )}

          {showDeleteMarkModal && deleteItem?.type === 'mark' && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg w-80">
                <h2 className="text-2xl font-bold mb-4">Delete Mark</h2>
                <p>Are you sure you want to delete this mark?</p>
                <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded mt-4">Delete</button>
                <button onClick={() => setShowDeleteMarkModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-2">Cancel</button>
              </div>
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Students</h2>
            <ul className="space-y-2">
              {students.map((student) => (
                <li key={student.id} className="border p-2 rounded">
                  {student.name}
                  <button
                    onClick={() => {
                      setEditStudentForm({ id: student.id, name: student.name });
                      setShowEditStudentModal(true);
                    }}
                    className="ml-4 bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setDeleteItem({ type: 'student', id: student.id });
                      setShowDeleteStudentModal(true);
                    }}
                    className="ml-4 bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Subjects</h2>
            {subjects.map((subject) => (
              <div key={subject.id} className="mb-8">
                <h2 className="text-xl font-bold mb-4">{subject.name}</h2>
                <ul className="space-y-2">
                  {subject.students.map(({ student }) => (
                    <li key={student.id} className="border p-2 rounded">
                      {student.name}
                      <button
                        onClick={() => {
                          setDeleteItem({ type: 'student', id: student.id });
                          setShowDeleteStudentModal(true);
                        }}
                        className="ml-4 bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    setEditSubjectForm({ id: subject.id, name: subject.name, studentIds: subject.students.map(({ student }) => student.id) });
                    setShowEditSubjectModal(true);
                  }}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setDeleteItem({ type: 'subject', id: subject.id });
                    setShowDeleteSubjectModal(true);
                  }}
                  className="ml-4 bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Marks</h2>
            {subjects.map((subject) => (
              <div key={subject.id} className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-center">{subject.name}</h2>
                <table className="min-w-full bg-slate-600 rounded-lg p-3">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Student Name</th>
                      <th className="py-2 px-4 border-b">Mark</th>
                      <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marks
                      .filter((mark) => mark.subjectId === subject.id)
                      .map((mark) => {
                        const student = students.find((s) => s.id === mark.studentId);
                        return (
                          <tr key={mark.id}>
                            <td className="py-2 px-4 border-b">{student ? student.name : 'Unknown Student'}</td>
                            <td className="py-2 px-4 border-b">{mark.score}</td>
                            <td className="py-2 px-4 border-b">
                              <button
                                onClick={() => {
                                  setDeleteItem({ type: 'mark', id: mark.id });
                                  setShowDeleteMarkModal(true);
                                }}
                                className="ml-4 bg-red-500 text-white px-2 py-1 rounded"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
