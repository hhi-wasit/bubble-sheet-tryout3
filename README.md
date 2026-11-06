# ExamFlow (Stage 1 of 6)
Offline PWA shell: bottom navigation, IndexedDB storage, exam list, English/Arabic (RTL), backup/restore.
Not built yet: exam wizard, answer key, sheet generator, camera scanning, grading, analysis (Stages 2-5).

Run locally: `python3 -m http.server` in this folder, open http://localhost:8000 (camera and install need HTTPS or localhost).
Deploy: push the folder contents to a GitHub repo, then Settings > Pages > deploy from the main branch root.
Install on Android: open the Pages URL in Chrome > menu > Install app.
Tests: `npm i fake-indexeddb && node tests/test.js`
