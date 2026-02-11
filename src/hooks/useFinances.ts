import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type FinancialEntry = Database['public']['Tables']['financial_entries']['Row'];

export function useFinances() {
  const [finances, setFinances] = useState<FinancialEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFinances = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('financial_entries')
        .select('*')
        .order('entry_date', { ascending: false });

      if (error) throw error;
      setFinances(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinances();
  }, []);

  const addFinancialEntry = async (entryData: Database['public']['Tables']['financial_entries']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('financial_entries')
        .insert([entryData])
        .select()
        .single();

      if (error) throw error;
      await fetchFinances(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  return {
    finances,
    loading,
    error,
    addFinancialEntry,
    refetch: fetchFinances,
  };
}