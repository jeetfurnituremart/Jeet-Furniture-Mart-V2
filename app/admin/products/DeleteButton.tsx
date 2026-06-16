'use client';

import { useState, useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DeleteButton({ id, isMobile }: { id: string, isMobile?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        let errorMsg = 'Failed to delete';
        try {
          const data = await res.json();
          if (data.error) errorMsg = data.error;
        } catch (e) {}
        throw new Error(errorMsg);
      }
      startTransition(() => {
        router.refresh();
      });
    } catch (error: any) {
      console.error('Delete error:', error);
      alert(`Error deleting product: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading || isPending}
      className={
        isMobile
          ? "px-4 py-1.5 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
          : "text-red-500 hover:text-red-700 disabled:opacity-50 p-2"
      }
      title="Delete Product"
    >
      {isMobile ? ((loading || isPending) ? '...' : 'Delete') : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
