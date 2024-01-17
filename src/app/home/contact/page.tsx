import ContactForm from '@/components/home/ContactForm';
import { Instagram, Linkedin, Twitter } from 'lucide-react';

export default function LandingContactPage() {
  return (
    <div className="w-3/5 mx-auto flex h-full justify-center items-center">
      <div className="flex gap-5 my-auto md:gap-20 lg:gap-36">
        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-5 items-start">
            <p className="text-7xl text-center max-w-[500px]">Contact Us</p>
            <p>info@worldhub.com</p>
          </div>
          <div className="flex flex-col gap-3">
            <p>Find us</p>
            <div className="flex gap-4">
              <Instagram className="h-5 w-5" /> <Twitter className="h-5 w-5" />{' '}
              <Linkedin className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center w-auto pt-4 pb-2">
          <p className="text-2xl">Say Hello</p>
          <div className="pt-4">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
