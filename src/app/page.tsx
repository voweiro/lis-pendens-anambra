import { MyContextProvider } from "@/components/home/MyContext";
import Image from "next/image";
import LandingpageClientWrapper from '@/components/home/LandingpageClientWrapper';

export default function Home() {
  return (
    <div  className="" >
     <MyContextProvider>
      <LandingpageClientWrapper />
    </MyContextProvider>
    </div>
  );
}
