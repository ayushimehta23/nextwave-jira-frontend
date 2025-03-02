"use client"; 
import { Provider } from "react-redux";
import { store } from "../app/store/store"; // Ensure correct path
import "bootstrap/dist/css/bootstrap.min.css";
import HeaderFooter from "@/components/HeaderFooter";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
      
        <Provider store={store}><HeaderFooter>{children}</HeaderFooter></Provider>
        
      </body>
    </html>
  );
}
