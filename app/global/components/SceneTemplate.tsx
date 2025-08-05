import { useState, useEffect } from "react";
import TypingEffect from "./TypingEffect";
import MDtoHTML from "./MDtoHTML";
import MailConversation from "./MailConversation";
import { Mail, Github, ExternalLink } from "lucide-react";
import { fetchMultipleFiles, getSavedRepoUrl } from "../service/github";

export type SceneInputField = {
  label: string;
  name: string;
  filename: string; // GitHub filename to fetch
  placeholder?: string;
  required?: boolean;
  rows?: number;
  description?: string;
};

export type SceneTemplateProps = {
  storyEntries: any[];
  requirementsMarkdown: string;
  mailConvo: any[];
  createUserMail: (inputs: Record<string, string>, mailConvoLength: number) => any;
  createReviewMail: (inputs: Record<string, string>) => Promise<any[]>;
  inputFields: SceneInputField[];
  title: string;
  objective: string;
  sceneId: string; // Add scene ID for localStorage
  children?: React.ReactNode; // Allow custom content after validation
};




async function getGlobalRepoUrl() {
  try {
    const response = await fetch('/api/github');
    const data = await response.json();
    return data.githuburl || "";
  } catch (error) {
    console.error('Failed to fetch GitHub URL:', error);
    return "";
  }
}

function saveGlobalRepoUrl(url: string) {
  
}

