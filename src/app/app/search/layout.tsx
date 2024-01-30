import SearchSection from '@/components/app/SearchSection';

export default async function AppSearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-10">
      <div className="flex justify-center">
        <SearchSection />
      </div>
      {children}
    </div>
  );
}
