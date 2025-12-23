const Hero: React.FC = () => {
  return (
    <section
      className="relative h-screen bg-cover bg-center"
      style={{ backgroundImage: "url(/images/showground.jpg)" }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative flex h-full items-center justify-center text-center text-white px-4">
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold">
            Dalgety Show 2026
          </h1>
          <p className="mt-4 text-xl">
            Sunday 8th March — Live Well, Farm Well
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
