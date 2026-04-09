import React from 'react';
import SmallPointConfigList from './SmallPointConfigList';

interface CompanyDetailConfigProps {
    company: any;
    onUpdateRadius: (companyId: number, smallPointId: number, radiusKm: number) => void;
    onUpdateMaxDistance: (companyId: number, smallPointId: number, maxRoadDistanceKm: number) => void;
}

const CompanyDetailConfig: React.FC<CompanyDetailConfigProps> = ({
    company,
    onUpdateRadius,
    onUpdateMaxDistance
}) => {
    return (
        <>
            {/* Header handled by parent modal; avoid duplicate title/company name here */}
            <SmallPointConfigList
                company={company}
                onUpdateRadius={onUpdateRadius}
                onUpdateMaxDistance={onUpdateMaxDistance}
            />
        </>
    );
};

export default CompanyDetailConfig;
