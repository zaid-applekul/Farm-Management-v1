import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Tree = Database['public']['Tables']['trees']['Row'] & {
  field?: Database['public']['Tables']['fields']['Row'];
};

export function useTrees() {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrees = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('trees')
        .select(`
          *,
          field:fields (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrees(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrees();
  }, []);

  const addTree = async (treeData: Database['public']['Tables']['trees']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('trees')
        .insert([treeData])
        .select()
        .single();

      if (error) throw error;
      await fetchTrees(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const updateTree = async (id: string, updates: Database['public']['Tables']['trees']['Update']) => {
    try {
      const { data, error } = await supabase
        .from('trees')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchTrees(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  return {
    trees,
    loading,
    error,
    addTree,
    updateTree,
    refetch: fetchTrees,
  };
}