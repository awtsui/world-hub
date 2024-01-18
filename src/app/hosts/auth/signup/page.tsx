import HostSignUpForm from '@/components/hosts/HostSignUpForm';

export default function HostSignUpPage() {
  return (
    <div className="py-4 space-y-12">
      <p className="text-3xl font-bold text-center mt-8">
        Welcome to the Host Portal
      </p>
      <HostSignUpForm />
    </div>
  );
}
