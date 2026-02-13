'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Tag } from 'lucide-react';
import { useCategoryContext } from '@/contexts/recycle/CategoryContext';
import { useAuth } from '@/hooks/useAuth';
import RegisterCategoryModal from '@/components/recycle/category/RegisterCategoryModal';
import SubcategoryDetailModal from '@/components/recycle/category/SubcategoryDetailModal';
import CategoryList from '@/components/recycle/category/CategoryList';
import Toast from '@/components/ui/Toast';
import { CompanyCategoryDetail } from '@/services/recycle/CategoryService';

const CategoryRegistrationPage: React.FC = () => {
  const { user } = useAuth();
  const { companyCategories, loadingCompanyCategories, fetchCompanyCategories } = useCategoryContext();
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCategoryForView, setSelectedCategoryForView] = useState<CompanyCategoryDetail | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const companyId = user?.collectionCompanyId || '';

  useEffect(() => {
    if (companyId) {
      fetchCompanyCategories(companyId);
    }
  }, [companyId, fetchCompanyCategories]);

  const handleSuccess = () => {
    setToast({ message: 'Đăng ký danh mục thành công!', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleViewDetail = (category: CompanyCategoryDetail) => {
    setSelectedCategoryForView(category);
    setShowDetailModal(true);
  };

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center border border-primary-200'>
            <Tag className='text-white' size={20} />
          </div>
          <h1 className='text-3xl font-bold text-gray-900'>Quản lý danh mục</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className='flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium shadow-md border border-primary-200 cursor-pointer'
        >
          <Plus size={20} />
          Đăng ký danh mục
        </button>
      </div>

      {/* Company info removed per request */}

      {/* Category List */}
      <CategoryList
        categories={companyCategories?.categoryDetails || []}
        loading={loadingCompanyCategories}
        onViewDetail={handleViewDetail}
      />

      {/* Register Modal */}
      <RegisterCategoryModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleSuccess}
        companyId={companyId}
      />

      {/* Subcategory Detail Modal */}
      {selectedCategoryForView && (
        <SubcategoryDetailModal
          open={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedCategoryForView(null);
          }}
          parentCategoryId={selectedCategoryForView.categoryId}
          parentCategoryName={selectedCategoryForView.name}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          open={!!toast}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default CategoryRegistrationPage;
