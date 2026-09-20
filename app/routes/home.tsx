import type { Route } from "./+types/home";
import { resumes } from "~/constants";
import { Navbar, ResumeCard } from "~/components";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResuLens" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-no-repeat bg-center bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Analyze Your Resume. Improve Your Chances.</h1>
          <h2>Review your resume and get personalized AI-powered feedback</h2>
        </div>

        {resumes.length > 0 && (
          <section className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </section>
        )}
      </section>
    </main>
  );
}
