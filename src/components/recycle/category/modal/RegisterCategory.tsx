'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Eye } from 'lucide-react';
import { useCategoryContext } from '@/contexts/recycle/CategoryContext';
import SubcategoryDetail from './SubcategoryDetail';

interface RegisterCategoryProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  companyId: string;
  currentCategoryIds?: string[];
}

const RegisterCategory: React.FC<RegisterCategoryProps> = ({
  open,
  onClose,
  onSuccess,
  companyId,
  currentCategoryIds = []
}) => {
  const {
    parentCategories,
    loadingParents,
    loadingRegister,
    fetchParentCategories,
    registerCategories,
    updateCategories
  } = useCategoryContext();

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [selectedParentForView, setSelectedParentForView] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (open) {
      fetchParentCategories();
      // Pre-populate with current categories if updating
      if (currentCategoryIds.length > 0) {
        setSelectedCategoryIds([...currentCategoryIds]);
      }
    } else {
      setSelectedCategoryIds([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, fetchParentCategories]);

  const handleClose = () => {
    setSelectedCategoryIds([]);
    setShowSubcategoryModal(false);
    setSelectedParentForView(null);
    onClose();
  };

  const handleToggleCategory = (categoryId: string) => {
    setSelectedCategoryIds(prev =>
      prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleViewSubcategories = (parent: { id: string; name: string }) => {
    setSelectedParentForView(parent);
    setShowSubcategoryModal(true);
  };

  const handleConfirm = async () => {
    if (selectedCategoryIds.length === 0) return;
    try {
      // Auto-detect: if company has existing categories, update; otherwise, register
      if (currentCategoryIds.length > 0) {
        await updateCategories({ companyId, categoryIds: selectedCategoryIds });
      } else {
        await registerCategories({ companyId, categoryIds: selectedCategoryIds });
      }
      onSuccess();
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
        <div className='absolute inset-0 bg-black/40 backdrop-blur-sm' onClick={() => !loadingRegister && handleClose()} />

        <div onClick={(e) => e.stopPropagation()} className='relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col'>
          <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100'>
          <h2 className='text-2xl font-bold text-gray-900'>{currentCategoryIds.length > 0 ? 'Cập nhật danh mục' : 'Đăng ký danh mục'}</h2>
            <button onClick={handleClose} className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer' aria-label='Đóng' disabled={loadingRegister}>
              &times;
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
              <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
                <div className='overflow-x-auto'>
                  <table className='min-w-full text-sm text-gray-800'>
                    <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                      <tr>
                        <th className='py-3 px-4 text-center w-[60px]'>
                          <input
                            type='checkbox'
                            checked={selectedCategoryIds.length === parentCategories.length}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCategoryIds(parentCategories.map(c => c.id));
                              } else {
                                setSelectedCategoryIds([]);
                              }
                            }}
                            className='w-4 h-4 cursor-pointer'
                          />
                        </th>
                        <th className='py-3 px-4 text-center w-[60px]'>STT</th>
                        <th className='py-3 px-4 text-left'>Tên danh mục</th>
                        <th className='py-3 px-4 text-center w-[100px]'>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parentCategories.map((parent, index) => {
                        const isSelected = selectedCategoryIds.includes(parent.id);
                        const rowBg = index % 2 === 0 ? 'bg-white' : 'bg-primary-50';
                        return (
                          <tr
                            key={parent.id}
                            className={`border-b border-primary-100 ${rowBg} transition-colors`}
                          >
                            <td className='py-3 px-4 text-center'>
                              <input
                                type='checkbox'
                                checked={isSelected}
                                onChange={() => handleToggleCategory(parent.id)}
                                className='w-4 h-4 cursor-pointer'
                              />
                            </td>
                            <td className='py-3 px-4 text-center'>
                              <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                                {index + 1}
                              </span>
                            </td>
                            <td className='py-3 px-4 font-medium text-gray-900'>
                              <div className='text-gray-900'>{parent.name}</div>
                            </td>
                            <td className='py-3 px-4 text-center'>
                              <button
                                onClick={() => handleViewSubcategories({ id: parent.id, name: parent.name })}
                                className='text-primary-600 hover:text-primary-800 inline-flex items-center gap-1 font-medium transition cursor-pointer'
                                title='Xem danh mục con'
                              >
                                <Eye size={16} />
                              </button>
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

          <div className='flex items-center justify-between p-6 border-t bg-gray-50'>
            <p className='text-sm text-gray-600'>
              Đã chọn: <span className='font-bold text-primary-600'>{selectedCategoryIds.length}</span> danh mục
            </p>
            <div className='flex gap-3'>
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

      {selectedParentForView && (
        <SubcategoryDetail
          open={showSubcategoryModal}
          onClose={() => {
            setShowSubcategoryModal(false);
            setSelectedParentForView(null);
          }}
          parentCategoryId={selectedParentForView.id}
          parentCategoryName={selectedParentForView.name}
        />
      )}
    </>
  );
};

export default RegisterCategory;