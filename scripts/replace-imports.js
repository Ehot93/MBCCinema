#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Маппинг для замены относительных путей на абсолютные
const pathMappings = [
    { regex: /from ['"]\.\.\/entities\//g, replacement: "from '@/entities/" },
    { regex: /from ['"]\.\.\/shared\//g, replacement: "from '@/shared/" },
    { regex: /from ['"]\.\.\/pages\//g, replacement: "from '@/pages/" },
    { regex: /from ['"]\.\.\/app\//g, replacement: "from '@/app/" },
    { regex: /from ['"]\.\.\/\.\.\/entities\//g, replacement: "from '@/entities/" },
    { regex: /from ['"]\.\.\/\.\.\/shared\//g, replacement: "from '@/shared/" },
    { regex: /from ['"]\.\.\/\.\.\/pages\//g, replacement: "from '@/pages/" },
    { regex: /from ['"]\.\.\/\.\.\/app\//g, replacement: "from '@/app/" },
    { regex: /from ['"]\.\.\/\.\.\/\.\.\/entities\//g, replacement: "from '@/entities/" },
    { regex: /from ['"]\.\.\/\.\.\/\.\.\/shared\//g, replacement: "from '@/shared/" },
    { regex: /from ['"]\.\.\/\.\.\/\.\.\/pages\//g, replacement: "from '@/pages/" },
    { regex: /from ['"]\.\.\/\.\.\/\.\.\/app\//g, replacement: "from '@/app/" },
    { regex: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/entities\//g, replacement: "from '@/entities/" },
    { regex: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/shared\//g, replacement: "from '@/shared/" },
    { regex: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/pages\//g, replacement: "from '@/pages/" },
    { regex: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/app\//g, replacement: "from '@/app/" },
];

async function replaceImportsInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    for (const mapping of pathMappings) {
        if (mapping.regex.test(content)) {
            content = content.replace(mapping.regex, mapping.replacement);
            modified = true;
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Updated: ${filePath}`);
        return true;
    }
    return false;
}

async function main() {
    const srcDir = path.join(__dirname, '../src');
    const files = await glob('**/*.{ts,tsx}', {
        cwd: srcDir,
        ignore: ['node_modules/**', 'dist/**']
    });

    let updatedCount = 0;

    for (const file of files) {
        const filePath = path.join(srcDir, file);
        const wasUpdated = await replaceImportsInFile(filePath);
        if (wasUpdated) updatedCount++;
    }

    console.log(`\n✅ Total files updated: ${updatedCount}`);
}

main().catch(console.error);
