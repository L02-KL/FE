import { Doctor, Appointment } from '../types';

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Mia Miller',
    specialization: 'Neurologist',
    rating: 5.0,
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    name: 'Dr. Norah Still',
    specialization: 'Cardiologist',
    rating: 4.9,
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    name: 'Dr. Helena Fox',
    specialization: 'Radiologist',
    rating: 4.8,
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: '4',
    name: 'Dr. Andrew Miller',
    specialization: 'Neurologist',
    rating: 5.0,
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    doctorId: '1',
    doctorName: 'Mrs. Hanh',
    patientId: 'user1',
    patientName: 'Candy',
    date: 'Dec 19, 2023',
    time: '06:00 PM',
    type: 'video-call',
    location: "Dr. Hanh's office",
    status: 'confirmed',
  },
];

