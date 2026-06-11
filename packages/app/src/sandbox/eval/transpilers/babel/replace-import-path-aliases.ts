/**
 * Replaces alias in the esmodule code
 */
const createRegex = (pathMap: any) => {
  const mapKeysStr = Object.keys(pathMap)
    .map(item => item.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'))
    .reduce((acc, cur) => `${acc}|${cur}`);
  const regexStr = `^(import[\\s\\S]*?from?\\s+["|'])(${mapKeysStr})((?=\\/).*|)(["|'];?)$`;
  return new RegExp(regexStr, 'gm');
};

const replaceImportPathAliases = (code: string, pathMap: any) => {
  const regex = createRegex(pathMap);
  const replacer = (
    _: string,
    g1: string,
    aliasGrp: string,
    restPathGrp: string,
    g4: string
  ) =>
    `${g1}${
      // if the alias is a relative path, then it's related to the root directory,
      // so ./ is equivalent to /
      pathMap[aliasGrp] ? pathMap[aliasGrp].replace(/^\.\//, '/') : aliasGrp
    }${restPathGrp}${g4}`;
  return code.replace(regex, replacer), pathMap;
};

export const replaceEnvironments = (code: string) => {
  return code
    .replace(/import\.meta\./g, `__IMPORT_META__.`)
    .replace(/process\.env/g, `__PROCESS_ENV__`)
  ;
}

export const replaceRegex = (code: string, regexs: any = {}) => {
  for(let regex in regexs) {
    let value = regexs[regex];
    let regexp = new RegExp(regex, "g");
    code = code.replace(regexp, value);
  }
  return code;
}

export default replaceImportPathAliases;
