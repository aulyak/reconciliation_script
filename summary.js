const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const luxon = require('luxon');
const DateTime = luxon.DateTime;

const summary = {
  summarizeReport: (discrepanciesData, source, proxy) => {
    const sortedProxy = summary.sortDataByDate(proxy);
    const fromDate = sortedProxy[0].Date;
    const toDate = sortedProxy[sortedProxy.length - 1].Date;

    const numOfSourceProcessed = source.length;
    const numOfMismatchAmount = discrepanciesData.filter(
      item => item.Remarks.includes('Different')
    );
    const numOfNotFoundOnBankStatement = discrepanciesData.filter(
      item => item.Remarks === 'No matching data on the bank statement'
    );
    const numOfNotFoundOnTransactions = discrepanciesData.filter(
      item => item.Remarks === 'No matching data on the record of the transactions'
    );

    const dateRange = `1. Date Range: ${fromDate} - ${toDate}\n`;
    const sourceProcessed = `2. Source Records Processed: ${numOfSourceProcessed}\n`;
    const numAndDiscrepanciesTypes = `3. Numbers And Types Of Discrepancies: ${discrepanciesData.length}
      - mismatch amount: ${numOfMismatchAmount.length}
      - not found on bank statement (transaction only): ${numOfNotFoundOnBankStatement.length}
      - not found on transactions (bank statement only): ${numOfNotFoundOnTransactions.length}
      `;

    return dateRange + sourceProcessed + numAndDiscrepanciesTypes;

  },
  sortDataByDate: (data) => {
    const compare = (a, b) => {
      if (
        DateTime.fromFormat(a.Date, 'yyyy-MM-dd')
        < DateTime.fromFormat(b.Date, 'yyyy-MM-dd')
      ) {
        return -1;
      }

      if (
        DateTime.fromFormat(a.Date, 'yyyy-MM-dd')
        > DateTime.fromFormat(b.Date, 'yyyy-MM-dd')
      ) {
        return 1;
      }

      return 0;
    };

    return [...data].sort(compare);
  },
  generateReportSummary: (data) => {
    fs.writeFileSync('./outputs/Summary Report (B).txt', data);
  },
};

module.exports = summary;