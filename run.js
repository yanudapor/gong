const bluebird = require("bluebird");
const fs = require("fs");
const AWS = require("aws-sdk");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;
const puppeteer = require("puppeteer-extra");
const useProxy = require("@stableproxy/puppeteer-page-proxy");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

const IDRIVE_ENPOINT = "d4b6.or4.idrivee2-60.com";
const IDRIVE_ACCESS_KEY_ID = "5ce3lLJdmdBVLqcX7RPD";
const IDRIVE_SECRET_ACCESS_KEY = "a6USwSGtrxBDlV2n19XUJWcMt69ivtpu5zm63Hfi";
const BUCKET_NAME = "alchemy-dwi-cookies";

const CONCURENCY = 2;
const HEADLESS = false; // HEADLESS  false or false;

const USE_PROXY = false;
const PROTOCOL = "http";
const PROXY_HOST = "gate.smartproxy.com";
const PROXY_PORT = "7000";
const PROXY_USERNAME = "spoj3coqzt";
const PROXY_PASSWORD = "ttZaB35y17tG~Ocsdw";

const dataAccount = `
valery.mueller@fexbox.org,@@Masuk123$$,0x06dc45d8c497c6edd2d1229c5bc6f2bac91febf3
taisha.kilback@merepost.com,@@Masuk123$$,0x678f7d0ef2c73f318ed97f366d4f4f5d2d8d3e86
haywood.collier@mailto.plus,@@Masuk123$$,0xf1d49f9bcf78bb33eb04a2dfce273f06b51d885a
krystle.hagenes@merepost.com,@@Masuk123$$,0xa4ea57df356acb7383c49eddd19a52d82d40810e
jenny.keebler@mailto.plus,@@Masuk123$$,0x65d6cd060a58231b9ca5be5328d898ae53498651
song.weissnat@merepost.com,@@Masuk123$$,0x3ce2602bb439b018949ce913e05a65e9ac94c73f
chester.skiles@rover.info,@@Masuk123$$,0x871a9dca9ea6e40fd02ce05a82a831547b467762
todd.effertz@fexbox.org,@@Masuk123$$,0x2a12b75a9286f5a2d9dc6a342901958a8f52bec1
elsie.jaskolski@mailto.plus,@@Masuk123$$,0xecdc5cd865f66db2ed80b2b211efa3d682e1babd
erline.nolan@mailto.plus,@@Masuk123$$,0x048b419d8771349c2a594614e41b2f6fc7e69beb
jarred.daniel@merepost.com,@@Masuk123$$,0x08d0a411de08470272a770e76838fe6f91012b4e
edwin.crona@mailto.plus,@@Masuk123$$,0x022a8243cffe0fef7c8b90418d09c75c7c689ae9
ricky.walsh@fexbox.org,@@Masuk123$$,0x76fda2a5a0d55bd714ce4aa86dfd3c9602064780
logan.conroy@rover.info,@@Masuk123$$,0x667800542cafcd3816ea0f219722606cc6388076
pasquale.runolfsdottir@fexbox.org,@@Masuk123$$,0xb598e311152f4bed324490d6ad94ba31ae16fafb
dannie.hauck@fexbox.org,@@Masuk123$$,0xe00ba53d6eaadedfe6ef892f897bde2a88234822
edmundo.beahan@rover.info,@@Masuk123$$,0x31ae1bd668b44a992bdd57e1866d8a69889d0bfe
bobbie.pagac@mailto.plus,@@Masuk123$$,0xfdcb4d567ce458749740262b3953828f387fba1e
emma.grant@fexbox.org,@@Masuk123$$,0x107618e8f2b36c23fbbffa9d532562f95deae494
demetria.bednar@mailto.plus,@@Masuk123$$,0x552ff1450ff257ef691bd9fc4a2eb46ce769dd82
sharika.cartwright@mailto.plus,@@Masuk123$$,0x102b628997f95f5d9fbc6404a7d5e6e2aa6b2ddf
christoper.russel@fexbox.org,@@Masuk123$$,0x310ff44aec72a7d760ad438273d58b31bb571c16
willis.beier@merepost.com,@@Masuk123$$,0x1b3461d8bdd47c63eff9fbf85676b8accccb56a6
myriam.sporer@merepost.com,@@Masuk123$$,0x8732adcd76900e4fc9a04c807c26b414c1ffd67b
lizbeth.mann@merepost.com,@@Masuk123$$,0xe739f76d37a898b977f94c945666057883bdddab
josh.schowalter@rover.info,@@Masuk123$$,0x50e41cdb9fa4b436a037eed979c3dd2787175dab
beatriz.jones@fexbox.org,@@Masuk123$$,0x054a83249e19888a694f7b5a303021be7103fe35
kamala.buckridge@fexbox.org,@@Masuk123$$,0x00fef22a68405f85a9b2350544d314e859eb28a4
tova.ward@merepost.com,@@Masuk123$$,0xb7fa75a9ea04993ae8179a54a4bbb26c491ce7a6
refugia.kertzmann@fexbox.org,@@Masuk123$$,0x216984b71aa1a73aca519d9678a5341b9374ccb4
lovetta.rutherford@rover.info,@@Masuk123$$,0xf98a7b27180e3d335f661e26bc273a72ee0edc05
leon.lebsack@rover.info,@@Masuk123$$,0x02fed750bbf9cdf9c0b0fee8d0dd5c2217093916
shawnee.weber@merepost.com,@@Masuk123$$,0x9d507edfc997fd1e819154341c96293fba286d8b
hunter.bayer@merepost.com,@@Masuk123$$,0x0a19c3b6846a917738f58893902aa6c1c21a77aa
tamekia.emmerich@merepost.com,@@Masuk123$$,0x02c04150c23f56bfa951e8bab85253d11c07209a
cori.dare@rover.info,@@Masuk123$$,0x102b1e326344e32662de24c2489df047c14288c7
deena.stokes@merepost.com,@@Masuk123$$,0xd07d181853386267d54738f591369971d1c5ae07
jennine.senger@merepost.com,@@Masuk123$$,0x2d35a5b4172081f13f286b25c561f5104dbca6e8
jamee.bahringer@rover.info,@@Masuk123$$,0xf7d70ad64c48e4478e7bac3eb92e013231733b6f
vincenzo.schmitt@mailto.plus,@@Masuk123$$,0x4e4a5a90f7d5b0579a1d9c155c78eca1b2129415
gary.murazik@rover.info,@@Masuk123$$,0xae34abeeb846c45390558e31dfbd352ce2ba6f30
nelida.labadie@merepost.com,@@Masuk123$$,0x6cc9375bf64cb9e3d9a4d3012370c420dbd87711
patience.von@merepost.com,@@Masuk123$$,0x3d2dea72c418cc983536fcc96b2286a0d4ca1d9a
mikki.collins@mailto.plus,@@Masuk123$$,0x2b604773aa78e15c27030b12040ae49ec14f076f
joe.hamill@rover.info,@@Masuk123$$,0x010de4d6a8ec9d4d27bb2cf5e46d5a10367e2c2f
glenn.vandervort@fexbox.org,@@Masuk123$$,0xbff550567808b67f2b478c298cd1effd78960550
leonardo.rippin@rover.info,@@Masuk123$$,0x3952dd9b282d817c07d71569778cb96b6bf32e23
rusty.mitchell@merepost.com,@@Masuk123$$,0xb09c5989b7bc59767ee8f3fc19029768b4031ef4
katy.howe@mailto.plus,@@Masuk123$$,0x2ee913a36a2fdaca418b5822f80c1f391146db63
alethia.boyle@mailto.plus,@@Masuk123$$,0xb9d13f7a59269ddd8adbdea160636678b7f43827
`;

