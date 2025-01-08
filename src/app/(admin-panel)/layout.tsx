import AdminPanelLayout from '@/components/admin-panel-layout'
import { SessionAdminExpiredDialog } from '@/components/session-admin-expired-dialog'
import { NextAuthProvider } from '@/providers/next-auth-provider'
import ReactQueryProvider from '@/providers/react-query-provider'
import { ViewTransitions } from 'next-view-transitions'

export default function RootAdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthProvider>
      <ViewTransitions>
        <ReactQueryProvider>
          <SessionAdminExpiredDialog />
          <AdminPanelLayout>{children}</AdminPanelLayout>
        </ReactQueryProvider>
      </ViewTransitions>
    </NextAuthProvider>
  )
}
