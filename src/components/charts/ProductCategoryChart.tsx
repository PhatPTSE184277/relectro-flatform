import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ProductCategory } from '@/services/admin/DashboardService';

interface ProductCategoryChartProps {
  data: ProductCategory[];
}

const COLORS = [
  '#3b82f6', // blue-500
  '#10b981', // green-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#06b6d4', // cyan-500
];

const ProductCategoryChart: React.FC<ProductCategoryChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 transition-colors">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Sản phẩm theo danh mục</h3>
        <p className="text-sm text-gray-500">Thống kê số lượng sản phẩm theo từng danh mục</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="categoryName" 
            stroke="#6B7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            angle={-15}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#6B7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              color: 'black',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
          />
          <Bar 
            dataKey="count" 
            radius={[4, 4, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductCategoryChart;
