import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔄 Git Auto-Commit & Push Watcher Started...');
console.log('Watching for file modifications in portfolio folder...\n');

let isCommitting = false;

function commitAndPush() {
  if (isCommitting) return;
  isCommitting = true;

  try {
    const status = execSync('git status --porcelain', { encoding: 'utf-8' });
    if (status.trim().length > 0) {
      console.log('⚡ File changes detected! Staging and committing changes...');
      execSync('git add .');
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      execSync(`git commit -m "auto: update portfolio code [${timestamp}]"`);
      console.log(`✅ Git Commit Created at ${timestamp}`);

      try {
        execSync('git push origin main', { stdio: 'inherit' });
        console.log('🚀 Successfully pushed to GitHub!');
      } catch (pushErr) {
        console.log('ℹ️ Local commit saved. (To push to GitHub, add remote repository using: git remote add origin <URL>)');
      }
    }
  } catch (err) {
    console.error('Git auto-commit error:', err.message);
  } finally {
    isCommitting = false;
  }
}

// Watch project directory
fs.watch(process.cwd(), { recursive: true }, (eventType, filename) => {
  if (filename && (filename.includes('.git') || filename.includes('node_modules') || filename.includes('dist'))) {
    return;
  }
  commitAndPush();
});

// Run initial check
commitAndPush();
