import { AssignRecyclingProvider } from '@/contexts/admin/AssignRecyclingContext';

export default function AssignRecyclingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <AssignRecyclingProvider>{children}</AssignRecyclingProvider>;
}
