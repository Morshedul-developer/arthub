import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "ArtHub - Online Art Marketplace",
  description: "Discover and buy original art from independent artists."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.classList.add('dark')}catch(e){}` }} />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
