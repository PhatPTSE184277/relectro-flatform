// Type for /api/product-query/config/company/{companyId} response
export interface CompanyConfigDetail {
	companyId: string;
	companyName: string;
	ratioPercent: number;
	smallPoints: Array<{
		smallPointId: number;
		name: string;
		lat: number;
		lng: number;
		radiusKm: number;
		maxRoadDistanceKm: number;
		active: boolean;
	}>;
}
// Types for /api/assign/company-config response
export interface SmallPoint {
	smallPointId: number;
	name: string;
	lat: number;
	lng: number;
	radiusKm: number;
	maxRoadDistanceKm: number;
	active: boolean;
}

export interface CompanyConfigItem {
	companyId: string;
	companyName: string;
	smallPoints: SmallPoint[];
}

export interface AssignCompanyConfigResponse {
	message: string;
	companies: CompanyConfigItem[];
}

// Types for POST /api/assign/company-config (ratioPercent, quota)
export interface SmallPointPost {
    smallPointId: number;
    radiusKm: number;
    maxRoadDistanceKm: number;
    active: boolean;
}

export interface CompanyConfigPostItem {
    companyId: string;
    ratioPercent: number;
    smallPoints: SmallPointPost[];
}

export interface AssignCompanyConfigPostRequest {
    companies: CompanyConfigPostItem[];
}

export interface AssignCompanyConfigPostResponse {
    companies: CompanyConfigPostItem[];
    quota?: number;
}
