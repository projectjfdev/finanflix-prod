'use client';
import React from 'react';
import Link from 'next/link';
import { useFooter } from '@/context/footer-context';
import { useSession } from 'next-auth/react';
// bg-[#0F0F0F]

const Footer = ({ bgColor = 'bg-white' }: { bgColor?: string }) => {
  const { footerBgColor, footerHidden } = useFooter();
  const { status } = useSession();

  if (footerHidden) return null;

  return (
    <div
      className={`${footerHidden} ${footerBgColor || bgColor} ${
        status === 'loading' ? 'hidden' : ''
      } w-screen ml-[calc(-50vw+50%)] dark:bg-background`}
    >
      <div className="px-8 md:px-0 md:w-[70.9vw] mx-auto dark:text-[#E6E6E6] text-gray-700 font-poppins">
        <footer className="sm:py-9 w-full">
          <hr className="my-5 border-[#2D2D2D] w-full" />

          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 font-poppins w-full">
            <div className="text-[16px] dark:text-white   w-full  ">
              <div className="md:flex w-full items-center">
                <div className="text-center md:text-start md:w-[185px]">
                  <span className='text-sm md:text-base'>© 2025</span>
                  <span className="relative left-[2px] text-sm md:text-base "> Finanflix ™</span>{' '}
                  {/* <span className="text-xs text-gray-500 ml-1">v 1.2</span> */}
                </div>

                <div className="xl:relative xl:left-10 text-center md:w-1/2 md:text-start flex flex-col md:flex-row  md:gap-3 items-center">
                  <Link
                    href="/terminos-y-condiciones"
                    target="_blank"
                    className="ml-[6px] hover:text-[#A7A7A7] transition-colors font-poppins text-sm md:text-base"
                  >
                    Términos y Condiciones
                  </Link>

                  {/* WHATSAPP SOLICITAR BAJA */}
                  <div className="flex items-center gap-1 font-poppins   px-4 rounded-full hover:text-[#A4A4A4]">
                    <svg
                      className="w-4 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.486 2 2 6.486 2 12c0 2.021.593 3.897 1.616 5.493L2 22l4.555-1.558A9.96 9.96 0 0 0 12 22c5.514 0 10-4.486 10-10S17.514 2 12 2zm.213 18c-1.516 0-2.985-.444-4.243-1.258l-.303-.19-2.706.924.91-2.71-.199-.313C4.285 15.199 4 13.62 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.187-5.855c-.229-.114-1.351-.667-1.561-.744-.211-.077-.364-.114-.517.114-.153.229-.593.744-.728.9-.134.153-.268.172-.497.057-.229-.114-.967-.357-1.841-1.138-.681-.59-1.14-1.321-1.276-1.55-.134-.229-.014-.353.1-.468.103-.103.229-.268.344-.402.114-.134.153-.229.229-.382.076-.153.038-.287-.019-.401-.057-.114-.517-1.243-.708-1.7-.185-.446-.372-.386-.517-.386h-.43c-.153 0-.401.057-.612.287-.211.229-.8.782-.8 1.908s.82 2.219.934 2.372c.114.153 1.614 2.478 3.914 3.473.547.236.973.377 1.306.482.55.176 1.05.151 1.448.092.441-.065 1.351-.552 1.542-1.086.191-.535.191-.993.134-1.086-.057-.092-.21-.153-.439-.267z"
                        clipRule="evenodd"
                      />
                    </svg>

                    <Link
                      href="https://api.whatsapp.com/send/?phone=%2B5491134895722&text&type=phone_number&app_absent=0"
                      target="_blank"
                      className="transition-colors font-poppins text-sm md:text-base"
                    >
                      Solicitar Baja
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-6 font-poppins">
              {/* <Link
              href="https://discord.gg/yNKR8gR6PP"
              target="_blank"
              className="text-[#666666] hover:text-[#A7A7A7]  font-poppins  transition-transform duration-300 ease-in-out hover:scale-[1.1] hover:shadow-lg"
            >
              <svg
                className=""
                width="20"
                height="20"
                viewBox="0 -28.5 256 256"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid"
                fill="currentColor"
              >
                <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z" />
              </svg>
            </Link> */}
              <Link
                href="https://www.instagram.com/finanflix.ok"
                target="_blank"
                className="text-[#666666] hover:text-[#A7A7A7]  transition-transform duration-300 ease-in-out hover:scale-[1.1] hover:shadow-lg"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link
                href="https://x.com/finanflix"
                target="_blank"
                className="text-[#666666] hover:text-[#A7A7A7] transition-transform duration-300 ease-in-out hover:scale-[1.1] hover:shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="w-4 h-4 md:w-5 md:h-5"
                  viewBox="0 0 17 17"
                >
                  <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
                </svg>
              </Link>

              <Link
                href="https://api.whatsapp.com/send/?phone=%2B5491134895722&text&type=phone_number&app_absent=0"
                target="_blank"
                className="text-[#666666] hover:text-[#A7A7A7] transition-transform duration-300 ease-in-out hover:scale-[1.1] hover:shadow-lg"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.486 2 2 6.486 2 12c0 2.021.593 3.897 1.616 5.493L2 22l4.555-1.558A9.96 9.96 0 0 0 12 22c5.514 0 10-4.486 10-10S17.514 2 12 2zm.213 18c-1.516 0-2.985-.444-4.243-1.258l-.303-.19-2.706.924.91-2.71-.199-.313C4.285 15.199 4 13.62 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.187-5.855c-.229-.114-1.351-.667-1.561-.744-.211-.077-.364-.114-.517.114-.153.229-.593.744-.728.9-.134.153-.268.172-.497.057-.229-.114-.967-.357-1.841-1.138-.681-.59-1.14-1.321-1.276-1.55-.134-.229-.014-.353.1-.468.103-.103.229-.268.344-.402.114-.134.153-.229.229-.382.076-.153.038-.287-.019-.401-.057-.114-.517-1.243-.708-1.7-.185-.446-.372-.386-.517-.386h-.43c-.153 0-.401.057-.612.287-.211.229-.8.782-.8 1.908s.82 2.219.934 2.372c.114.153 1.614 2.478 3.914 3.473.547.236.973.377 1.306.482.55.176 1.05.151 1.448.092.441-.065 1.351-.552 1.542-1.086.191-.535.191-.993.134-1.086-.057-.092-.21-.153-.439-.267z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link
                href="https://www.youtube.com/finanflix"
                target="_blank"
                className="text-[#666666] hover:text-[#A7A7A7] transition-transform duration-300 ease-in-out hover:scale-[1.1] hover:shadow-lg"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M23.499 6.203a3.01 3.01 0 0 0-2.117-2.123C19.592 3.5 12 3.5 12 3.5s-7.592 0-9.382.58A3.01 3.01 0 0 0 .501 6.203C0 8.005 0 12 0 12s0 3.995.501 5.797a3.01 3.01 0 0 0 2.117 2.123c1.79.58 9.382.58 9.382.58s7.592 0 9.382-.58a3.01 3.01 0 0 0 2.117-2.123C24 15.995 24 12 24 12s0-3.995-.501-5.797zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Footer;
