import WidgetItem from '@/src/components/WidgetItem'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation';
import { WidgetItemDos } from '@/src/components/WidgetItemDos';



export default async function DashboardPage() {

    const session = await getServerSession(authOptions); 

    if(!session){
        redirect('/api/auth/signin')
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <WidgetItemDos title='Info del Usuario'>
                <div className='flex flex-col'>
                    <span>{session.user?.email}</span>
                    <span>{session.user?.name}</span>
                </div>
          </WidgetItemDos>
        </div>
    )
}
