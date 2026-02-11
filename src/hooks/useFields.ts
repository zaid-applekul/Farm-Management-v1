import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Field = Database['public']['Tables']['fields']['Row'] & {
  fertilizer_applications: Database['public']['Tables']['fertilizer_applications']['Row'][];
};

export function useFields() {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFields = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('fields')
        .select(`
          *,
          fertilizer_applications (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFields(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  const addField = async (fieldData: Database['public']['Tables']['fields']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('fields')
        .insert([fieldData])
        .select()
        .single();

      if (error) throw error;
      await fetchFields(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const updateField = async (id: string, updates: Database['public']['Tables']['fields']['Update']) => {
    try {
      const { data, error } = await supabase
        .from('fields')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchFields(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  return {
    fields,
    loading,
    error,
    addField,
    updateField,
    refetch: fetchFields,
  };
}