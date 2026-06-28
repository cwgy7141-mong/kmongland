import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const src = "C:\\Users\\cwgy\\.gemini\\antigravity-ide\\brain\\2ec747d7-34ab-4d67-a7df-0f37997c1ea6\\bts_member_silhouette_bg_1782477118382.png";
const dest = path.join(__dirname, 'src', 'assets', 'bts_member_silhouette_bg.png');

try {
  fs.copyFileSync(src, dest);
  console.log('Restored original 7 members silhouette successfully!');
} catch (err) {
  console.error('Error copying file:', err);
}
