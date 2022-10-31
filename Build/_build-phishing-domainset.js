const psl = require('psl');
const { processFilterRules } = require('./lib/parse-filter.js');

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
    const parsed = psl.parse(domain);

    if (parsed.input === parsed.tld) {
      continue;
    }

    if (line.length > 25) {
      domainCountMap[parsed.domain] ||= 0;
      domainCountMap[parsed.domain] += 1;
    }
  }

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
      console.log('.'+ domain);
    }
  });
})();
