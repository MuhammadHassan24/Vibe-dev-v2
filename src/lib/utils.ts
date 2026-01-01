import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { type TreeItem } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert a record of files to a tree structure.
 * @param files - Record of file paths to content
 * @returns Tree structure for TreeView component
 *
 * @example
 * Input: { "src/Button.tsx": "...", "README.md": "..." }
 * Output: [["src", "Button.tsx"], "README.md"]
 */

export function convertFilesToTreeItems(
  files: Record<string, string>
): TreeItem[] {
  // Define proper type for tree structure
  interface TreeNode {
    [key: string]: TreeNode | null;
  }

  // Build a tree structure first
  const tree: TreeNode = {};

  // Sort files to ensure consistent ordering
  const sortedPaths = Object.keys(files).sort();

  for (const filePath of sortedPaths) {
    const parts = filePath.split("/");
    let current = tree;

    // Navigate/create the tree structure
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }

    // Add the file (leaf node)
    const fileName = parts[parts.length - 1];
    current[fileName] = null; // null indicates it's a file
  }

  // Convert tree structure to TreeItem format
  function convertNode(node: TreeNode, name?: string): TreeItem[] | TreeItem {
    const entries = Object.entries(node);

    if (entries.length === 0) {
      return name || "";
    }

    const children: TreeItem[] = [];

    for (const [key, value] of entries) {
      if (value === null) {
        // It's a file
        children.push(key);
      } else {
        // It's a folder
        const subTree = convertNode(value, key);
        if (Array.isArray(subTree)) {
          children.push([key, ...subTree]);
        } else {
          children.push([key, subTree]);
        }
      }
    }

    return children;
  }

  const result = convertNode(tree);
  return Array.isArray(result) ? result : [result];
}

// import { Sandbox } from "@e2b/code-interpreter";

// /**
//  * Sanitize file content to remove null bytes and other problematic characters
//  * PostgreSQL cannot store \u0000 in text/JSON fields
//  */
// function sanitizeFileContent(content: string): string {
//   // Remove null bytes and other control characters except newlines and tabs
//   return content
//     .replace(/\u0000/g, "") // Remove null bytes
//     .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F]/g, ""); // Remove other control chars
// }

// /**
//  * Check if file content is likely binary (contains too many non-printable chars)
//  */
// function isBinaryContent(content: string): boolean {
//   // Sample first 512 bytes
//   const sample = content.substring(0, 512);
//   let nonPrintable = 0;

//   for (let i = 0; i < sample.length; i++) {
//     const code = sample.charCodeAt(i);
//     // Count non-printable characters (except newline, tab, carriage return)
//     if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
//       nonPrintable++;
//     }
//   }

//   // If more than 30% non-printable, likely binary
//   return nonPrintable / sample.length > 0.3;
// }

// /**
//  * Get only user-relevant files from Next.js project
//  * Excludes config files, build artifacts, and dependencies
//  */
// export async function getUserRelevantFiles(
//   sandbox: Sandbox,
//   basePath: string = "/home/user"
// ): Promise<{ [path: string]: string }> {
//   const files: { [path: string]: string } = {};

//   try {
//     // Find all files excluding heavy directories
//     const findCommand = `find ${basePath} -type f \
//       ! -path "*/node_modules/*" \
//       ! -path "*/.next/*" \
//       ! -path "*/.git/*" \
//       ! -path "*/dist/*" \
//       ! -path "*/build/*" \
//       ! -path "*/.turbo/*" \
//       ! -path "*/out/*" \
//       ! -path "*/.vercel/*" \
//       ! -path "*/.cache/*" \
//       2>/dev/null`;

//     console.log("Finding files in sandbox...");
//     const result = await sandbox.commands.run(findCommand);

//     if (!result.stdout || result.stdout.trim() === "") {
//       console.warn("No files found in sandbox");
//       return files;
//     }

//     // Get all file paths
//     const allFilePaths = result.stdout
//       .split("\n")
//       .map((path) => path.trim())
//       .filter((path) => path !== "");

//     console.log(`Found ${allFilePaths.length} total files`);

//     // Filter to only user-relevant files
//     const relevantFilePaths = allFilePaths.filter((filePath) => {
//       const relativePath = filePath.replace(`${basePath}/`, "");

//       // ❌ EXCLUDE: Binary file extensions
//       const binaryExtensions = [
//         ".png",
//         ".jpg",
//         ".jpeg",
//         ".gif",
//         ".ico",
//         ".webp",
//         ".woff",
//         ".woff2",
//         ".ttf",
//         ".eot",
//         ".otf",
//         ".mp4",
//         ".webm",
//         ".mp3",
//         ".wav",
//         ".zip",
//         ".tar",
//         ".gz",
//         ".pdf",
//         ".doc",
//         ".docx",
//       ];

//       const hasBlacklistedExtension = binaryExtensions.some((ext) =>
//         relativePath.toLowerCase().endsWith(ext)
//       );

//       if (hasBlacklistedExtension) {
//         console.log(`Skipping binary extension: ${relativePath}`);
//         return false;
//       }

//       // ✅ INCLUDE: Only public and src directories
//       if (relativePath.startsWith("public/")) return true;
//       if (relativePath.startsWith("src/")) return true;

