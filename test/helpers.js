const CONSTANT_PREFIX = "";
const CONSTANT_SUFFIX = "";

function stripPrefixAndSuffix(prefix, suffix, str) {
    return str
        .replace(new RegExp(`^${prefix}`), '')
        .replace(new RegExp(`${suffix}$`), '')
}

const stripConstantPrefixAndSuffix = stripPrefixAndSuffix.bind(null, CONSTANT_PREFIX, CONSTANT_SUFFIX);

module.exports = {
    stripPrefixAndSuffix: stripPrefixAndSuffix,
    stripConstantPrefixAndSuffix: stripConstantPrefixAndSuffix
};