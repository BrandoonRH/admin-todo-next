import Sidebar from '@/src/components/ui/Sidebar';
import TopMenu from '@/src/components/ui/TopMenu';
import WidgetItem from '@/src/components/WidgetItem';

export default function DashboardLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Sidebar />

            <div className="ml-auto mb-6 lg:w-[75%] xl:w-[80%] 2xl:w-[85%] min-h-screen">
                <TopMenu />

                <div className="px-6 pt-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <WidgetItem />
                    </div>
                </div>
            </div>
        </>
    );
}