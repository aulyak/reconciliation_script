const expect = require('chai').expect;
const reconciliation = require('../reconciliation');
const luxon = require('luxon');
const DateTime = luxon.DateTime;

describe('reconciliation.js tests', async () => {
  describe('reconcile.readCsv() Test', () => {
    it('allow csv format', async () => {
      const result = await reconciliation.readCsv('./recon_data/source.csv');
      expect(result).to.be.an('array').that.has.lengthOf.to.not.equal(0);
    });
    it('reject other format', async () => {
      let result;
      try {
        result = await reconciliation.readCsv('./recon_data/test wrong format.txt');
      } catch (error) {
        result = error;
      }

      expect(result).to.equal('wrong file format');
    });
    it('reject empty csv file', async () => {
      let result;
      try {
        result = await reconciliation.readCsv('./recon_data/test empty.csv');
      } catch (error) {
        result = error;
      }

      expect(result).to.equal('no data');
    });
  });

  describe('reconcile.filterJuly2021Only() Test', async () => {
    it('check july only', async () => {
      const data = [
        {Date: '2021-06-30', ID: 'zoUr', Amount: '24', Description: 'A'},
        {Date: '2021-06-30', ID: 'zoXq', Amount: '11', Description: 'B'},
        {Date: '2021-07-01', ID: 'zoap', Amount: '69', Description: 'C'},
        {Date: '2021-07-04', ID: 'zogn', Amount: '86', Description: 'E'},
        {Date: '2021-07-07', ID: 'zojm', Amount: '76', Description: 'F'},
        {Date: '2021-07-31', ID: 'zoml', Amount: '62', Description: 'G'},
        {Date: '2021-07-06', ID: 'zopk', Amount: '66', Description: 'H'},
        {Date: '2021-08-01', ID: 'zosj', Amount: '56', Description: 'I'},
        {Date: '2021-07-10', ID: 'zovi', Amount: '73', Description: 'J'}
      ];

      const result = await reconciliation.readCsv('./recon_data/source.csv');
      const checkBesidesJuly = result.find(item => DateTime.fromISO(item.Date).month !== 7);

      expect(checkBesidesJuly).to.not.be.an('undefined');
    });
  });

  describe('reconcile.reconcile() Test', async () => {
    it('test reconcile', () => {
      const source = [
        {Date: '2021-06-30', ID: 'zoUr', Amount: '24', Description: 'A'},
        {Date: '2021-06-30', ID: 'zoXq', Amount: '11', Description: 'B'},
        {Date: '2021-07-01', ID: 'zoap', Amount: '69', Description: 'C'},
        {Date: '2021-07-04', ID: 'zogn', Amount: '86', Description: 'E'},
        {Date: '2021-07-07', ID: 'zojm', Amount: '76', Description: 'F'},
        {Date: '2021-07-31', ID: 'zoml', Amount: '62', Description: 'G'},
        {Date: '2021-07-06', ID: 'zopk', Amount: '66', Description: 'H'},
        {Date: '2021-08-01', ID: 'zosj', Amount: '56', Description: 'I'},
        {Date: '2021-07-10', ID: 'zovi', Amount: '73', Description: 'J'}
      ];

      const proxy = [
        {Amt: '24', Descr: 'A', Date: '2021-06-30', ID: 'zoUr'},
        {Amt: '11', Descr: 'B', Date: '2021-06-30', ID: 'zoXq'},
        {Amt: '69', Descr: 'C', Date: '2021-07-01', ID: 'zoap'},
        {Amt: '30', Descr: 'D', Date: '2021-07-03', ID: 'zodo'},
        {Amt: '86', Descr: 'E', Date: '2021-07-04', ID: 'zogn'},
        {Amt: '77', Descr: 'F', Date: '2021-07-07', ID: 'zojm'},
        {Amt: '65', Descr: 'G', Date: '2021-07-31', ID: 'zoml'},
        {Amt: '66', Descr: 'H', Date: '2021-07-06', ID: 'zopk'},
        {Amt: '56', Descr: 'I', Date: '2021-08-01', ID: 'zosj'},
        {Amt: '73', Descr: 'J', Date: '2021-07-10', ID: 'zovi'}
      ];

      const discrepanciesData = reconciliation.reconcile(source, proxy);

      expect(discrepanciesData).to.deep.equal([
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
      ]);
    });

    it('throw error on no data', () => {
      const source = [
      ];

      const proxy = [
      ];

      try {
        const discrepanciesData = reconciliation.reconcile(source, proxy);
      } catch (error) {
        expect(error).to.equal('no data');
      }
    });

  });
});