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
elois.price@merepost.com,@@Masuk123$$,0x45cfc6d8079735f87673c2b31a7122504818bba7
wendell.reinger@rover.info,@@Masuk123$$,0x85f4f546a5f0943082c21f09fa5754e89eae3a42
anne.beatty@merepost.com,@@Masuk123$$,0x1b723739a2180315b0c551b01af62d543f02cfbf
archie.rolfson@rover.info,@@Masuk123$$,0x561f7a899daed862d8b7581f6bd5250dbf6a1053
paul.o'reilly@fexbox.org,@@Masuk123$$,0x09a1ffb4111b8ef59a375b7ad73f44e46373f2fc
hassan.kerluke@rover.info,@@Masuk123$$,0x56423956369dc1a853793081d4fb23dbf5104f7a
treasa.lesch@mailto.plus,@@Masuk123$$,0xabafc474bc4839b6f379cc5a25eaa18b547ad4da
francesco.boyer@fexbox.org,@@Masuk123$$,0x1c30df427caa41c697596a1ec9923c87370ea6dd
kimberely.trantow@merepost.com,@@Masuk123$$,0xa2cff94777660e8819c55dd36966ba6608d899c9
ignacia.quitzon@fexbox.org,@@Masuk123$$,0x44998bbededadffd4499b3fba1aa12e38e32569d
wilmer.labadie@mailto.plus,@@Masuk123$$,0xd22fb146cc014c31095e7864cc8a05b25d9291cf
celia.vonrueden@merepost.com,@@Masuk123$$,0x7c43cd6cb9b56ae7839d3849f7a5b7509831efb2
kristofer.spencer@mailto.plus,@@Masuk123$$,0x5e12113ea7814f5a72fd70041cb235a8d883e137
floyd.ondricka@rover.info,@@Masuk123$$,0x421f0925e5c9578e5ccb5c42ee4c5ca9fe6bff48
jayson.mccullough@mailto.plus,@@Masuk123$$,0xca05bbecd00b85b550ade5cc4f731e1558cb7083
roderick.koepp@rover.info,@@Masuk123$$,0x85b1afc001a747800ae4d89421715e489d5cc06a
faustino.cartwright@merepost.com,@@Masuk123$$,0xacc785d96095d48ef23ca94a3933bd0fab1370e2
bao.dach@rover.info,@@Masuk123$$,0xecfc69975cac9264740d234623426ef485b7cc74
jamie.abshire@rover.info,@@Masuk123$$,0x5f764569ffe55474da059b5a626503504d3a6382
helaine.nitzsche@merepost.com,@@Masuk123$$,0xed70537de6328ba13e3756aedc6c5647dab95cd0
jaqueline.schimmel@rover.info,@@Masuk123$$,0x2ad43818bdf41323c95aaf5cd1acdefdcf4f350c
vince.lindgren@merepost.com,@@Masuk123$$,0x9c0ab92ae3b40ab18565594fb1204a8e3dd9c8bb
jonah.kovacek@fexbox.org,@@Masuk123$$,0xb941d2804855661016c110f621bccbc406095e28
rutha.leuschke@merepost.com,@@Masuk123$$,0x3d585408254c880226f809b818cd5eda7f9b6940
shameka.huels@merepost.com,@@Masuk123$$,0xed0ce0f59803021ebdee95841126ac5f4ace9ded
conception.gusikowski@rover.info,@@Masuk123$$,0x5e3e53a53f5b01f2962b42f4d4fb493b1b45197d
kirby.carter@fexbox.org,@@Masuk123$$,0x4188b4d54c5c5f824597905b387f07a9d0a95a10
sherryl.skiles@rover.info,@@Masuk123$$,0x9a6d8f05afeb71a13cf36557d067287f94343be5
dora.krajcik@merepost.com,@@Masuk123$$,0x8eb7195bedc8254b8b09a88768b5f617611b698e
colton.windler@mailto.plus,@@Masuk123$$,0xd52859fbcc446725c7184dde3f973fa1b92cfd05
johnette.skiles@fexbox.org,@@Masuk123$$,0xac1852687dda5d4c14cd9cc542c881a91052ed34
roy.jones@fexbox.org,@@Masuk123$$,0xf445be1c1e8c780ad0fe179b923983b826de5b64
wilber.raynor@fexbox.org,@@Masuk123$$,0x1b999ee890b6a9b827543507f84e1b4746434553
agnus.kilback@rover.info,@@Masuk123$$,0x2edef15c97e2a7fa599eff8da9d3bf46f23b3b8b
modesto.harvey@rover.info,@@Masuk123$$,0x398b9d1c5ddba893acec1ade4a9634e6d093677b
virgil.mills@merepost.com,@@Masuk123$$,0xd66ec387550b6948bc75820135e7a6ed5686be71
benita.dare@fexbox.org,@@Masuk123$$,0xc6692319d5779f6d205722d13b9a622db8c89faa
fausto.mcglynn@fexbox.org,@@Masuk123$$,0xc5f0b90bf13569e09a967e0a49832a618532428d
trent.fritsch@mailto.plus,@@Masuk123$$,0x83c6ca34883938780333170d4bd8b18bd7858d35
chante.marquardt@mailto.plus,@@Masuk123$$,0x211173ace95585a8f5e8153e8ce962735eacf776
pa.walker@fexbox.org,@@Masuk123$$,0x866b36e61b6592424740e4d4e2db10fc348ac3af
ettie.schroeder@rover.info,@@Masuk123$$,0xd1147754446a405cedb3d65f8448e93a4efb3b03
lucio.grady@fexbox.org,@@Masuk123$$,0x191c7ab7404b000d491fe1cd22c4827f8b804803
marilyn.friesen@mailto.plus,@@Masuk123$$,0x486113adcb137c376f6ac7085da1ba7f432fd49b
glynis.mraz@merepost.com,@@Masuk123$$,0x6470bd83b24ca46950bd04fea2097a3f378a0dde
norma.o'hara@merepost.com,@@Masuk123$$,0xb4f5f32040b6a51623435194534116cdf0a3b85f
lynn.bayer@mailto.plus,@@Masuk123$$,0xf8d774527a6d89f56cb27a3c34dee1c7b20391b4
jack.lueilwitz@fexbox.org,@@Masuk123$$,0x713b358e67dc791cfc4e4242417ac3251093c1f9
daisy.quitzon@fexbox.org,@@Masuk123$$,0xd1ceebda192be88cd5d8a15754ea7d568298b0b1
particia.herzog@mailto.plus,@@Masuk123$$,0x74cc473df7e619489065ef3ed092c194aff628fb
gregory.keebler@merepost.com,@@Masuk123$$,0x688f5e540db0b3599f2728362ba8f67916033dc4
buford.murray@mailto.plus,@@Masuk123$$,0x22aa3dbc3ff6ea5c3529b59758969065f74ed25c
fausto.davis@fexbox.org,@@Masuk123$$,0x54250e41818936a95d83df39f85231f15fda53f5
mackenzie.waters@rover.info,@@Masuk123$$,0x7b120f05fe6e4b8c47ac55301dffaf3ce538629e
arianna.corkery@mailto.plus,@@Masuk123$$,0x65c480fc9eab1f13fcc3e453d78d59b94e2c5120
deshawn.o'hara@rover.info,@@Masuk123$$,0xbfe6dcc6eef1e26f5e43f2796d7ebdb42fa0f8e9
leif.langosh@fexbox.org,@@Masuk123$$,0xb9386674eee1d2e0bf632d511f97741b74ec33eb
wade.abshire@mailto.plus,@@Masuk123$$,0xc01e3bb6a490fabe37e8d584540ba26e5f2c1485
cathie.collins@mailto.plus,@@Masuk123$$,0x8551d63cc3c6516f81fe966a60803a02e2654537
janessa.herzog@rover.info,@@Masuk123$$,0x9d4618b5b38d6490bdb7d743fee86de73d50c249
elvie.lindgren@merepost.com,@@Masuk123$$,0x2ea94859be5b215ddd585dcef78a128c1be3ca30
travis.abshire@mailto.plus,@@Masuk123$$,0x22cf3eafc34d1dded9f6c07fa7a83fe81c35adb4
corrina.farrell@mailto.plus,@@Masuk123$$,0xb7176837e95e86bce798c8a69fdc2bfba0817e07
stan.yundt@fexbox.org,@@Masuk123$$,0x91344625f885ed2c39d142047bb265deac3cb50c
glenn.schinner@rover.info,@@Masuk123$$,0xbfb72283e824b85053b54f9555da4a5f7fb442f0
clement.stehr@fexbox.org,@@Masuk123$$,0x585341a4406b1b8ed34be3bcf8d19288cd688a5c
modesta.sauer@mailto.plus,@@Masuk123$$,0x83ddc8f362b3831e607abeac6740f533d1c39f2d
cortez.schuppe@fexbox.org,@@Masuk123$$,0x80cf692c68a0a352ad25cceba44833a2bfde7fd6
debroah.kohler@rover.info,@@Masuk123$$,0x534ed58a79acb3b740c5b657bc0d58f26c8f0990
marcy.murray@rover.info,@@Masuk123$$,0x3e3fe430f8139bbf911a90a9bd04ea63a5159739
rosalva.bartoletti@rover.info,@@Masuk123$$,0x515981fca55a63758f75e4fa87e4955ceb587a52
gerda.waters@rover.info,@@Masuk123$$,0xfa2def6aaa6688a1a68d4e7daf91393dae86f87e
moses.o'kon@merepost.com,@@Masuk123$$,0x679431a278147986f46977d3c3fc67d11a8f1b64
cornelia.hodkiewicz@rover.info,@@Masuk123$$,0xcca4241e1162f73ff8ba752ac935e0d455fded17
necole.o'conner@merepost.com,@@Masuk123$$,0xe60bad402d9010577b2e67eebb785c8633a290d4
elwood.mueller@merepost.com,@@Masuk123$$,0x65fe9eda7e230cd0667643e27b021dea85621725
mohammad.rogahn@mailto.plus,@@Masuk123$$,0x703a6a2106c8f376b5873ffac0ba476c4e605c1c
tifany.koch@rover.info,@@Masuk123$$,0x9fddf02692029350e41e758aad21bd516e4907d1
idella.becker@rover.info,@@Masuk123$$,0x4a355093d256bd8c1e853953e804b70d320d56fe
travis.hahn@rover.info,@@Masuk123$$,0xc6a835fadaef4fee94bd31c76bb30e1cca774d97
perry.schuppe@rover.info,@@Masuk123$$,0x1149ef3e9ee7f82715a58aa041b8514c06f8c772
joshua.sporer@merepost.com,@@Masuk123$$,0xeb62cb8690a06b3cf352cacbe539325d10728d43
pamella.carter@fexbox.org,@@Masuk123$$,0xcbe6cf68bf1a8c44a3e447d4724cde9c46c688f2
stephanie.lueilwitz@merepost.com,@@Masuk123$$,0xc2f21b45de699053505a25aae465c6c69e1eada7
jerold.padberg@merepost.com,@@Masuk123$$,0x48650772b1c5f577bb98b344bf6198494844fe3f
fermina.rippin@mailto.plus,@@Masuk123$$,0x2bc8f074d03d852d63248e79bd8941000535543e
wilber.botsford@mailto.plus,@@Masuk123$$,0xf08e26b53663b8fec8dc2f514a3b0ab0a5d033b3
alberta.erdman@merepost.com,@@Masuk123$$,0x573b7cbe1dd7b2e8e72bd07352ac4191e957d4c2
maribeth.ortiz@rover.info,@@Masuk123$$,0x19e8ff2cce117df70e84cdbb0df100fc04913f09
stephen.cummerata@merepost.com,@@Masuk123$$,0xaabd2ad8ca985b3c9585e429a2993aa5909d089d
ursula.cormier@rover.info,@@Masuk123$$,0xdeb1818eb08174bf53c5657b94b6a8a3ceabd071
peter.leuschke@mailto.plus,@@Masuk123$$,0x3eba85ba1ec0b79c9036f8538c44bc90fc002950
georgiann.ortiz@mailto.plus,@@Masuk123$$,0xa2c5892c38d7bd73a4c1f07d19e4ef6089762e92
tobie.bednar@rover.info,@@Masuk123$$,0x833209513ff5e04a31d793e700d5f17840c92ea8
arnita.upton@rover.info,@@Masuk123$$,0xe758c117263446df2a1d1acd48d18bd0b8a70a6d
wesley.lakin@merepost.com,@@Masuk123$$,0xe2b883bdfb8f77b19ffe768bec4ea48f75d3634a
jimmy.ebert@mailto.plus,@@Masuk123$$,0x003ddd6b1aa02d78634fd58f881a8f9b83de41a5
yan.lehner@fexbox.org,@@Masuk123$$,0x0f6f6487b966fb3ec28e658620501cd06e21422e
eugene.morissette@rover.info,@@Masuk123$$,0xa990f664496ffe8623a08dc6245f1a06604c8c76
lillia.rau@merepost.com,@@Masuk123$$,0x107c579f8a683efdc4523ec7c3a16146358bc048

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
