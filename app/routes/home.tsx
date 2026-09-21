import type { Route } from "./+types/home";
import { resumes } from "~/constants";
import { Navbar, ResumeCard } from "~/components";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResuLens" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth } = usePuterStore();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (!auth.isAuthenticated) navigate("/auth?next=/");
    },
    [auth.isAuthenticated],
  );

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