//       // ❌ EXCLUDE: All config files
//       const excludedFiles = [
//         "package.json",
//         "package-lock.json",
//         "yarn.lock",
//         "pnpm-lock.yaml",
//         "tsconfig.json",
//         "jsconfig.json",
//         "next.config.js",
//         "next.config.mjs",
//         "next.config.ts",
//         "tailwind.config.js",
//         "tailwind.config.ts",
//         "postcss.config.js",
//         "postcss.config.mjs",
//         ".eslintrc.json",
//         ".eslintrc.js",
//         ".prettierrc",
//         ".gitignore",
//         ".env",
//         ".env.local",
//         ".env.example",
//         "README.md",
//         "next-env.d.ts",
//         ".cursorrules",
//         "components.json", // shadcn config
//         "eslint.config.mjs",
//       ];

//       // Exclude if it's a root-level config file
//       if (excludedFiles.includes(relativePath)) {
//         console.log(`Excluding config file: ${relativePath}`);
//         return false;
//       }

//       // ❌ EXCLUDE: Hidden files and dot files at root
//       if (relativePath.startsWith(".") && !relativePath.includes("/")) {
//         console.log(`Excluding hidden file: ${relativePath}`);
//         return false;
//       }

//       return false; // Exclude everything else by default
//     });

//     console.log(`Filtered to ${relevantFilePaths.length} user-relevant files`);

//     // Read each relevant file
//     for (const filePath of relevantFilePaths) {
//       try {
//         const content = await sandbox.files.read(filePath);
//         const relativePath = filePath.replace(`${basePath}/`, "");

//         // Skip binary files (images, fonts, etc.)
//         if (isBinaryContent(content)) {
//           console.log(`Skipping binary file: ${relativePath}`);
//           continue;
//         }

//         // Sanitize content to remove problematic characters
//         const sanitizedContent = sanitizeFileContent(content);
//         files[relativePath] = sanitizedContent;
//       } catch (error) {
//         console.error(`Error reading file ${filePath}:`, error);
//       }
//     }

//     console.log(`Successfully read ${Object.keys(files).length} files`);
//     console.log("User-relevant files:", Object.keys(files));

//     return files;
//   } catch (error) {
//     console.error("Error getting user-relevant files:", error);
//     return files;
//   }
// }

// /**
//  * Get ALL files (for debugging or full export)
//  */
// export async function getAllProjectFiles(
//   sandbox: Sandbox,
//   basePath: string = "/home/user"
// ): Promise<{ [path: string]: string }> {
//   const files: { [path: string]: string } = {};

//   try {
//     const findCommand = `find ${basePath} -type f \
//       ! -path "*/node_modules/*" \
//       ! -path "*/.next/*" \
//       ! -path "*/.git/*" \
//       ! -path "*/dist/*" \
//       ! -path "*/build/*" \
//       ! -path "*/.turbo/*" \
//       ! -path "*/out/*" \
//       ! -path "*/.vercel/*" \
//       ! -path "*/.cache/*" \
//       2>/dev/null`;

//     const result = await sandbox.commands.run(findCommand);

//     if (!result.stdout || result.stdout.trim() === "") {
//       return files;
//     }

//     const filePaths = result.stdout
//       .split("\n")
//       .map((path) => path.trim())
//       .filter((path) => path !== "");

//     for (const filePath of filePaths) {
//       try {
//         const content = await sandbox.files.read(filePath);
//         const relativePath = filePath.replace(`${basePath}/`, "");

//         // Skip binary files
//         if (isBinaryContent(content)) {
//           console.log(`Skipping binary file: ${relativePath}`);
//           continue;
//         }

//         // Sanitize content
//         const sanitizedContent = sanitizeFileContent(content);
//         files[relativePath] = sanitizedContent;
//       } catch (error) {
//         console.error(`Error reading file ${filePath}:`, error);
//       }
//     }

//     return files;
//   } catch (error) {
//     console.error("Error getting all files:", error);
//     return files;
//   }
// }

// /**
//  * Debug function - shows what files will be included/excluded
//  */
// export async function debugFileFiltering(
//   sandbox: Sandbox,
//   basePath: string = "/home/user"
// ): Promise<void> {
//   try {
//     const findCommand = `find ${basePath} -type f \
//       ! -path "*/node_modules/*" \
//       ! -path "*/.next/*" \
//       2>/dev/null`;

//     const result = await sandbox.commands.run(findCommand);
//     const allFiles = result.stdout.split("\n").filter((f) => f.trim());

//     console.log("=== FILE FILTERING DEBUG ===");
//     console.log(`Total files found: ${allFiles.length}\n`);

//     const included: string[] = [];
//     const excluded: string[] = [];

//     allFiles.forEach((filePath) => {
//       const relativePath = filePath.replace(`${basePath}/`, "");

//       // Same logic as getUserRelevantFiles
//       const isIncluded =
//         relativePath.startsWith("app/") ||
//         relativePath.startsWith("src/") ||
//         relativePath.startsWith("components/") ||
//         relativePath.startsWith("lib/") ||
//         relativePath.startsWith("public/");

//       if (isIncluded) {
//         included.push(relativePath);
//       } else {
//         excluded.push(relativePath);
//       }
//     });

//     console.log("✅ INCLUDED FILES:");
//     included.forEach((f) => console.log(`  ${f}`));

//     console.log("\n❌ EXCLUDED FILES:");
//     excluded.forEach((f) => console.log(`  ${f}`));

//     console.log(
//       `\nSummary: ${included.length} included, ${excluded.length} excluded`
//     );
//   } catch (error) {
//     console.error("Debug error:", error);
//   }
// }
