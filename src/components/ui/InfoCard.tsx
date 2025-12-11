import React from 'react';

interface InfoCardProps {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, label, value }) => (
    <div className="flex items-center bg-gray-50 rounded-lg border border-primary-100 px-3 py-2 gap-2 min-h-11">
        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-primary-100">{icon}</span>
        <span className="text-sm text-gray-600 font-medium mr-1">{label}:</span>
        <span className="text-gray-900 text-sm font-medium">{value}</span>
    </div>
);

export default InfoCard;
