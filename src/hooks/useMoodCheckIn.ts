import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { MoodType, MoodCheckIn } from '../types';

export const useMoodCheckIn = (userId: string) => {
  const [moodHistory, setMoodHistory] = useState<MoodCheckIn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock: Load mood history
    const loadMoodHistory = async () => {
      try {
        const snapshot = await db.collection('moodCheckIns').get();
        const moods = snapshot.docs
          .map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((mood: MoodCheckIn) => mood.userId === userId)
          .sort((a: MoodCheckIn, b: MoodCheckIn) => b.timestamp - a.timestamp) as MoodCheckIn[];
        setMoodHistory(moods);
        setLoading(false);
      } catch (error) {
        console.error('Error loading mood history:', error);
        setLoading(false);
      }
    };

    loadMoodHistory();
    // Refresh every 5 seconds
    const interval = setInterval(loadMoodHistory, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  const saveMoodCheckIn = async (mood: MoodType) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const moodCheckIn: Omit<MoodCheckIn, 'id'> = {
        userId,
        mood,
        date: today,
        timestamp: Date.now(),
      };
      await db.collection('moodCheckIns').add(moodCheckIn);
      return true;
    } catch (error) {
      console.error('Error saving mood check-in:', error);
      return false;
    }
  };

  return {
    moodHistory,
    loading,
    saveMoodCheckIn,
  };
};

