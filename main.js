const reconciliation = require('./reconciliation');
const summary = require('./summary');

(async () => {
  let source, proxy;

  try {
    [source, proxy] = await Promise.all([
      reconciliation.readCsv('./recon_data/source.csv'),
      reconciliation.readCsv('./recon_data/proxy.csv')
    ]);
  } catch (error) {
    console.log({error});
    throw (error);
  }

  const july2021Source = reconciliation.filterJuly2021Only(source);
  const july2021Proxy = reconciliation.filterJuly2021Only(proxy);

  const discrepanciesData = reconciliation.reconcile(july2021Source, july2021Proxy);
  const discrepanciesHeaders = Object.keys(discrepanciesData[0]).map(key => ({id: key, title: key}));

  reconciliation.generateReport(discrepanciesHeaders, discrepanciesData);
  const summerizedReportText = summary.summarizeReport(discrepanciesData, july2021Source, july2021Proxy);
  summary.generateReportSummary(summerizedReportText);
})();