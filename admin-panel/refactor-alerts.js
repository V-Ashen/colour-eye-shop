const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  "src/components/AdminGuard.tsx",
  "src/app/settings/page.tsx",
  "src/app/roles/page.tsx",
  "src/app/products/page.tsx",
  "src/app/products/add/page.tsx",
  "src/app/manage-staff/page.tsx",
  "src/app/orders/page.tsx"
];

filesToUpdate.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if already imported
  if (!content.includes('import { toast } from "react-hot-toast"')) {
    // Add import after last import
    const importRegex = /import .* from ['"].*['"];\n/g;
    let match;
    let lastIndex = 0;
    while ((match = importRegex.exec(content)) !== null) {
      lastIndex = importRegex.lastIndex;
    }
    
    if (lastIndex > 0) {
      content = content.slice(0, lastIndex) + 'import { toast } from "react-hot-toast";\n' + content.slice(lastIndex);
    } else {
      content = 'import { toast } from "react-hot-toast";\n' + content;
    }
  }

  // Replace alerts
  // Simple heuristic: if the alert contains "Success", "Added", "Updated", "Created", "complete", use toast.success
  // Otherwise use toast.error
  content = content.replace(/alert\((.*?)\)/g, (match, p1) => {
    const p1Lower = p1.toLowerCase();
    if (p1Lower.includes('success') || p1Lower.includes('added') || p1Lower.includes('updated') || p1Lower.includes('created') || p1Lower.includes('complete') || p1Lower.includes('deleted!')) {
      return `toast.success(${p1})`;
    } else {
      return `toast.error(${p1})`;
    }
  });

  // also replace confirm() with a toast confirm ? nah let's keep confirm() for now, it's native and pauses execution which is needed for some logic unless we rewrite to async modal. Wait, confirm isn't easily replaced with toast. Let's just do alert.

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});
