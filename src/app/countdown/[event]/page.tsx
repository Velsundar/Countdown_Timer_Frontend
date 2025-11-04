import CountdownTimer from "@/components/CountdownTimer";

export default function CountdownPage({
  params,
}: {
  params: { event: "engagement" | "marriage" };
}) {
  const eventKey = params.event;
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-cream px-4">
      <CountdownTimer eventKey={eventKey} />
    </main>
  );
}