const waiting = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

const getData = (data, start, end) => {
  const splitData = data.split(/\r?\n/).filter((n) => n);
  const sliceData = splitData.slice(start, end);
  return sliceData;
};

const s3 = () => {
  const endpoint = new AWS.Endpoint(IDRIVE_ENPOINT);
  const s3 = new AWS.S3({
    endpoint: endpoint,
    accessKeyId: IDRIVE_ACCESS_KEY_ID,
    secretAccessKey: IDRIVE_SECRET_ACCESS_KEY,
  });

  return s3;
};

const existsBucket = async (bucketName) => {
  try {
    await listObjects(bucketName);

    return true;
  } catch (err) {
    if (err.code == "NoSuchBucket") {
      return false;
    } else {
      throw err;
    }
  }
};

const listObjects = (bucketName) => {
  return new Promise((resolve, reject) => {
    const data = {
      Bucket: bucketName,
    };

    s3().listObjects(data, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const getObject = (bucketName, fileName) => {
  return new Promise((resolve, reject) => {
    const data = {
      Bucket: bucketName,
      Key: fileName,
    };

    s3().getObject(data, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const createObject = async (obj, bucketName, fileName) => {
  const buf = Buffer.from(JSON.stringify(obj));

  return new Promise((resolve, reject) => {
    const data = {
      Bucket: bucketName,
      Key: fileName,
      Body: buf,
      ContentEncoding: "base64",
      ContentType: "application/json",
      ACL: "private",
    };

    s3().upload(data, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const checkExistsObject = async (bucketName, fileName) => {
  try {
    await getObject(bucketName, fileName);

    return true;
  } catch (err) {
    if (err && (err.code == "NoSuchKey" || err.code == "NoSuchBucket"))
      return false;
  }
};

const saveCookies = async (page, cookieFile) => {
  const session = await page.target().createCDPSession();
  const reaponseCookies = await session.send("Network.getAllCookies");

  await session.detach();
  await createObject(reaponseCookies.cookies, BUCKET_NAME, cookieFile);
};

const loadCookies = async (page, cookieFile) => {
  const session = await page.target().createCDPSession();
  const cookies = JSON.parse(cookieFile);
  await session.send("Network.setCookies", {
    cookies: cookies,
  });
  await session.detach();
};

const retryElement = async (page, element, xpath = false, retryCount = 2) => {
  try {
    if (xpath) {
      return await page.waitForXPath(element, { timeout: 8000 });
    } else {
      return await page.waitForSelector(element, { timeout: 8000 });
    }
  } catch (err) {
    if (retryCount <= 0) {
      throw err;
    }
    const currentUrl = await page.url();
    await page.goto(currentUrl, { waitUntil: "networkidle2" });

    return await retryElement(page, element, (xpath = false), retryCount - 1);
  }
};

const launchBrowser = async () => {
  try {
    let browser;

    let args = [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-notifications",
      "--no-first-run",
      "--disable-gpu",
      // "--start-maximized",
      "--disable-infobars",
      "--disable-web-security",
      "--ignore-certificate-errors",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-features=IsolateOrigins,site-per-process,SitePerProcess",
      "--flag-switches-begin --disable-site-isolation-trials --flag-switches-end",
    ];

    const proxyHost = `${PROTOCOL}://${PROXY_HOST}:${PROXY_PORT}`;

    USE_PROXY ? args.push(`--proxy-server=${proxyHost}`) : null;

    let browserOptions = {
      executablePath: process.env.PUPPETEER_EXEC_PATH,
      headless: HEADLESS,
      ignoreHTTPSErrors: true,
      acceptInsecureCerts: true,
      defaultViewport: null,
      args: args,
    };

    browser = await puppeteer.launch(browserOptions);
    const context = browser.defaultBrowserContext();

    context.overridePermissions("https://auth.alchemy.com", [
      "geolocation",
      "notifications",
    ]);
    context.overridePermissions("https://www.alchemy.com", [
      "geolocation",
      "notifications",
    ]);

    const [page] = await browser.pages();

    if (USE_PROXY) {
      await page.authenticate({
        username: PROXY_USERNAME,
        password: PROXY_PASSWORD,
      });
    }

    await page.setRequestInterception(true);
    const rejectRequestPattern = [
      "googlesyndication.com",
      "/*.doubleclick.net",
      "/*.amazon-adsystem.com",
      "/*.adnxs.com",
      "/*.ads.net",
    ];
    const blockList = [];
    page.on("request", (request) => {
      if (
        rejectRequestPattern.find((pattern) => request.url().match(pattern))
      ) {
        blockList.push(request.url());
        request.abort();
      } else request.continue();
    });

    return { page, browser };
  } catch (err) {
    console.log(`Browser ${err}`);
  }
};

const login = async (page, email, password) => {
  try {
    await page.goto("https://www.alchemy.com/faucets/arbitrum-sepolia", {
      waitUntil: "networkidle2",
    });

    const cookieFile = `${email}.json`;

    const isExistCookies = await checkExistsObject(BUCKET_NAME, cookieFile);

    if (isExistCookies) {
      const getCookies = await getObject(BUCKET_NAME, cookieFile);
      const cookies = getCookies.Body.toString("utf-8");
      await loadCookies(page, cookies);
    }

    await waiting(5000);

    const logoutButtonElm = await page.$$eval("button", (button) => {
      const logoutButton = button.find(
        (btn) => btn.textContent.trim() == "Logout"
      );

      if (logoutButton) {
        return true;
      }

      return false;
    });

    if (logoutButtonElm) {
      return true;
    }

    await page.$$eval("button", (button) => {
      const loginButton = button.find(
        (btn) => btn.textContent.trim() == "Alchemy Login"
      );

      if (loginButton) {
        loginButton.focus();
        loginButton.click();
      }
    });

    await waiting(10000);

    try {
      await retryElement(page, 'input[type="email"]');

      const inputUser = await page.$('input[type="email"]');
      await page.evaluate((user) => {
        user.focus();
        user.click();
      }, inputUser);
      await page.keyboard.type(email);

      const inputPass = await page.$('input[type="password"]');
      await page.evaluate((pass) => {
        pass.focus();
        pass.click();
      }, inputPass);
      await page.keyboard.type(password);

      await page.waitForSelector('button[type="submit"]');
      const buttonLogin = await page.$('button[type="submit"]');

      await page.evaluate((login) => {
        login.click();
      }, buttonLogin);

      await waiting(15000);

      await saveCookies(page, cookieFile);
    } catch (err) {}

    return true;
  } catch (err) {
    console.log(`[${email}] - Login error ${err}`);
  }
};
const claimFoucet = async (page, email, wallet) => {
  let success = false;
  let retry = 0;
  let maxTry = 3;
  let message = "";

  try {
    while (!success && retry <= maxTry) {
      await waiting(2000);

      await retryElement(page, 'form input[type="text"]');
      const walletInputElm = await page.$('form input[type="text"]');

      await page.evaluate((walletInput) => {
        walletInput.focus();
        walletInput.click();
      }, walletInputElm);

      await page.keyboard.down("Control");
      await page.keyboard.press("A");
      await page.keyboard.up("Control");
      await page.keyboard.press("Backspace");
      await page.keyboard.sendCharacter(wallet);

      await page.waitForXPath('//div/button[contains(., "Send Me ETH")]');

      const [sendButtonElm] = await page.$x(
        '//div/button[contains(., "Send Me ETH")]'
      );

      await waiting(2000);

      await sendButtonElm.click();

      await waiting(4000);

      const successClaimElm = await page.$x(
        '//*[@id="root"]/div[1]/div[2]/div[3]/div[2]/div/div[2]/div/div[2]'
      );

      if (successClaimElm !== "undefined" && successClaimElm.length > 0) {
        console.log(`[${email}] - BERHASIL CLAIM ARBIT !!`);
        success = true;
        return true;
      } else {
        const [spanMessageElm] = await page.$x('//div[@role="alert"]/span');

        let textMessage = await page.evaluate(
          (element) => element.textContent.trim(),
          spanMessageElm
        );

        message = textMessage;

        retry++;

        await waiting(3000);
      }
    }

    console.log(`[${email}] - GAGAL CLAIM ARBIT ${message}`);
    return true;
  } catch (err) {
    console.log(`[${email}] - TERJADI ERROR: ${err}`);
  }
};

const bot = async (page, account) => {
  let success = false;
  try {
    await page.bringToFront();
    const client = await page.target().createCDPSession();
    await client.send("Network.clearBrowserCookies");
    await client.send("Network.clearBrowserCache");
    await client.send("Page.enable");
    await client.send("Page.setWebLifecycleState", { state: "active" });

    const data = account.split(",");
    const email = data[0];
    const password = data[1];
    const wallet = data[2];

    const sigin = await login(page, email, password);

    if (sigin) {
      success = await claimFoucet(page, email, wallet);
    }

    return success;
  } catch (err) {
    console.log(err);
  }
};
(async () => {
  const args = process.argv;

  // const startData = parseInt(args[2]);
  // const endData = parseInt(args[3]);

  // if (!startData && !endData) {
  //   console.log(`Params require "node run.js 0 5"`);
  //   process.exit();
  // }

  // For github action
  const rangeDate = process.env.RANGE_INDEX;
  const splitDate = rangeDate.split(",");
  const startData = splitDate[0];
  const endData = splitDate[1];

  const accounts = getData(dataAccount, startData, endData);

  return bluebird.map(
    accounts,
    async (account) => {
      const { page, browser } = await launchBrowser();

      try {
        await bot(page, account);
      } catch (err) {
        await browser.close();
      }

      await browser.close();
    },
    { concurrency: CONCURENCY }
  );
})();
