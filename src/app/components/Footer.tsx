import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="pt-8">
      <div className="flex navbar-bg px-4 md:px-8 lg:px-16 xl:px-32 py-12 justify-between items-start">
        <div className="flex flex-col items-start justify-between">
          <div className="md:hidden lg:block p-4">
            <Link href="/" className="font-bold text-3xl text-red-600">
              <Image src="/SQUADZ.png" alt="logo" width={240} height={48} />
            </Link>
          </div>
          <div className="text-sm text-white p-4">
            Compliant with all game publishers
          </div>
          <div className="flex gap-4 items-center justify-between p-4">
            <Image src="/icons/ea-logo.png" alt="" width={28} height={20} />
            <Image src="/icons/riot-logo.png" alt="" width={28} height={20} />
            <Image src="/icons/epic-logo.png" alt="" width={28} height={20} />
          </div>
          <div className="text-sm text-[#7E8087] p-4">All rights reserved</div>
        </div>
        <div className="flex flex-col items-start justify-between">
          <div className="text-sm text-[#7E8087] p-4">COMPANY</div>
          <div className="text-md font-medium text-white p-2">About Us</div>
          <div className="text-md font-medium text-white p-2">Partnerships</div>
          <div className="text-md font-medium text-white p-2">Branding</div>
          <div className="text-md font-medium text-white p-2">FAQ</div>
        </div>
        <div className="flex flex-col items-start justify-between">
          <div className="text-sm text-[#7E8087] p-4">SOCIALS</div>
          <div className="text-md font-medium text-white p-2">Facebook</div>
          <div className="text-md font-medium text-white p-2">Twitter</div>
          <div className="text-md font-medium text-white p-2">Instagram</div>
          <div className="text-md font-medium text-white p-2">Discord</div>
        </div>
        <div className="flex flex-col items-start justify-between">
          <div className="text-sm text-[#7E8087] p-4">LEGAL</div>
          <div className="text-md font-medium text-white p-2">
            Privacy Policy
          </div>
          <div className="text-md font-medium text-white p-2">
            Terms of Services
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
