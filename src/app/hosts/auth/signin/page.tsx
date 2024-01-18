import HostSignInForm from '@/components/hosts/HostSignInForm';

export default function HostSignInPage() {
  return (
    <div className="py-4 space-y-12">
      <p className="text-3xl font-bold text-center mt-8">Host Portal</p>
      <HostSignInForm />
    </div>
  );
}
