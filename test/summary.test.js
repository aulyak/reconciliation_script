const expect = require('chai').expect;
const summary = require('../summary');
const luxon = require('luxon');
const DateTime = luxon.DateTime;

describe('summary.js tests', async () => {
  describe('summary.summarizeReport() Test', async () => {
    it('output report summary (pass)', async () => {
      const desiredTexts = '1. Date Range: 2021-07-01 - 2021-07-31\n' +
        '2. Source Records Processed: 6\n' +
        '3. Numbers And Types Of Discrepancies: 3\n' +
        '      - mismatch amount: 2\n' +
        '      - not found on bank statement (transaction only): 1\n' +
        '      - not found on transactions (bank statement only): 0\n' +
        '      ';

      const discrepanciesData = [
        {
          Amt: '30',
          Descr: 'D',
          Date: '2021-07-03',
          ID: 'zodo',
          Remarks: 'No matching data on the bank statement'
        },
        {
          Amt: '77',
          Descr: 'F',
          Date: '2021-07-07',
          ID: 'zojm',
          Remarks: 'Different amount found on the bank statement. Found amount: 76'
        },
        {
          Amt: '65',
          Descr: 'G',
          Date: '2021-07-31',
          ID: 'zoml',
          Remarks: 'Different amount found on the bank statement. Found amount: 62'
        }
      ];
      const july2021Source = [
        {Date: '2021-07-01', ID: 'zoap', Amount: '69', Description: 'C'},
        {Date: '2021-07-04', ID: 'zogn', Amount: '86', Description: 'E'},
        {Date: '2021-07-07', ID: 'zojm', Amount: '76', Description: 'F'},
        {Date: '2021-07-31', ID: 'zoml', Amount: '62', Description: 'G'},
        {Date: '2021-07-06', ID: 'zopk', Amount: '66', Description: 'H'},
        {Date: '2021-07-10', ID: 'zovi', Amount: '73', Description: 'J'}
      ];
      const july2021Proxy = [
        {Amt: '69', Descr: 'C', Date: '2021-07-01', ID: 'zoap'},
        {Amt: '30', Descr: 'D', Date: '2021-07-03', ID: 'zodo'},
        {Amt: '86', Descr: 'E', Date: '2021-07-04', ID: 'zogn'},
        {Amt: '77', Descr: 'F', Date: '2021-07-07', ID: 'zojm'},
        {Amt: '65', Descr: 'G', Date: '2021-07-31', ID: 'zoml'},
        {Amt: '66', Descr: 'H', Date: '2021-07-06', ID: 'zopk'},
        {Amt: '73', Descr: 'J', Date: '2021-07-10', ID: 'zovi'}
      ];

      const result = summary.summarizeReport(discrepanciesData, july2021Source, july2021Proxy);

      expect(result).to.equal(desiredTexts);
    });
  });
});