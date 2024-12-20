import localFont from "next/font/local";
import "./globals.css";
import {Outfit} from 'next/font/google'; //it's a function, remember to invoke
import Provider from "./Provider";
import { ClerkProvider } from "@clerk/nextjs";
// import { Toaster } from "sonner";
import { Toaster } from "@/components/ui/sonner"
// import Header from "./_Components/Header";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const outfit = Outfit({subsets:['latin']});

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={outfit.className}        
      >
        <div className="flex">
            <div>
              <Provider>
                {children}
              </Provider>
               <Toaster /> 
            </div>
        </div>
      </body>
    </html>
    </ClerkProvider> 
  );
}

