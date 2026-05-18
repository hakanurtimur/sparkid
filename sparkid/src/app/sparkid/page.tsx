import { SparkidExperience } from "@/features/sparkid/components/showcase/SparkidExperience";
import SparkyCompanion from "@/features/sparkid/components/sparky/SparkyCompanion";

export default function SparkidPage() {
  return (
    <>
      <SparkidExperience />
      <SparkyCompanion showIntro />
    </>
  );
}
