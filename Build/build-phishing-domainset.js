const psl = require('psl');
const { processFilterRules } = require('./lib/parse-filter.js');
const fs = require('fs');
const path = require('path');

(async () => {
  const domainSet = Array.from(
    (
      await processFilterRules('https://curbengh.github.io/phishing-filter/phishing-filter-agh.txt')
    ).black
  );
  const domainCountMap = {};

  for (let i = 0, len = domainSet.length; i < len; i++) {
    const line = domainSet[i];
    // starts with #
    if (line.charCodeAt(0) === 35) {
      continue;
    }
    if (line.trim().length === 0) {
      continue;
    }

    const domain = line.charCodeAt(0) === 46 ? line.slice(1) : line;

    if (line.length > 25) {
      const parsed = psl.parse(domain);

      if (parsed.input === parsed.tld) {
        continue;
      }

      domainCountMap[parsed.domain] ||= 0;
      domainCountMap[parsed.domain] += 1;
    }
  }

  const results = [];

  Object.entries(domainCountMap).forEach(([domain, count]) => {
    if (
      count > 10
      && (
        domain.endsWith('.xyz')
        || domain.endsWith('.top')
        || domain.endsWith('.icu')
        || domain.endsWith('.win')
        || domain.endsWith('.shop')
        || domain.endsWith('.cyou')
      )
    ) {
      results.push('.' + domain);
    }
  });

  const filePath = path.resolve(__dirname, '../List/domainset/reject_phishing.conf');
  await fs.promises.writeFile(filePath, results.join('\n'), 'utf-8');
})();
