import Link from "next/link";
import { TrackEvent } from "@/components/TrackEvent";
import { buttonClass, Screen } from "@/components/ui";

export default function LandingPage() {
  return (
    <Screen>
      <TrackEvent name="landing_view" />
      <div className="flex flex-1 flex-col justify-center gap-4">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
          Узнайте свой <span className="text-accent">уровень IQ</span>
        </h1>
        <p className="text-lg text-muted">
          20 вопросов на логику, числа и вербальное мышление. Около 7 минут.
        </p>
      </div>
      <Link href="/quiz" className={buttonClass}>
        Начать тест
      </Link>
    </Screen>
  );
}
