"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
interface Student {
  id: number;
  name: string;
}

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [name, setName] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchStudents(token);
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

  const handleAddStudent = async () => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      await axios.post('http://localhost:5000/students', { name }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      fetchStudents(token);
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold">Manage Students</h1>
      <input 
        type="text" 
        placeholder="Student Name" 
        value={name} 
        className="mt-2 p-2 border border-gray-300 rounded" 
        onChange={(e) => setName(e.target.value)} 
      />
      <button onClick={handleAddStudent} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Add Student</button>
      <ul className="mt-4">
        {students.map((student) => (
          <li key={student.id} className="border-b border-gray-300 py-2">{student.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Students;
