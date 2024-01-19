import SignInForm from '@/components/SignInForm';

export default function AdminSignInPage() {
  return (
    <div className="py-4 space-y-12">
      <p className="text-3xl font-bold text-center mt-8">Admin Portal</p>
      <SignInForm accountType="admin" />
    </div>
  );
}
