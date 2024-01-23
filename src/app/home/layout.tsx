import LandingNavbar from '@/components/home/LandingNavbar';
import { Toaster } from '@/components/ui/toaster';

export default async function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LandingNavbar />
      <div className="h-screen">{children}</div>
      <Toaster />
    </>
  );
}
