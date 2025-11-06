import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', users: 400, premium: 240 },
  { name: 'Feb', users: 300, premium: 139 },
  { name: 'Mar', users: 200, premium: 980 },
  { name: 'Apr', users: 278, premium: 390 },
  { name: 'May', users: 189, premium: 480 },
  { name: 'Jun', users: 239, premium: 380 },
  { name: 'Jul', users: 349, premium: 430 },
];

interface LineChartProps {
    tab: string;
    year: string;
}

const UserGrowthChart: React.FC<LineChartProps> = ({ tab, year }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 transition-colors">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Tăng trưởng người dùng</h3>
        <p className="text-sm text-gray-500">Số lượng người dùng mới theo tháng</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            stroke="#6B7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
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
          />
          <Line 
            type="monotone" 
            dataKey="users" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="premium" 
            stroke="#1f2937"
            strokeWidth={3}
            dot={{ fill: '#1f2937', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#1f2937', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserGrowthChart;