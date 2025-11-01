import React, { useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function TestSupabase() {
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('test_table').select('*');
      if (error) console.error('Error:', error);
      else console.log('Data:', data);
    };
    fetchData();
  }, []);

  return <div>Check console for Supabase connection test</div>;
}
