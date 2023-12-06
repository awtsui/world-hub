import AuthButton from './AuthButton';
import SessionPoke from './SessionPoke';

export default function UserMenu() {
  return (
    <div>
      <div className="hidden md:block">
        <AuthButton />
        {/* <SessionPoke /> */}
      </div>
    </div>
  );
}
