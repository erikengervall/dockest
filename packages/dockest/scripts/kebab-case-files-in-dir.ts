import fs from 'fs';

function isLowerCase(input: string): boolean {
  return input === input.toLowerCase() && input !== input.toUpperCase();
}

export function kebabCaseFilesInDir({ dirPath }: { dirPath: string }): void {
  const filesInDir = fs.readdirSync(dirPath);
  for (const filename of filesInDir) {
    const newFileName = filename
      .split('')
      .map((character, characterIndex) => {
        if (characterIndex === 0) {
          return character.toLowerCase();
        }

        if (['.', '_', '-'].includes(character)) {
          return character;
        }

        if (!isLowerCase(character)) {
          return `-${character.toLowerCase()}`;
        }

        return character;
      })
      .join('');
    fs.renameSync(`${dirPath}/${filename}`, `${dirPath}/${newFileName}`);
  }
}

const dirPath = process.argv.slice(2)[0];
kebabCaseFilesInDir({ dirPath });
