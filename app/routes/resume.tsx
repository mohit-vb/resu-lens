import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router";
import { ATS, Details, Summary } from "~/components";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
  { title: "Resulens | Review" },
  { name: "description", content: "Detailed review of your resume" },
];

export default function Resume() {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [resumeUrl, setResumeUrl] = useState<string>("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(
    function () {
      if (!isLoading && !auth.isAuthenticated)
        Navigate({ to: `/auth?next=/${id}` });
    },
    [isLoading],
  );

  useEffect(
    function () {
      const loadResume = async function () {
        const resume = await kv.get(`resume:${id}`);
        if (!resume) return;

        const data = JSON.parse(resume);

        const resumeBlob = await fs.read(data.resumePath);
        if (!resumeBlob) return;

        const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
        const resumeUrl = URL.createObjectURL(pdfBlob);
        setResumeUrl(resumeUrl);

        const imageBlob = await fs.read(data.imagePath);
        if (!imageBlob) return;
        const imageUrl = URL.createObjectURL(imageBlob);
        setImageUrl(imageUrl);

        setFeedback(data.feedback);
        console.log(imageUrl, resumeUrl, data.feedback);
      };

      loadResume();
    },
    [id],
  );

  return (
    <main>
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img
            src="/icons/back.svg"
            alt="back button"
            className="w-2.5 h-2.5"
          />
          <span className="text-gray-800 text-sm font-semibold">
            Back to homepage
          </span>
        </Link>
      </nav>

      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover bg-center h-screen sticky top-0">
          {imageUrl && resumeUrl && (
            <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-fit max-2xl:w-fit">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={imageUrl}
                  className="w-full h-full object-cover"
                  alt="Resume image"
                  title="Resume"
                />
              </a>
            </div>
          )}
        </section>
        <section className="feedback-section">
          <h2>Resume Review</h2>
          {feedback ? (
            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
              <Summary feedback={feedback} />
              <ATS
                score={feedback?.ATS?.score || 0}
                suggestions={feedback?.ATS?.tips || []}
              />
              <Details feedback={feedback} />
            </div>
          ) : (
            <img src="/images/resume-scan-2.gif" className="w-full" />
          )}
        </section>
      </div>
    </main>
  );
}
