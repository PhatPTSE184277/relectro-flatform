import React from 'react';
import { IoFilterOutline } from 'react-icons/io5';
import SearchableSelect from '@/components/ui/SearchableSelect';

interface OptionItem { value: string; label: string }

interface SystemConfigFilterProps {
  groupNames: OptionItem[];
  groupName: string;
  onFilterChange: (groupName: string) => void;
  scpOptions?: OptionItem[];
  selectedScpName?: string;
  onScpChange?: (value: string) => void;
  companyOptions?: OptionItem[];
  selectedCompanyName?: string;
  onCompanyChange?: (value: string) => void;
}

const SystemConfigFilter: React.FC<SystemConfigFilterProps> = ({
  groupNames,
  groupName,
  onFilterChange,
  scpOptions,
  selectedScpName,
  onScpChange,
  companyOptions,
  selectedCompanyName,
  onCompanyChange
}) => {
  return (
    <div className='bg-white rounded-2xl shadow border border-gray-100 px-3 py-3 mb-6'>
      <div className='flex items-center justify-between gap-4'>
        <div className='flex items-center gap-2 flex-wrap min-h-9'>
          <span className='flex items-center justify-center w-7 h-7 rounded-full bg-primary-100 border border-primary-200'>
            <IoFilterOutline className='text-primary-600' size={16} />
          </span>
          {groupNames.map((g) => (
            <button
              key={g.value}
              onClick={() => onFilterChange(g.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[90px] ${
                groupName === g.value ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        <div className='flex items-center gap-3'>
          {scpOptions && onScpChange && (
            <div className='w-64'>
              <SearchableSelect
                options={scpOptions}
                value={selectedScpName}
                onChange={(v) => onScpChange(String(v))}
                getLabel={(o: any) => o.label}
                getValue={(o: any) => o.value}
                placeholder='Chọn kho...'
              />
            </div>
          )}

          {companyOptions && onCompanyChange && (
            <div className='w-64'>
              <SearchableSelect
                options={companyOptions}
                value={selectedCompanyName}
                onChange={(v) => onCompanyChange(String(v))}
                getLabel={(o: any) => o.label}
                getValue={(o: any) => o.value}
                placeholder='Chọn công ty...'
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemConfigFilter;
