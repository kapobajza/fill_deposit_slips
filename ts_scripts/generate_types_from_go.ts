import fs from 'fs';
import path from 'path';
import prettier from 'prettier';

const rootDir = path.resolve(__dirname, '..');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const prettierRc = require('../.prettierrc.js');

const main = async () => {
  let goTypesStr = fs.readFileSync(path.resolve(rootDir, 'cmd/wasm/util/types.go'), 'utf8');

  let indexOfType = goTypesStr.indexOf('type');

  let finalTsTypes = '';

  while (indexOfType !== -1) {
    indexOfType = goTypesStr.indexOf('type');
    const indexOfClosingBracket = goTypesStr.indexOf('}');
    const goType = goTypesStr.substring(indexOfType, indexOfClosingBracket + 1);
    goTypesStr = goTypesStr.substring(indexOfClosingBracket + 1);

    const typeName = goType.substring(goType.indexOf('type') + 5, goType.indexOf('struct')).trim();
    const typeProps = goType
      .substring(goType.indexOf('{') + 1, goType.indexOf('}'))
      .trim()
      .replace(/\t/g, '')
      .replace(/float32/g, 'number')
      .split('\n')
      .filter((val) => val)
      .map((val) => val.replace(/\s+/g, ' ').split(' ').join(': ') + ',')
      .join('\n');

    if (typeName && typeProps) {
      finalTsTypes = `${finalTsTypes}\nexport type ${typeName} = {\n${typeProps}\n};\n`;
    }
  }

  const formattedTsFile = await prettier.format(finalTsTypes, {
    ...prettierRc,
    parser: 'typescript',
  });

  fs.writeFileSync(path.resolve(rootDir, 'popup/go_types.ts'), formattedTsFile);
};

main();
