// GitHub file fetching service
export interface GitHubFileResult {
  success: boolean;
  content?: string;
  error?: string;
  filename: string;
}

export interface GitHubRepoInfo {
  owner: string;
  repo: string;
  baseUrl: string;
}

export function parseGitHubUrl(url: string): GitHubRepoInfo | null {
  try {
    // Handle both formats:
    // https://github.com/username/reponame
    // https://github.com/username/reponame.git
    const cleanUrl = url.replace(/\.git$/, '');
    const match = cleanUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    
    if (!match) return null;
    
    const [, owner, repo] = match;
    return {
      owner,
      repo,
      baseUrl: `https://raw.githubusercontent.com/${owner}/${repo}/main`
    };
  } catch (error) {
    return null;
  }
}

export async function fetchGitHubFile(repoInfo: GitHubRepoInfo, filename: string): Promise<GitHubFileResult> {
  try {
    const fileUrl = `${repoInfo.baseUrl}/${filename}`;
    const response = await fetch(fileUrl);
    
    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          error: `File "${filename}" not found in repository. Please make sure the file exists in your main branch.`,
          filename
        };
      }
      return {
        success: false,
        error: `Failed to fetch "${filename}": ${response.status} ${response.statusText}`,
        filename
      };
    }
    
    const content = await response.text();
    return {
      success: true,
      content,
      filename
    };
  } catch (error) {
    return {
      success: false,
      error: `Network error while fetching "${filename}": ${error instanceof Error ? error.message : 'Unknown error'}`,
      filename
    };
  }
}

export async function fetchMultipleFiles(repoUrl: string, filenames: string[]): Promise<{
  repoInfo: GitHubRepoInfo | null;
  results: GitHubFileResult[];
}> {
  const repoInfo = parseGitHubUrl(repoUrl);
  
  if (!repoInfo) {
    return {
      repoInfo: null,
      results: filenames.map(filename => ({
        success: false,
        error: "Invalid GitHub URL format. Please use: https://github.com/username/reponame",
        filename
      }))
    };
  }
  
  const results = await Promise.all(
    filenames.map(filename => fetchGitHubFile(repoInfo, filename))
  );
  
  return { repoInfo, results };
}

// Save GitHub repo URL to localStorage for the current scene
export function saveRepoUrl(sceneId: string, repoUrl: string): void {
  // localStorage.setItem(`github_repo_${sceneId}`, repoUrl);
}

// Get saved GitHub repo URL for the current scene
export function getSavedRepoUrl(sceneId: string): string | null {
  // return localStorage.getItem(`github_repo_${sceneId}`);
  return null
}
