import LandingPage from "@/components/home/Landingpage";
import { MyContextProvider } from "@/components/home/MyContext";
import Image from "next/image";

export default function Home() {
  return (
    <div className=" " >
     <MyContextProvider>
      <LandingPage  />
    </MyContextProvider>
    </div>
  );
}
