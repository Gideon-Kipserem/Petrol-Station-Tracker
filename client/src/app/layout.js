import "./globals.css";
import Navigation from "../components/Navigation";

export const metadata = {
  title: "Smart Petro",
  description: "Real-time insights into your fuel business operations",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navigation>
          {children}
        </Navigation>
      </body>
    </html>
  );
}
