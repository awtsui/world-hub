import HostAuthButton from './HostAuthButton';
import ManageEventsButton from './ManageEventsButton';

export default function HostLandingMenu() {
  return (
    <div className="flex items-center gap-2">
      <HostAuthButton signInCallbackUrl="/dashboard" />
      <ManageEventsButton />
    </div>
  );
}
