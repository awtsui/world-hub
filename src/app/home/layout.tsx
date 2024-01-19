import LandingNavbar from '@/components/home/LandingNavbar';

export default async function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LandingNavbar />
      <div className="h-screen">{children}</div>
    </>
  );
}
