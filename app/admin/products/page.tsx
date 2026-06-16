import { client } from '@/sanity/lib/client';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import DeleteButton from './DeleteButton';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await client.fetch(`*[_type == "product"] | order(createdAt desc) {
    _id,
    name,
    category,
    dimensions,
    createdAt,
    "imageUrl": images[0].asset->url
  }`);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold text-stone-900">Manage Products</h2>
        <Link
          href="/admin/products/new"
          className="hidden md:flex items-center space-x-2 bg-stone-900 text-white px-4 py-2 hover:bg-stone-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-sans uppercase tracking-widest font-bold">Add Product</span>
        </Link>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white border border-[#E0DDD8] overflow-hidden">
        <table className="min-w-full divide-y divide-[#E0DDD8]">
          <thead className="bg-stone-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Dimensions</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#E0DDD8]">
            {products.map((product: any) => (
              <tr key={product._id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="h-10 w-10 object-cover border border-[#E0DDD8]" />
                  ) : (
                    <div className="h-10 w-10 bg-stone-100 border border-[#E0DDD8] flex items-center justify-center text-xs text-stone-400">No Img</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 capitalize">
                  {product.category.replace(/-/g, ' ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                  {new Date(product.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">
                  {product.dimensions || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end items-center space-x-2">
                    <Link
                      href={`/admin/products/edit/${product._id}`}
                      className="text-stone-500 hover:text-stone-700 p-2"
                      title="Edit Product"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                    </Link>
                    <DeleteButton id={product._id} />
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-stone-500 text-sm">
                  No products found. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {products.map((product: any) => (
          <div key={product._id} className="bg-white border border-[#E0DDD8] rounded-xl overflow-hidden shadow-sm">
            <div className="divide-y divide-[#E0DDD8]">
              <div className="flex justify-between items-center p-4">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Image</span>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="h-12 w-12 object-cover rounded shadow-sm border border-[#E0DDD8]" />
                ) : (
                  <div className="h-12 w-12 bg-stone-100 rounded border border-[#E0DDD8] flex items-center justify-center text-[10px] text-stone-400">No Img</div>
                )}
              </div>
              <div className="flex justify-between items-center p-4">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Name</span>
                <span className="text-sm font-medium text-[#8c6b4e]">{product.name}</span>
              </div>
              <div className="flex justify-between items-center p-4">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Category</span>
                <span className="px-3 py-1 bg-stone-100 text-stone-800 text-xs rounded-md border border-stone-200 capitalize">{product.category.replace(/-/g, ' ')}</span>
              </div>
              <div className="flex justify-between items-center p-4">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Dimensions</span>
                <span className="text-sm text-stone-900 font-medium">{product.dimensions || '-'}</span>
              </div>
              <div className="flex justify-between items-center p-4">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Actions</span>
                <div className="flex space-x-2">
                  <Link
                    href={`/admin/products/edit/${product._id}`}
                    className="px-4 py-1.5 text-sm border border-[#c4a991] text-[#9a7b5e] rounded hover:bg-stone-50 transition-colors bg-white"
                  >
                    Edit
                  </Link>
                  <DeleteButton id={product._id} isMobile />
                </div>
              </div>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="bg-white border border-[#E0DDD8] rounded-xl p-8 text-center text-stone-500 text-sm">
            No products found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
