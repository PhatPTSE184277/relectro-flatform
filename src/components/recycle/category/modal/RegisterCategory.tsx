'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { useCategoryContext } from '@/contexts/recycle/CategoryContext';

interface RegisterCategoryProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  companyId: string;
}

const RegisterCategory: React.FC<RegisterCategoryProps> = ({ open, onClose, onSuccess, companyId }) => {
  const { parentCategories, subcategories, loadingParents, loadingSubcategories, loadingRegister, fetchParentCategories, fetchSubcategories, registerCategories } = useCategoryContext();
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [expandedParentId, setExpandedParentId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchParentCategories();
    }
  }, [open, fetchParentCategories]);

  const handleClose = () => {
    setSelectedCategoryIds([]);
    setExpandedParentId(null);
    onClose();
  };

  const handleToggleExpand = async (parentId: string) => {
    if (expandedParentId === parentId) {
      setExpandedParentId(null);
    } else {
      setExpandedParentId(parentId);
      await fetchSubcategories(parentId);
    }
  };

  const handleToggleCategory = (categoryId: string) => {
    setSelectedCategoryIds(prev =>
      prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleConfirm = async () => {
    if (selectedCategoryIds.length === 0) return;
    try {
      await registerCategories({ companyId, categoryIds: selectedCategoryIds });
      onSuccess();
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' onClick={handleClose}></div>

      <div className='relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col'>
        <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100'>
          <h2 className='text-2xl font-bold text-gray-900'>Đăng ký danh mục</h2>
          <button onClick={handleClose} className='p-2 hover:bg-white/50 rounded-full transition-colors' disabled={loadingRegister}>
            <X size={24} className='text-gray-600' />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto p-6'>
          {loadingParents ? (
            <div className='flex items-center justify-center py-12'>
              <Loader2 size={32} className='animate-spin text-primary-600' />
            </div>
          ) : parentCategories.length === 0 ? (
            <div className='text-center py-12 text-gray-500'>Không có danh mục nào</div>
          ) : (
            <div className='space-y-3'>
              {parentCategories.map((parent) => {
                const isExpanded = expandedParentId === parent.id;
                const isParentSelected = selectedCategoryIds.includes(parent.id);
                return (
                  <div key={parent.id} className='border border-gray-200 rounded-lg overflow-hidden'>
                    <div className='flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 transition-colors'>
                      <input
                        type='checkbox'
                        checked={isParentSelected}
                        onChange={() => handleToggleCategory(parent.id)}
                        className='w-5 h-5 text-primary-600 rounded focus:ring-primary-500 cursor-pointer'
                      />
                      <span className='flex-1 font-medium text-gray-900'>{parent.name}</span>
                      <button
                        onClick={() => handleToggleExpand(parent.id)}
                        className='p-1 hover:bg-primary-100 rounded transition-colors text-primary-600'
                      >
                        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className='border-t border-gray-200 bg-white p-4'>
                        {loadingSubcategories ? (
                          <div className='flex items-center justify-center py-4'>
                            <Loader2 size={20} className='animate-spin text-primary-600' />
                          </div>
                        ) : subcategories.length === 0 ? (
                          <div className='text-sm text-gray-500 text-center py-4'>Không có danh mục con</div>
                        ) : (
                          <div className='space-y-2'>
                            {subcategories.map((sub) => {
                              const isSubSelected = selectedCategoryIds.includes(sub.id);
                              return (
                                <div key={sub.id} className='flex items-center gap-3 p-2 hover:bg-gray-50 rounded transition-colors'>
                                  <input
                                    type='checkbox'
                                    checked={isSubSelected}
                                    onChange={() => handleToggleCategory(sub.id)}
                                    className='w-4 h-4 text-primary-600 rounded focus:ring-primary-500 cursor-pointer ml-6'
                                  />
                                  <span className='text-sm text-gray-700'>{sub.name}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className='flex items-center justify-between p-6 border-t bg-gray-50'>
          <p className='text-sm text-gray-600'>Đã chọn: <span className='font-bold text-primary-600'>{selectedCategoryIds.length}</span> danh mục</p>
          <div className='flex gap-3'>
            <button
              onClick={handleClose}
              disabled={loadingRegister}
              className='px-6 py-2.5 rounded-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer'
            >
              Hủy
            </button>
            <button
              onClick={handleConfirm}
              disabled={loadingRegister || selectedCategoryIds.length === 0}
              className={`px-6 py-2.5 rounded-lg font-medium text-white shadow-md transition-all duration-200 flex items-center gap-2 ${
                loadingRegister || selectedCategoryIds.length === 0
                  ? 'bg-primary-300 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 cursor-pointer'
              }`}
            >
              {loadingRegister && <Loader2 size={18} className='animate-spin' />}
              {loadingRegister ? 'Đang xử lý...' : 'Xác nhận'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterCategory;
