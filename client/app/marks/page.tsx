"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface Mark {
  id: number;
  score: number;
  studentId: number;
  subjectId: number;
}

interface FormState {
  score: string;
  studentId: string;
  subjectId: string;
}

const Marks = () => {
  const [marks, setMarks] = useState<Mark[]>([]);
  const [form, setForm] = useState<FormState>({ score: '', studentId: '', subjectId: '' });
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchMarks(token);
    }
  }, []);

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

  const handleAddMark = async () => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      await axios.post('http://localhost:5000/marks', {
        score: parseInt(form.score),
        studentId: parseInt(form.studentId),
        subjectId: parseInt(form.subjectId),
      }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      fetchMarks(token);
    } catch (error) {
      console.error('Error adding mark:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold">Manage Marks</h1>
      <input 
        type="text" 
        placeholder="Score" 
        className="mt-2 p-2 border border-gray-300 rounded" 
        onChange={(e) => setForm({ ...form, score: e.target.value })} 
      />
      <input 
        type="text" 
        placeholder="Student ID" 
        className="mt-2 p-2 border border-gray-300 rounded" 
        onChange={(e) => setForm({ ...form, studentId: e.target.value })} 
      />
      <input 
        type="text" 
        placeholder="Subject ID" 
        className="mt-2 p-2 border border-gray-300 rounded" 
        onChange={(e) => setForm({ ...form, subjectId: e.target.value })} 
      />
      <button onClick={handleAddMark} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Add Mark</button>
      <ul className="mt-4">
        {marks.map((mark) => (
          <li key={mark.id} className="border-b border-gray-300 py-2">
            {`Score: ${mark.score}, Student ID: ${mark.studentId}, Subject ID: ${mark.subjectId}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Marks;
