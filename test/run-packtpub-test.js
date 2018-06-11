const sandbox = require(`sinon`).createSandbox();
const mocha = require(`mocha`);
let expect = require("chai").expect;
let mock = require("mock-require");

describe(`run-packtpub`, () => {
  before(() => {
    var telegram_on_text = sandbox.stub();
    this.telegram_on_text = telegram_on_text;
    this.mock_cron = {
      CronJob: sandbox.stub()
    };
    this.mock_request = sandbox.stub();
    this.mock_telegram_bot = function(token, obj) {
      this.token = token;
      this.obj = obj;
      return {
        onText: telegram_on_text
      };
    };
    mock("node-telegram-bot-api", this.mock_telegram_bot);
    mock("cron", this.mock_cron);
    mock("request", this.mock_request);
    require(`../run-packtpub`);
  });

  after(() => {
    sandbox.restore();
    mock.stopAll();
  });

  describe(`basic loading`, () => {
    it("can be loaded", () => {
      expect(true).to.equal(true);
    });
  });

  describe(`CronJob`, () => {
    it("can be called", () => {
      expect(this.mock_cron.CronJob.called).to.equal(true);
    });
    it("a callback was passed", () => {
      var callback = this.mock_cron.CronJob.args[0][1];
      expect(callback).to.be.a("Function");
    });
    it("a callback can be called", () => {
      var callback = this.mock_cron.CronJob.args[0][1];
      callback();
      expect(true).to.equal(true);
    });
  });
  describe(`TelegramBot`, () => {
    it("onText called", () => {
      expect(this.telegram_on_text.called).to.equal(true);
    });
    it("a callback was passed", () => {
      var callback = this.telegram_on_text.args[0][1];
      expect(callback).to.be.a("Function");
    });
    it("a callback can be called", () => {
      var callback = this.telegram_on_text.args[0][1];
      callback();
      expect(true).to.equal(true);
    });
  });
});