function SceneTemplate({
  storyEntries,
  requirementsMarkdown,
  mailConvo: initialMailConvo,
  createUserMail,
  createReviewMail,
  inputFields,
  objective,
  sceneId,
  children
}: SceneTemplateProps) {
  const [showTask, setShowTask] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [inputs, setInputs] = useState<Record<string, string>>(() => {
    const obj: Record<string, string> = {};
    inputFields.forEach(f => { obj[f.name] = ""; });
    return obj;
  });
  const [githubUrl, setGithubUrl] = useState<string>("");
  const [mailConvo, setMailConvo] = useState<any[]>(initialMailConvo);
  const [allCorrect, setAllCorrect] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchErrors, setFetchErrors] = useState<string[]>([]);
  const [isEditingUrl, setIsEditingUrl] = useState(false);

  // Sync githubUrl and savedUrl with localStorage on mount and sceneId change
  useEffect(() => {
    const fetchUrl = async () => {
      const url = await getGlobalRepoUrl();
      if (url) {
        setGithubUrl(url);
        setIsEditingUrl(false);
      }
    };
    fetchUrl();
  }, [sceneId]);

  const handleComplete = () => setShowTask(true);

  const handleSubmit = async () => {
    if (!githubUrl.trim()) {
      setFetchErrors(["Please provide your GitHub repository URL"]);
      return;
    }

    setIsSubmitting(true);
    setFetchErrors([]);
    try {
      // Save the repo URL globally
      saveGlobalRepoUrl(githubUrl);
      
      // Get filenames to fetch
      const filenames = inputFields.map(field => field.filename);
      
      // Fetch files from GitHub
      const { repoInfo, results } = await fetchMultipleFiles(githubUrl, filenames);
      
      if (!repoInfo) {
        setFetchErrors(["Invalid GitHub URL format. Please use: https://github.com/username/reponame"]);
        setIsSubmitting(false);
        return;
      }
      
      // Check for any fetch errors
      const errors: string[] = [];
      const fetchedInputs: Record<string, string> = {};
      
      results.forEach((result, index) => {
        const field = inputFields[index];
        if (result.success && result.content) {
          fetchedInputs[field.name] = result.content;
        } else {
          errors.push(result.error || `Failed to fetch ${field.filename}`);
        }
      });
      
      if (errors.length > 0) {
        setFetchErrors(errors);
        setIsSubmitting(false);
        return;
      }
      
      // Update inputs with fetched content
      setInputs(fetchedInputs);
      
      // Create user mail and get AI review
      const userMail = createUserMail(fetchedInputs, mailConvo.length);
      const aiMailArr = await createReviewMail(fetchedInputs);
      const aiMail = aiMailArr[0];
      
      setMailConvo([...mailConvo, userMail, aiMail]);
      setIsDrawerOpen(true);
      
      const allCorrectNow = aiMail.body.includes('Great job! Both files meet our standards') ||
        aiMail.body.includes('Congratulations!');
      setAllCorrect(allCorrectNow);
      
    } catch (error) {
      setFetchErrors([`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidGitHubUrl = githubUrl.trim() && githubUrl.includes('github.com/');

  // Check localStorage for GitHub URL before rendering input
  const savedUrl = getSavedRepoUrl(sceneId);

  if (showTask) {
    return (
      <div className="h-screen bg-gray-100 flex flex-col relative">
       
        {/* Mail Icon Button (top right) */}
        <button
          className="fixed top-6 right-8 z-50 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors duration-300"
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          aria-label={isDrawerOpen ? "Close Mail" : "Open Mail"}
        >
          <Mail className="w-7 h-7" />
        </button>
        {/* Overlay */}
        {isDrawerOpen && (
          <div
            className="fixed inset-0 bg-opacity-10 z-40 transition-opacity duration-300"
            onClick={() => setIsDrawerOpen(false)}
            style={{ opacity: isDrawerOpen ? 1 : 0 }}
          />
        )}
        {/* Side Drawer */}
        <div
          className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
          style={{ pointerEvents: isDrawerOpen ? 'auto' : 'none' }}
        >
          {isDrawerOpen && mailConvo && (
            <>
              <div className="flex justify-end px-4 pt-2">
                <button
                  className="ml-2 p-2 hover:bg-gray-200 rounded-full text-2xl font-bold text-gray-500"
                  aria-label="Close"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  ×
                </button>
              </div>
              <MailConversation initialConversation={mailConvo} />
            </>
          )}
        </div>
        {/* Main Content */}
        <div className="relative z-10 flex-1 overflow-y-auto">
          {/* Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Project Assignment</h1>
                  <p className="text-gray-600 mt-1">{objective}</p>
                </div>
                {/* You can add scene number here if needed */}
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Requirements */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Project Setup Requirements</h3>
              <div className="markdown-body">
                <MDtoHTML
                  markdown={requirementsMarkdown}
                  className="prose max-w-none text-sm text-gray-700"
                />
              </div>
            </div>
            {/* Submission Form */}
            <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Submit Your GitHub Repository</h3>
              
              {/* GitHub URL Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  GitHub Repository URL <span className="text-red-500">*</span>
                </label>
                {savedUrl && !isEditingUrl ? (
                  <div className="flex items-center space-x-3">
                    <Github className="w-5 h-5 text-gray-400" />
                    <span className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-700">{savedUrl}</span>
                    <button
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={() => setIsEditingUrl(true)}
                    >Edit</button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Github className="w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                      placeholder="https://github.com/username/velsymedia-support-portal"
                    />
                    {savedUrl && (
                      <button
                        className="px-3 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        onClick={() => { setIsEditingUrl(false); setGithubUrl(savedUrl); }}
                      >Cancel</button>
                    )}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Provide your GitHub repository URL. We'll automatically fetch and validate your files.
                </p>
              </div>

              {/* Expected Files List */}
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Files we'll check in your repository:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  {inputFields.map(field => (
                    <li key={field.name} className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <code className="bg-white px-2 py-1 rounded text-xs">{field.filename}</code>
                      <span>- {field.description}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Fetch Errors */}
              {fetchErrors.length > 0 && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-red-900 mb-2">Issues found:</h4>
                  <ul className="text-sm text-red-800 space-y-1">
                    {fetchErrors.map((error, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span>{error}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Fetched Files Preview (only show if we have content) */}
              {Object.keys(inputs).length > 0 && Object.values(inputs).some(content => content.trim()) && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-green-900 mb-2">✅ Files successfully fetched from your repository</h4>
                  <div className="space-y-2">
                    {inputFields.map(field => (
                      inputs[field.name] && (
                        <div key={field.name} className="text-sm text-green-800">
                          <code className="bg-white px-2 py-1 rounded text-xs">{field.filename}</code>
                          <span className="ml-2">({inputs[field.name].length} characters)</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* Submit Button */}
                <div className="text-center pt-4">
                  <button
                    disabled={!isValidGitHubUrl || isSubmitting}
                    onClick={handleSubmit}
                    className="bg-gray-900 text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Fetching & Validating...</span>
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4" />
                        <span>Fetch Files & Submit for Review</span>
                      </>
                    )}
                  </button>
                </div>
                {allCorrect && children && (
                  <div className="text-center pt-4">
                    {children}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <TypingEffect
      entries={storyEntries}
      onComplete={handleComplete}
    />
  );
}

export default SceneTemplate;
