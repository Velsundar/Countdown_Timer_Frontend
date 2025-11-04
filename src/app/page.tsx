import WelcomeForm from "@/components/WelcomeForm";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-cream">
      <div className="animate-fade-in text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-serif text-roseGold mb-2">
          Sundaravel & Ranjitha
        </h1>
        <p className="text-charcoal text-lg">Our Journey Begins 💖</p>
      </div>

      <WelcomeForm />
    </main>
  );
}