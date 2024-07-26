"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
interface Subject {
  id: number;
  name: string;
}

interface FormState {
  name: string;
  studentId: string;
}

const Subjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [form, setForm] = useState<FormState>({ name: '', studentId: '' });
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchSubjects(token);
    }
  }, []);

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

  const handleAddSubject = async () => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      await axios.post('http://localhost:5000/subjects', form, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      fetchSubjects(token);
    } catch (error) {
      console.error('Error adding subject:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold">Manage Subjects</h1>
      <input 
        type="text" 
        placeholder="Subject Name" 
        className="mt-2 p-2 border border-gray-300 rounded" 
        onChange={(e) => setForm({ ...form, name: e.target.value })} 
      />
      <input 
        type="text" 
        placeholder="Student ID" 
        className="mt-2 p-2 border border-gray-300 rounded" 
        onChange={(e) => setForm({ ...form, studentId: e.target.value })} 
      />
      <button onClick={handleAddSubject} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Add Subject</button>
      <ul className="mt-4">
        {subjects.map((subject) => (
          <li key={subject.id} className="border-b border-gray-300 py-2">{subject.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Subjects;
