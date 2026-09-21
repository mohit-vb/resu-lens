import { useState } from "react";
import { useNavigate } from "react-router";
import { FileUploader, Navbar } from "~/components";
import { prepareInstructions } from "~/constants";
import { convertPdfToImage } from "~/lib/pdftoimg";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/utils";

export default function Upload() {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = function (file: File | null) {
    setFile(file);
  };

  const handleAnalyzeResume = async function ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) {
    setIsProcessing(true);
    setStatusText("Uploading resume...");

    const uploadFile = await fs.upload([file]);
    if (!uploadFile) {
      setStatusText("Failed to upload resume.");
      return;
    }

    setStatusText("Converting to image...");
    console.log("2️⃣ Starting PDF → image conversion");

    const imgFile = await convertPdfToImage(file);

    console.log("2️⃣ IMAGE CONVERSION RESULT:", imgFile);
    console.log("2️⃣ IMAGE FILE:", imgFile.file);

    if (!imgFile.file) {
      console.error("❌ PDF → image conversion failed");
      setStatusText("Failed to convert PDF to image.");

      return;
    }

    console.log("✅ PDF → image conversion successful");
    console.log("Image name:", imgFile.file.name);
    console.log("Image type:", imgFile.file.type);
    console.log("Image size:", imgFile.file.size);

    setStatusText("Uploading image...");
    const uploadImage = await fs.upload([imgFile.file]);

    if (!uploadImage) {
      setStatusText("Failed to upload image.");

      return;
    }

    setStatusText("Preparing data...");
    const uuid = generateUUID();

    const data = {
      id: uuid,
      companyName,
      jobTitle,
      jobDescription,
      resumePath: uploadFile.path,
      imagePath: uploadImage.path,
      feedback: "",
    };

    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText("Analyzing resume...");

    const feedback = await ai.feedback(
      uploadFile.path,
      prepareInstructions({ jobTitle, jobDescription }),
    );

    if (!feedback) {
      setStatusText("Failed to analyze resume.");

      return;
    }

    const feedbackText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0];

    data.feedback = JSON.parse(feedbackText);
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText("Analysis complete! Redirecting...");
    // navigate(`/resume/${uuid}`);
    console.log(data);
  };

  const handleSubmit = function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form) return;

    const formData = new FormData(form);
    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!file) return;

    handleAnalyzeResume({ companyName, jobTitle, jobDescription, file });
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-no-repeat bg-center bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Smart feedback for your dream job</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img src="/images/resume-scan.gif" className="w-full" />
            </>
          ) : (
            <h2>Drop your resume for ATS score and improvement tips</h2>
          )}

          {!isProcessing && (
            <form
              id="upload-form"
              className="flex flex-col gap-4 mt-8"
              onSubmit={handleSubmit}
            >
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input
                  type="text"
                  name="company-name"
                  id="company-name"
                  placeholder="Company Name"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input
                  type="text"
                  name="job-title"
                  id="job-title"
                  placeholder="Job Title"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea
                  rows={5}
                  name="job-description"
                  id="job-description"
                  placeholder="Job Description"
                />
              </div>
              <div className="form-div">
                <label htmlFor="uploader">Upload Resume</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>

              <button className="primary-button" type="submit">
                {" "}
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
