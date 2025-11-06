import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Premium Users', value: 2318, color: '#3b82f6' },
  { name: 'Free Users', value: 1256, color: '#1f2937' },
  { name: 'Trial Users', value: 456, color: '#6b7280' },
  { name: 'Inactive', value: 234, color: '#d1d5db' },
];

const UserDistributionChart: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 transition-colors">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Phân bố người dùng</h3>
        <p className="text-sm text-gray-500">Tỉ lệ các loại người dùng</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              color: 'black',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{ color: '#374151' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserDistributionChart;