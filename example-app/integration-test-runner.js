const puppeteer = require('puppeteer');
const tape = require('tape');
const path = require('path');

let browser;
let page;

const EXPECTED_META_TEST_OUTPUT = [{
  type: 'test',
  name: 'meta test, this test runs after all the other tests',
  id: 0
}, {
  id: 0,
  ok: true,
  name: 'crashTestSync tests should pass',
  operator: 'equal',
  objectPrintDepth: 5,
  actual: 2,
  expected: 2,
  test: 0,
  type: 'assert'
}, {
  id: 1,
  ok: true,
  name: 'crashTestAsync tests should pass',
  operator: 'equal',
  objectPrintDepth: 5,
  actual: 2,
  expected: 2,
  test: 0,
  type: 'assert'
}, {
  id: 2,
  ok: true,
  name: 'promiseTests tests should pass',
  operator: 'equal',
  objectPrintDepth: 5,
  actual: 15,
  expected: 15,
  test: 0,
  type: 'assert'
}, {
  id: 3,
  ok: true,
  name: 'syncTest1 tests should pass',
  operator: 'equal',
  objectPrintDepth: 5,
  actual: 6,
  expected: 6,
  test: 0,
  type: 'assert'
}, {
  id: 4,
  ok: true,
  name: 'syncTest2 tests should pass',
  operator: 'equal',
  objectPrintDepth: 5,
  actual: 14,
  expected: 14,
  test: 0,
  type: 'assert'
}, {
  id: 5,
  ok: true,
  name: 'classNameAndLoaderTests tests should pass',
  operator: 'equal',
  objectPrintDepth: 5,
  actual: 10,
  expected: 10,
  test: 0,
  type: 'assert'
}, {
  id: 6,
  ok: true,
  name: 'metaTriggeredTest tests should pass',
  operator: 'equal',
  objectPrintDepth: 5,
  actual: 2,
  expected: 2,
  test: 0,
  type: 'assert'
}, {
  type: 'end',
  test: 0
}];

tape('Meta-testing results', t => {
  puppeteer.launch({headless: true})
  .then(newBrowser => {
    browser = newBrowser;
    return browser.newPage();
  })
  .then(newPage => {
    page = newPage;
    return page.goto(`file://${path.resolve('./example-app/index.html')}`);
  })
  .then(() => page.waitForSelector('.meta-test .tap-react-browser--done', {timeout: null, visible: true}))
  .then(res => page.evaluate(() => document.TapReactBrowserTestResults))
  .then(results => {
    EXPECTED_META_TEST_OUTPUT.forEach((testSection, idx) => {
      const result = results[idx];
      const msg = `${result.name || `${result.type} should be placed correctly`}`;
      t.deepEqual(result, testSection, msg);
    });
    return;
  })
  .then(() => browser.close())
  .then(() => t.end());
});
