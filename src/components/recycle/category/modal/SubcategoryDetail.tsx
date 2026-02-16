'use client';

import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useCategoryContext } from '@/contexts/recycle/CategoryContext';

interface SubcategoryDetailProps {
  open: boolean;
  onClose: () => void;
  parentCategoryId: string;
  parentCategoryName: string;
}

const SubcategoryDetail: React.FC<SubcategoryDetailProps> = ({
  open,
  onClose,
  parentCategoryId,
  parentCategoryName
}) => {
  const { subcategories, loadingSubcategories, fetchSubcategories } = useCategoryContext();

  useEffect(() => {
    if (open && parentCategoryId) {
      fetchSubcategories(parentCategoryId);
    }
  }, [open, parentCategoryId, fetchSubcategories]);

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' />

      <div className='relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[80vh] flex flex-col'>
        <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100'>
          <div>
            <h2 className='text-2xl font-bold text-gray-900'>Danh mục con</h2>
            <p className='text-sm text-gray-600 mt-1'>Danh mục cha: {parentCategoryName}</p>
          </div>
          <button onClick={onClose} className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer' aria-label='Đóng'>
            &times;
          </button>
        </div>

        <div className='flex-1 overflow-y-auto p-6'>
          {loadingSubcategories ? (
            <div className='flex items-center justify-center py-12'>
              <Loader2 size={32} className='animate-spin text-primary-600' />
            </div>
          ) : subcategories.length === 0 ? (
            <div className='text-center py-12 text-gray-500'>Không có danh mục con nào</div>
          ) : (
            <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
              <div className='overflow-x-auto'>
                <table className='min-w-full text-sm text-gray-800'>
                  <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                    <tr>
                      <th className='py-3 px-4 text-center w-[60px]'>STT</th>
                      <th className='py-3 px-4 text-left'>Tên danh mục con</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subcategories.map((sub, index) => {
                      const rowBg = index % 2 === 0 ? 'bg-white' : 'bg-primary-50';
                      const isLast = index === subcategories.length - 1;
                      return (
                        <tr
                          key={sub.id}
                          className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg} transition-colors`}
                        >
                          <td className='py-3 px-4 text-center'>
                            <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                              {index + 1}
                            </span>
                          </td>
                          <td className='py-3 px-4 font-medium text-gray-900'>
                            <div className='text-gray-900'>{sub.name}</div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubcategoryDetail;
