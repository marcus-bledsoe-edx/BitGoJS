const { readdir } = require('fs').promises;

module.exports = {
  extends: ['@commitlint/config-conventional'],
  ignores: [
    (commit) => /^Merge commit '[a-f0-9]{40}'$/m.test(commit),
  ],
  rules: {
    'scope-enum': async () => [2, 'always', (await readdir('modules')).concat('root')],
    'references-empty': [
      2,
      'never',
    ],
  },
  parserPreset: {
    parserOpts: {
      issuePrefixes: [
        "BG-",
        "BMF-",
        "BOS-",
        "BT-",
        "BTC-",
        "CLEX-",
        "COPS-",
        "CP-",
        "CR-",
        "CS-",
        "DES-",
        "DO-",
        "DOS-",
        "EA-",
        "ERC20-",
        "FAC-",
        "GRC-",
        "HSM-",
        "INC-",
        "IR-",
        "IS-",
        "ITHD-",
        "ITOPS-",
        "MD-",
        "PB-",
        "POL-",
        "PX-",
        "QA-",
        "RA-",
        "SO-",
        "ST-",
        "STLX-",
        "TRUST-",
        "VL-",
        "WP-",
        '#', // Prefix used by GitHub issues
      ],
    },
  },
};
