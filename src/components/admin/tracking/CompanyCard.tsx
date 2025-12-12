import React from 'react';
import { Building2, MapPin, Phone, Mail } from 'lucide-react';

interface CompanyCardProps {
    company: any;
    isSelected: boolean;
    onClick: () => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, isSelected, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                isSelected
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50/50'
            }`}
        >
            <div className='flex items-start gap-3'>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-primary-500' : 'bg-primary-100'
                }`}>
                    <Building2 size={20} className={isSelected ? 'text-white' : 'text-primary-600'} />
                </div>
                <div className='flex-1'>
                    <h3 className='font-semibold text-gray-900 mb-1'>
                        {company.name || company.companyName || 'N/A'}
                    </h3>
                    <div className='space-y-1'>
                        {company.city && (
                            <p className='text-xs text-gray-500 flex items-center gap-1'>
                                <MapPin size={12} />
                                {company.city}
                            </p>
                        )}
                        {company.phone && (
                            <p className='text-xs text-gray-500 flex items-center gap-1'>
                                <Phone size={12} />
                                {company.phone}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyCard;
