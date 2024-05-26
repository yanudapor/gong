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
bertram.wuckert@merepost.com,@@Masuk123$$,0xf82b485c638644968e175446729c02ac9382a053
lavera.crist@rover.info,@@Masuk123$$,0xc4df00f9641e9bcd10636d2d8891cb1d3231d83a
samual.pollich@mailto.plus,@@Masuk123$$,0x0d8b953215ca7b85bc150b47e4c00570571c4a14
amy.swaniawski@mailto.plus,@@Masuk123$$,0x42e777be43401e60b14fd1baf5c7dd2926c08fe5
myra.hahn@fexbox.org,@@Masuk123$$,0xe02beb21b95e5f667bf365e421424f178dbb06a7
shae.marquardt@merepost.com,@@Masuk123$$,0xf4b1abcb717dd11048e4248288a348dca24e60f2
johnny.ullrich@merepost.com,@@Masuk123$$,0x0f1cace2c2dfaee196edd6a40751ea8cd0518dee
hollis.abernathy@fexbox.org,@@Masuk123$$,0x189270fc0237d78d1f3185eb04f348eae34b87cd
virgil.ullrich@merepost.com,@@Masuk123$$,0xe012b62e063e30235d2651c999a3cdcb382d489c
stephen.howell@fexbox.org,@@Masuk123$$,0x4c74095275b9df56d32d5b23b75fe17ea9fb58b2
carrol.fadel@merepost.com,@@Masuk123$$,0x2432d4aa340329c3f3e3d4c225e0ff1966a0a8fa
florentino.hodkiewicz@rover.info,@@Masuk123$$,0x3484a95273e489320a2264d8b28e8ea0a292e37b
rocky.kemmer@merepost.com,@@Masuk123$$,0x876f22e60f1c96198e95885138214e6f88ca062f
sydney.murphy@merepost.com,@@Masuk123$$,0x9506a0d367802e3977addac12407e05e369b6458
johnathan.bogan@merepost.com,@@Masuk123$$,0xc56da58ffc645886619b63e867425e11bd39e8da
cathleen.rogahn@merepost.com,@@Masuk123$$,0x00c0e42c60c5fb1f0409c33949c822048f1d895c
johna.jacobson@merepost.com,@@Masuk123$$,0xc128f42474433d2b146d37ec93f3656d270105c1
brenton.kuvalis@merepost.com,@@Masuk123$$,0x5393bef63757384e7ab64cc4de02eed6398923c2
mckinley.flatley@mailto.plus,@@Masuk123$$,0x9a731639183490dc54aca9b2bd4c0e563bbfedd6
harrison.stanton@rover.info,@@Masuk123$$,0x8079cdb54d0b82080c4fe9f8ba97f980180a15ce
doug.glover@merepost.com,@@Masuk123$$,0xb504c7fc0b9641683cb502511bcd131bf3343d29
chante.gibson@fexbox.org,@@Masuk123$$,0x5d5d0b99efc0d6366ee6910af3e56dbea8ac0c86
jefferson.torp@mailto.plus,@@Masuk123$$,0x6d1b5272b139340fed3cbe555a397cf016ff48c6
avril.reilly@rover.info,@@Masuk123$$,0x98454c4358ddc12095383ae8bb2d0c6178fe81e5
sal.bergstrom@mailto.plus,@@Masuk123$$,0x7a1278e3300c895ec3e767d0c320bf86bbee13ac
berna.schimmel@mailto.plus,@@Masuk123$$,0xa54cc13fadcea44b2945c50841f865d032249956
broderick.watsica@rover.info,@@Masuk123$$,0x97f420bfff49fb8bbddb402587973000603c4d1a
jonnie.stiedemann@fexbox.org,@@Masuk123$$,0x4dc604c31860fd88d39be8715a06bd5961025d6c
gerardo.kub@rover.info,@@Masuk123$$,0x825355f3fda7d2025c9142b858b3251019842d0f
maryam.cronin@rover.info,@@Masuk123$$,0x3dc3eddbc25d8e6c2488c313a10191b4261bc566
jon.lowe@rover.info,@@Masuk123$$,0x227a5a436c75275a70639fa40041ebfce9ff50c9
kathrin.hyatt@fexbox.org,@@Masuk123$$,0x20dbe205154869a205319db6c632d53ea87f91c4
alonzo.dicki@fexbox.org,@@Masuk123$$,0x3bcb3ec9fbef8eafb793723865655b2042d70a3a
bert.gleason@rover.info,@@Masuk123$$,0x317e2232d3a0cbf930a69bc3a93afa855833954b
rebbecca.farrell@merepost.com,@@Masuk123$$,0x46d75b84283e335949761c0f3186ed4b0768098d
alfredo.hauck@rover.info,@@Masuk123$$,0x319f2e3fd072c6cbb6ca016cf5252fbbbfe9a255
wilfred.emmerich@rover.info,@@Masuk123$$,0x29d0993276219fcc7d019ed6a5bed041cb9148f7
harrison.powlowski@merepost.com,@@Masuk123$$,0xd74b0d2d96d104dee35374ec76aff671f0d77384
del.pagac@merepost.com,@@Masuk123$$,0x48fda6233ffb4669dc2399585d6412395c152312
merri.effertz@rover.info,@@Masuk123$$,0x32acd3a181d9001d3d037e01b5010faba7d44839
rufina.gusikowski@mailto.plus,@@Masuk123$$,0xd1157c823facccdd531999d23d2f801c091dda0d
hyo.pagac@fexbox.org,@@Masuk123$$,0xb86e8fddfeb52d00d4a3e18c82cd27a7909890b1
reynaldo.renner@merepost.com,@@Masuk123$$,0x8a972d13799f7f6553e5f46f74bbc52b9fc2bf0c
cierra.connelly@merepost.com,@@Masuk123$$,0xd3b267591b9e88b8d0a67b33c2c542b5a7784073
kurt.lowe@merepost.com,@@Masuk123$$,0xab4459cab68ac4b7b975733627e00a425cadd7f0
pei.gulgowski@rover.info,@@Masuk123$$,0xe7508538f7c7a3b5cee4b99db5dc23701bbc351b
tisa.konopelski@rover.info,@@Masuk123$$,0x2bfd89aab0155cc5dc8ebaa5253d79da66c8a177
michael.schulist@merepost.com,@@Masuk123$$,0xeb6fc9814bc7c383561eee79f0847eb37b424cd1
aron.price@merepost.com,@@Masuk123$$,0xdd02f7dd503fe89be1739b8a1f57ba663f35e8dd
laticia.halvorson@fexbox.org,@@Masuk123$$,0x7904ccabd91e4b110091dbe65dce798d465a95d6
magdalene.mayer@rover.info,@@Masuk123$$,0xe1f50766d9674fcb651a9e6adefdf95efb01f080
theola.bailey@fexbox.org,@@Masuk123$$,0x65cca87f58c6e9ba26fbd3c17581ece19c69fd20
oleta.carroll@fexbox.org,@@Masuk123$$,0x415b81a706e04a6527de9ede4176a6028677b1ee
sid.feest@fexbox.org,@@Masuk123$$,0x1d7a855d8b74770eac07acbd0dbf233168ff6a4f
shonna.gerhold@fexbox.org,@@Masuk123$$,0x12ee7fa0eb217de1c98948b34edc0a896bbcd02c
dorcas.dickinson@mailto.plus,@@Masuk123$$,0xbd7045068d5d51afb5e5f2e37a1d130c715be05c
carita.swaniawski@rover.info,@@Masuk123$$,0x17169c41e4188984231e303f540dd8c70b147c67
erik.bednar@rover.info,@@Masuk123$$,0xe6dfe90d0eac53fda6ce95673a96852db8e8d546
chan.luettgen@mailto.plus,@@Masuk123$$,0x668011a4c71cbedd6589e3d34b649ea76bd49ade
oliver.sauer@rover.info,@@Masuk123$$,0x09af98a4d2dcef53e21eccef5790aa7bec8ea0c0
gustavo.pagac@mailto.plus,@@Masuk123$$,0x29ae1a7d0fc8f765253c2f37ca9ab24d272a033a
granville.langworth@merepost.com,@@Masuk123$$,0x79dc313dc201ea264034707b53fd7b14a0d8538c
dario.heller@rover.info,@@Masuk123$$,0xa0806fecaccdd03579a8b0eb34dc4f873f501820
hilaria.waters@merepost.com,@@Masuk123$$,0xf69866a37442bbd1e45bd1baf4cce0fda3897b22
frances.hammes@merepost.com,@@Masuk123$$,0xf938f2e546aebbf84c97c0d7319e4e219a6a296d
sarita.pacocha@merepost.com,@@Masuk123$$,0x991076f8492bbfc21a1b1c424f58cfb60e7f5096
charissa.bogisich@rover.info,@@Masuk123$$,0x87c6a7c82ab5d782630e74cca271321a94b241c1
pat.ullrich@rover.info,@@Masuk123$$,0xc711b2502766d0ff85653db40ce5f04355bb75b9
alonso.fritsch@mailto.plus,@@Masuk123$$,0xad34a9285ba620a03c047f7ad3825b156066c3c7
noelia.leannon@fexbox.org,@@Masuk123$$,0xccfcf0eba91c0143225e9e1fa6b1dc06a2daca60
faustino.kuphal@mailto.plus,@@Masuk123$$,0x4db0bd84818248a618a20317fdd00b43d9e9fe44
elvin.effertz@mailto.plus,@@Masuk123$$,0x387556305631115c7ea4936968a28d8e76bb4355
rocky.kuvalis@mailto.plus,@@Masuk123$$,0xe079531922a374bb336a4687ecbd0dc8b178d58c
page.schoen@rover.info,@@Masuk123$$,0xc4d210faeb03d52444e274e4f95ddcafcb67f65e
enriqueta.gibson@fexbox.org,@@Masuk123$$,0x908e0c7746fceedae293093495e8517c1571c818
judy.feil@merepost.com,@@Masuk123$$,0x04808eeefb9d01af10cc3c714c7f4883b7a75029
demarcus.luettgen@rover.info,@@Masuk123$$,0x4e6f758d25942ba5b2535436ff6a0f5578810220
faith.smith@merepost.com,@@Masuk123$$,0xbb163c1de7abe758bad4e8d87295e7572e7040ef
archie.klocko@mailto.plus,@@Masuk123$$,0xd800bfe85552bdd79a54516a9a1c79641a118cd3
armida.hermann@fexbox.org,@@Masuk123$$,0x7df5f95c7682edb1de74806e6e8ac49b5a9d57a8
buena.runolfsson@fexbox.org,@@Masuk123$$,0x0722255b6741ea310288e7810355504706f16ac6
jermaine.kreiger@merepost.com,@@Masuk123$$,0x5d169fac210a89b219d190195a45e08c8d5e2b86
terrance.mertz@mailto.plus,@@Masuk123$$,0x0cd9ce3b1e9b8cb80372ed5421a947701fac859b
ezequiel.ankunding@fexbox.org,@@Masuk123$$,0x6366a1c0018d67be594de7b5dfa7658f7ca351ba
malik.dubuque@merepost.com,@@Masuk123$$,0x7df76c8fd9b12b34b0bb09dabefe602c5f45903c
casie.o'conner@mailto.plus,@@Masuk123$$,0xd4880078af26678acfb8c74d690b7bec7109479c
gail.hackett@rover.info,@@Masuk123$$,0xde088ea3dd10166ef645ba0e25496e4d68bae86a
lasandra.larson@mailto.plus,@@Masuk123$$,0xf6cf8c03ab393727d655ff908e7a0ea016764a75
eusebia.rempel@fexbox.org,@@Masuk123$$,0xf0811d73f3ae602b90c3b78a6fa0d099673cd141
leonardo.ruecker@fexbox.org,@@Masuk123$$,0x2cf8d7e8142b0bc7f7a1cb09c7f8a394e33c6375
graig.stanton@fexbox.org,@@Masuk123$$,0xb60f82b645ae3981f9c6e5ff4c2a87c577ef2d22
ellsworth.predovic@fexbox.org,@@Masuk123$$,0xa1eab3182d840c03f497f71f6ca9f9449588954f
kennith.kris@merepost.com,@@Masuk123$$,0x59640e87c1ca5a374b78106e22791f949ba43ac4
myrtis.hoppe@fexbox.org,@@Masuk123$$,0xd34790b09310c1f5f6c6ea5eb3e4c303adac3616
vance.bahringer@merepost.com,@@Masuk123$$,0x78604d2286b9d12f5e768b0c171156ef0a0ff3d4
brooks.schimmel@fexbox.org,@@Masuk123$$,0x0c78033738a94e60567caf9dda93ad83a1551f44
shanell.kunze@mailto.plus,@@Masuk123$$,0xc48e09d035d097bf02a067b67d6938250a40da62
francisco.tremblay@rover.info,@@Masuk123$$,0x910a88020fbe54e0fa2c508506c64f53de8ee23d
sadye.bernier@mailto.plus,@@Masuk123$$,0xc65bb642498ce1d3ce98ee04fc03a1c125309ab7
rolando.gibson@merepost.com,@@Masuk123$$,0x25879e0a86155a9707db37439ee1040905caadd9

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
