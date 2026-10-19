import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { Collection } from "@/components/home/Collection";
import { Customizer } from "@/components/home/Customizer";
import { About } from "@/components/home/About";
import { Technology } from "@/components/home/Technology";
import { Community } from "@/components/home/Community";
import { Newsletter } from "@/components/home/Newsletter";

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <Collection />
      <Customizer />
      <About />
      <Technology />
      <Community />
      <Newsletter />
    </main>
  );
}
