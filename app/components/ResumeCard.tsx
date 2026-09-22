import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

export default function ResumeCard({
  resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
  resume: Resume;
}) {
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(
    function () {
      const loadResumes = async function () {
        const blob = await fs.read(imagePath);
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        setResumeUrl(url);
      };

      loadResumes();
    },
    [imagePath],
  );

  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in duration-1000"
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          {companyName && (
            <h2 className="text-black font-black wrap-break-word">
              {companyName}
            </h2>
          )}
          {jobTitle && (
            <h3 className="text-lg wrap-break-word text-gray-500">
              {jobTitle}
            </h3>
          )}
          {companyName || jobTitle || (
            <h2 className="text-black font-black wrap-break-word">Resume</h2>
          )}
        </div>

        <div className="shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>
      {resumeUrl && (
        <div className="gradient-border animate-in fade-in duration-1000">
          <div className="w-full h-full">
            <img
              src={resumeUrl}
              alt="resume"
              className="w-full h-87.5 max-h-50 object-cover object-top"
            />
          </div>
        </div>
      )}
    </Link>
  );
}
