const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const luxon = require('luxon');
const DateTime = luxon.DateTime;

const reconciliation = {
  readCsv: (path) => {
    return new Promise((resolve, reject) => {
      if (path.substr(-3) !== 'csv') reject('wrong file format');
      const results = [];

      fs.createReadStream(path)
        .pipe(csv({}))
        .on('data', (data) => results.push(data))
        .on('end', () => {
          if (!results.length) reject('no data');
          resolve(results);
        })
        .on('error', reject);
    });
  },
  filterJuly2021Only: (data) => {
    return data.filter(item => {
      const date = DateTime.fromFormat(item.Date, 'yyyy-MM-dd');
      return date.month === 7 && date.year === 2021;
    });
  },
  reconcile: (source, proxy) => {
    if (!source || !proxy || !source.length || !proxy.length) throw 'no data';

    const proxyCheck = proxy.map(prx => {
      const relatedSource = source.find(src => src.ID === prx.ID);

      if (!relatedSource) return {...prx, Remarks: 'No matching data on the bank statement'};

      if (relatedSource.Amount !== prx.Amt) return {
        ...prx,
        Remarks: `Different amount found on the bank statement. Found amount: ${relatedSource.Amount}`
      };

      return prx;
    }).filter(item => item.Remarks);

    const sourceCheck = source.map(src => {
      const relatedProxy = proxy.find(prx => src.ID === prx.ID);

      if (!relatedProxy) return {
        Amt: src.Amount,
        Descr: src.Description,
        Date: src.Date,
        ID: src.ID,
        Remarks: 'No matching data on the record of the transactions'
      };

      return src;
    }).filter(item => item.Remarks);

    return [...proxyCheck, ...sourceCheck];
  },
  generateReport: (header, data) => {
    createCsvWriter({
      path: `./outputs/Reconciliation Result (A).csv`,
      header,
    }).writeRecords(data);
  },
};

module.exports = reconciliation;