import LoginDescription from '@/components/modules/auth/login/login-description'
import LoginForm from '@/components/modules/auth/login/login-form'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import nextLogo from '../../../../public/globe.svg'

export const metadata: Metadata = {
  title: 'Masuk | Admin Panel'
}

export default async function LoginPage() {
  const session = await getServerSession()
  if (session) redirect('/')

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-background">
      {/* Background Pattern */}
      <div className="bg-grid-slate-200/50 dark:bg-grid-slate-800/50 absolute inset-0 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/90 to-background/50" />

      {/* Blur Elements */}
      <div className="absolute -left-40 top-0 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
      <div className="absolute right-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-secondary/30 blur-3xl" />

      {/* Main Content */}
      <div className="relative flex w-full items-center justify-center lg:w-1/2">
        <div className="w-full max-w-lg px-8 py-12">
          <div className="mb-12">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Image src={nextLogo} alt="Logo" width={24} height={24} className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-semibold">Admin Panel</h1>
            </div>
            <p className="text-muted-foreground">Selamat datang kembali! Silakan masuk untuk melanjutkan.</p>
          </div>

          <LoginForm />
        </div>
      </div>

      {/* Right Side - Description/Features */}
      <div className="relative hidden w-1/2 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent lg:block">
        <div className="absolute inset-0 backdrop-blur-[2px]" />
        <div className="relative flex h-full items-center justify-center p-12">
          <LoginDescription />
        </div>
      </div>
    </div>
  )
}
