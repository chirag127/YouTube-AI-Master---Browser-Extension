const fs = require('fs');
const glob = require('glob');

// Find all JS files in content directory
const files = glob.sync('extension/content/**/*.js');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Replace " as " with ": " in const destructuring lines
  const fixed = content.replace(
    /const\s*{\s*([^}]*?)\s*}\s*=\s*await\s*import\(/g,
    (match, destruct) => {
      const fixedDestruct = destruct.replace(/\s+as\s+/g, ': ');
      return `const { ${fixedDestruct} } = await import(`;
    }
  );

  if (fixed !== content) {
    fs.writeFileSync(file, fixed, 'utf8');
    console.log(`Fixed: ${file}`);
  }
});

console.log('Done!');
