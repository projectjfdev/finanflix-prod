
import '../globals.css';
import localFont from 'next/font/local';
import { Poppins } from 'next/font/google';
import { FooterProvider } from '@/context/footer-context';
import NavbarWrapper from '@/components/Navbar/NavbarWrapper';
import BottomNavigation from '@/components/Navbar/BottomNavigation';
import FooterWrapper from '@/components/Footer/FooterWrapper';

{
  /* ----- FUENTES ----- SharpGrotesk-Bold10  */
}

const groteskSharpBold10 = localFont({
  src: '../../assets/font/SharpGrotesk-Bold10.otf',
  variable: '--font-grotesksharpboldten',
});

const groteskLight = localFont({
  src: '../../assets/font/SharpGrotesk-Thin25.otf',
  variable: '--font-grotesklight',
});

const grotesk20 = localFont({
  src: '../../assets/font/SharpGrotesk-Medium20.woff',
  variable: '--font-grotesktwenty',
});

const groteskBook20 = localFont({
  src: '../../assets/font/SharpGroteskBook20.ttf',
  variable: '--font-groteskBooktwenty',
});

const grotesk25 = localFont({
  src: '../../assets/font/sharp-grotesk-medium-25-regular.woff',
  variable: '--font-grotesktwentyfive',
});

const groteskMedium20 = localFont({
  src: '../../assets/font/grotesk20medium2.woff2',
  variable: '--font-groteskmediumtwenty',
});
const groteskBold15 = localFont({
  src: '../../assets/font/groteskBold15.woff',
  variable: '--font-groteskBold15',
});
const groteskBold10 = localFont({
  src: '../../assets/font/groteskBold10.woff',
  variable: '--font-groteskBold10',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-poppins',
});

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className={`${grotesk20.variable} ${grotesk25.variable} ${groteskLight.variable} ${groteskMedium20.variable} ${poppins.variable} ${groteskBook20.variable} ${groteskBold15.variable} ${groteskBold10.variable} ${groteskSharpBold10.variable} dark`}
    // className={`${grotesk20.variable} ${grotesk25.variable} ${groteskLight.variable} ${groteskMedium20.variable} ${poppins.variable} ${groteskBook20.variable} ${groteskBold15.variable} ${groteskBold10.variable} ${groteskSharpBold10.variable} dark:bg-background bg-[#F3F4F6]`}
    >
      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-T779NFR"
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        ></iframe>
      </noscript>

      {/* Contenedor Principal XL SIZE - 62vw = 1200px */}

      <div className="antialiased mx-auto m-0 relative w-full md:w-[70.9vw] sm:px-4 sm:pt-3 md:p-0 overflow-visible dark:bg-background bg-[#F3F4F6]">
        {/* Condición para mostrar/ocultar el Navbar */}
        {/* <Navbar /> */}

        <NavbarWrapper />


        {/* contenedor secundario mas chico */}
        <FooterProvider>
          <div className="antialiased md:w-[70.9vw] mx-auto p-0 m-0 relative overflow-visible dark:bg-background bg-[#F3F4F6]">
            {children}
            <div>
              {/* <Footer bgColor={footerBgColor} /> */}

              <FooterWrapper />


            </div>

            <BottomNavigation />
          </div>
        </FooterProvider>
      </div>
    </div>
  );
}
