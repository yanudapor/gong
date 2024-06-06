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
marcel.auer@mailto.plus,@@Masuk123$$,0x11b4a6d512190b9dd887cfc12f6d666f5334630b
rudolf.trantow@merepost.com,@@Masuk123$$,0x5642074f170da0a452b2039280891a5234c3e4ad
rosalba.thompson@fexbox.org,@@Masuk123$$,0x54a2dde8039421ce8dcb8eb3a917af057196a06d
trent.harber@mailto.plus,@@Masuk123$$,0x78b285cb281d76f78251a3252c5d185144251a7d
charleen.maggio@mailto.plus,@@Masuk123$$,0xa18c17cec303d5a87c136e627955e09f758762fb
jewel.parisian@fexbox.org,@@Masuk123$$,0x9447bd61ba75f5ba3815975bfc1822fc2d6f35bd
frederic.reichel@merepost.com,@@Masuk123$$,0x2f76851705c26541aeb2af4bd92a6be95e2e355a
bryce.schmitt@mailto.plus,@@Masuk123$$,0xa86408530afd7e816a76f5c6846564beb997e7b9
marina.aufderhar@rover.info,@@Masuk123$$,0x3c38b483b4198ccb46ac93dca2482e450b7e625a
angel.lubowitz@fexbox.org,@@Masuk123$$,0x34e52eaa21b078a9d93ae2633272e5917b38fd4d
yolande.o'conner@mailto.plus,@@Masuk123$$,0x0d748b34f90286f13388e5bc55bdd05f27838c25
jonah.auer@mailto.plus,@@Masuk123$$,0x429a66dc874710b54f2305ef9e9ec6c4f8a67d3a
courtney.robel@merepost.com,@@Masuk123$$,0x61b76e511cf75c7c0875171073ad19704266fb22
johnathon.volkman@rover.info,@@Masuk123$$,0xaaf37e96f08bc0b10cf356e23750bfc15fd61381
carisa.schroeder@merepost.com,@@Masuk123$$,0xc2c84f5fc0746c6b9acd18fc42bdd1d8ee3dbfca
lowell.vandervort@mailto.plus,@@Masuk123$$,0x1f758288f0d330cf3bc803f72d1d83ec97ef3441
alberta.kerluke@mailto.plus,@@Masuk123$$,0xd2eb47bf63695c365e53b2302d6e9f1552935471
jung.wisozk@merepost.com,@@Masuk123$$,0xe7a28115a51fde6ed9f8633c4f50a7ba93bed7bf
dylan.langworth@fexbox.org,@@Masuk123$$,0xb291b4f0a66b94f59797f0d6d71659e69ff885bc
allen.hansen@rover.info,@@Masuk123$$,0x4b6cda4a5a940d4cd736070e1361161e06387501
elliott.denesik@fexbox.org,@@Masuk123$$,0xf9d74c76872be6108171477c50bee6bc528b9831
rita.mayer@fexbox.org,@@Masuk123$$,0x369ae2062fbae3a54f00ff8e877042ee8258f026
jeffrey.lynch@merepost.com,@@Masuk123$$,0xb51739d9ac64da8ceaef44a09504552a2388efbe
charlie.gerhold@rover.info,@@Masuk123$$,0xb1a8ff960f011cd3aac807f08f625d0d592080b0
andrea.herman@merepost.com,@@Masuk123$$,0x0cc6498f2ab2340bbd8ec0b8d59e703318e83467
antoine.hyatt@mailto.plus,@@Masuk123$$,0x0cc123199d38b821af4079bbd4cc8ae1fa568d26
rebeca.fay@rover.info,@@Masuk123$$,0x4f62f9d7c512bf6e03d8edc67921d2c4807e55eb
ulysses.turner@rover.info,@@Masuk123$$,0x4525d5527e107ef152ac646297fe8222ed7a2961
deangelo.boehm@merepost.com,@@Masuk123$$,0x6431427d47757d8c3b894d97c64cc70c81e97460
scotty.langworth@merepost.com,@@Masuk123$$,0xdf1d3f187f4f2b565af95408750cf76adcefe954
sylvester.boyle@fexbox.org,@@Masuk123$$,0xa09e3ce363fa02abaead8b09be04ad4c21a88bd4
cecelia.hackett@merepost.com,@@Masuk123$$,0xa95e8a7ee5a509418a4edb133bd2326f277c7b99
cecil.wisozk@rover.info,@@Masuk123$$,0x7a9baf9fe3fed45b3843015a402143fe77dbf4c0
evangeline.lind@mailto.plus,@@Masuk123$$,0x2ea9169a7b5e410f146d8bb53c6cd84feeed957b
parker.dickens@merepost.com,@@Masuk123$$,0x0568c1f6f7592d7494256b847ad17599964444c3
maxwell.jones@rover.info,@@Masuk123$$,0x0012b418cb7b5af00aea009a67fdd4e5c363fe11
monique.moen@merepost.com,@@Masuk123$$,0x9287e0b3dbfe0fbb5ec2de7a9490f2f620be7d5e
aleen.price@rover.info,@@Masuk123$$,0x458b594a959f72bfc95f7246c3f2d39e91dd8787
tony.shields@mailto.plus,@@Masuk123$$,0x2e05578d144a3a3a331c18566f08373b638312dc
teresa.von@mailto.plus,@@Masuk123$$,0x71ba2002fa96e7834b57553950056aa9c41ef11b
patricia.beahan@merepost.com,@@Masuk123$$,0xdf5131b587f503a72205d6eb6ffb800d78ccd4e6
julio.hansen@mailto.plus,@@Masuk123$$,0x03a41e9c10829a5f5ce14258b2b4f5dbd401343d
rosaria.pagac@merepost.com,@@Masuk123$$,0x3c345b20a936b6303562ab8bcd5dce416ea9130b
mallory.lindgren@rover.info,@@Masuk123$$,0x6eb68c835514fa742060a92a326da37353ebe35e
jewell.keeling@rover.info,@@Masuk123$$,0x9a365a97e1521473942f6c8e09ac481331bf6662
armida.bednar@fexbox.org,@@Masuk123$$,0xd655dc96b8047b228e9cc7f6acc90157b52971f2
augustine.kertzmann@merepost.com,@@Masuk123$$,0xa1d851962a75a5455e732deec03578c71bae36d7
esther.bauch@fexbox.org,@@Masuk123$$,0x45f7c27416e595df29a8e95a199d6f3136e97395
gwendolyn.satterfield@fexbox.org,@@Masuk123$$,0x00f66d7ac3fc782a1e5ec8badb32224f22568b23
verena.white@rover.info,@@Masuk123$$,0xb4be4811ea001a2520a0d8faf1f553fe805c08cc
albert.marvin@fexbox.org,@@Masuk123$$,0xf7afb988f85c46c6467330850a6e9697b0011f0f
evan.franecki@mailto.plus,@@Masuk123$$,0x0b520537c2fe56b6d7c7096fe28f9e896815b9e8
napoleon.monahan@fexbox.org,@@Masuk123$$,0xcbdec36bc5cd45b1a99486e927886c0bdac565cd
willy.ritchie@rover.info,@@Masuk123$$,0xe99bb54b316c88543f75e7a43e6a9ce990bd7564
dave.ferry@fexbox.org,@@Masuk123$$,0xa91083fb7f7b9f6f57ad747971a73bab292feca7
eleanore.green@fexbox.org,@@Masuk123$$,0xcd8ab93caed2d9aee93533237a0a6b44ee1e4039
tilda.johnson@rover.info,@@Masuk123$$,0xf81aa4260f8eb6ad638da07dd23d371ef0ce1f5f
cruz.hoeger@fexbox.org,@@Masuk123$$,0x30a181c8b3df3932a956b20b1f4a2fea097ff3ae
brad.kessler@fexbox.org,@@Masuk123$$,0x92ac1faef9049674ec4a5b8f558965bb3615fbe2
salvador.west@mailto.plus,@@Masuk123$$,0xcfff9b71e6d4d4f3c47eb6a50347917da07eb0c1
charla.barrows@merepost.com,@@Masuk123$$,0x07900c43a7bfc408ba76b10f57070f5674a46403
katrice.ankunding@merepost.com,@@Masuk123$$,0x8283e42a8034f61f78a8c8a68a1649f7af2e471f
dannie.hoeger@rover.info,@@Masuk123$$,0x5cfc83fd7cc9dc00232c2d43829f7cb7e1e49bca
dario.botsford@mailto.plus,@@Masuk123$$,0xd562d944aa7ffaf20d198c357ec6eda003563f8e
earl.yost@rover.info,@@Masuk123$$,0x45021aa5d84a2b2d470f44d568e6fa167131bbec
marylouise.hegmann@merepost.com,@@Masuk123$$,0x225a6de37e22cd4bbc3ec96d8e01c0aa2fdc6057
kasey.hane@rover.info,@@Masuk123$$,0xde473bb427ba45d5805c119634dece5055c33697
alica.feil@merepost.com,@@Masuk123$$,0x775148b40f4f240506a52a6239b793cd8cda3784
mose.mante@fexbox.org,@@Masuk123$$,0x9308a26c62d18b016b10f01c98465277556e8446
britt.schmeler@merepost.com,@@Masuk123$$,0x3d6c6304be644265e0f8d6f88749130e36054350
tora.schoen@fexbox.org,@@Masuk123$$,0x6bd57cb656faef2440f17f47d18e40f38a24825a
kurt.lemke@fexbox.org,@@Masuk123$$,0x55f4eddb9cc8a71e5919e057ac9495996f2bf49d
maxie.kuhn@rover.info,@@Masuk123$$,0xb9cfa5d972e3868734e665427684edcd694e4056
heidy.romaguera@fexbox.org,@@Masuk123$$,0xd4e9a34a1ac13886c2268add772f7e4dfd5cca3a
myles.kutch@rover.info,@@Masuk123$$,0xfbd874454cc04fcee0932d9737d6a416cd44d6c9
boris.olson@rover.info,@@Masuk123$$,0x335b1798253fc03f83fffff108f3f5ccf7437856
filiberto.kohler@merepost.com,@@Masuk123$$,0x68aa354cc60f51efbf3ecbe4b38d4c7bf00162e8
conrad.quigley@merepost.com,@@Masuk123$$,0x1d08aaa211d48cbf3eb8b23c71148eea363a739d
monica.langosh@rover.info,@@Masuk123$$,0x8ef8d4c22698f2b5a557ae855f5c4a8a1811cf0a
suzi.zieme@merepost.com,@@Masuk123$$,0x5a9e879d8d21916e40769e871114957c7d8469ea
theodore.ebert@rover.info,@@Masuk123$$,0x20f990c0b22cc0afe2d877f00a48a13b96e75170
marion.kuvalis@merepost.com,@@Masuk123$$,0x534393b58ba715152d7888e7752ac38eec6bc58c
mervin.beier@merepost.com,@@Masuk123$$,0x38befac73ddaf98337104910e62512fd7fca437a
thad.collier@rover.info,@@Masuk123$$,0x8767a6014e3147dc0ea7c7c8e4a7ce4a1e7c0458
kaylene.parker@merepost.com,@@Masuk123$$,0xc2c70a3ae7f451f3c2abd2e9c9f582480b8b81a8
travis.leuschke@merepost.com,@@Masuk123$$,0xc77d644b9b0a4f9f0b4991e712e5a99dd9e4a01c
bob.o'connell@merepost.com,@@Masuk123$$,0xabd1f0490a49e3a9ebb86a30518d6340672ed8f4
diane.wiza@rover.info,@@Masuk123$$,0xacee951010ae45d3edb15ceaa423ab002f4eef0a
tom.boyer@fexbox.org,@@Masuk123$$,0x53f49d48ceaa50bc252aa1c3d9d6b5f42d080fa0
morris.emmerich@rover.info,@@Masuk123$$,0xf390ec285e6c386f999d6065db57c261cbcde848
cliff.walsh@fexbox.org,@@Masuk123$$,0x2080da206fba4a188dd4f4d5f73e6cc1bce10eab
mabelle.o'connell@merepost.com,@@Masuk123$$,0x5ee158a231977109434af70934c5aeb6e6c5471b
candyce.pfannerstill@mailto.plus,@@Masuk123$$,0x3a584913b351787533b064a5dfd07ff9847e39bb
reyes.hoeger@mailto.plus,@@Masuk123$$,0x92d807a3dfd74d63a508ce51edbed5f43154b197
deon.price@fexbox.org,@@Masuk123$$,0x618d8acaa617d06d8961924d04aae0df6337ea46
janay.crooks@rover.info,@@Masuk123$$,0x503a7564d6715626b45e234825ef8656d9bf0cb8
leif.o'conner@merepost.com,@@Masuk123$$,0x347aa00fb20c00e52cf1abd0c09bde02f2a16af3
julianna.cummerata@fexbox.org,@@Masuk123$$,0x7e972e7f55bf426bfc363d99d2f70a7ab18ec261
karin.renner@fexbox.org,@@Masuk123$$,0x478ddcdc1649374a4c2c11702f3003abc7c12a23
danae.kessler@rover.info,@@Masuk123$$,0xe68117f6711894ca2eda5507fd30e23ba909113f
kimbra.bartoletti@fexbox.org,@@Masuk123$$,0x65c0a54901c0d4a3fa34d864fb7478d8599e94d4
eldridge.mosciski@rover.info,@@Masuk123$$,0xbcc2907d46056bc3914a9e09a939bbbfc2b8bea4
delmer.kemmer@mailto.plus,@@Masuk123$$,0x0e61b683582535c32a2ec128298a8780ad3133fa
jess.koch@fexbox.org,@@Masuk123$$,0x32c0e0c603ca5cd7cbd48eb9d9667f2002c6f293
cherly.rogahn@fexbox.org,@@Masuk123$$,0x5042e5f8bdd6463347fa07d976ed46d59d650f77
kevin.dibbert@rover.info,@@Masuk123$$,0x06355498b0ed39a981756ca43780cc4b154f04a0
madelaine.hilpert@mailto.plus,@@Masuk123$$,0xb56f8681938842e504ce4f75b7ebc61ebda3155f
mildred.murphy@fexbox.org,@@Masuk123$$,0x8f5f6e33cab2d2a123f89e4a801d0a333f51efff
emmitt.zieme@rover.info,@@Masuk123$$,0x4aedc36fd5553d057b3d04982715964b1cb6fad7
jonah.hettinger@mailto.plus,@@Masuk123$$,0x8f47f0b997bf18fbe0b8bdfd1f28d576c234c663
danuta.cartwright@fexbox.org,@@Masuk123$$,0x7a4295de42810c4a04c8034824db6003df5e3003
aron.tillman@fexbox.org,@@Masuk123$$,0xf68c3f8aed1ed759a0f3e97c68842259b61683ee
marinda.larson@rover.info,@@Masuk123$$,0x5c692cdb1c19e030e2129408ac187d73e463d6a9
sage.klocko@fexbox.org,@@Masuk123$$,0x120f91b037263afefb47c8faead96a16cf53561d
avery.torp@merepost.com,@@Masuk123$$,0x7483bb3f8f3bf98a3b3069dd1ac45cdfc7bff80c
antony.nolan@mailto.plus,@@Masuk123$$,0xdb10c24c6b9bd697e09f4f1b1b64cad7e8e29369
jame.balistreri@mailto.plus,@@Masuk123$$,0x1112292a732a22e7f03478836f69acc9b6b69466
babara.haley@mailto.plus,@@Masuk123$$,0x63afdf91ceaf81b656597167f2ab48791847ff66
lelah.franecki@merepost.com,@@Masuk123$$,0x9f31314780157b5688d9adf972ebccee00fcdf05
bill.klein@mailto.plus,@@Masuk123$$,0xe5dd848e13503c7f058b82528346b2ba8f095200
wiley.metz@fexbox.org,@@Masuk123$$,0x0ce77002629b8e4029757c1d21a7aabd045acc9d
arthur.cole@merepost.com,@@Masuk123$$,0x1cb4c92d43c6554db0d570d259394ca1c05d3985
napoleon.ledner@fexbox.org,@@Masuk123$$,0x8dd4cb444c6c1b5ae4abc6ec30d835245bb93608
eugena.schmeler@merepost.com,@@Masuk123$$,0x6c10899ca247aad35e46789a73906554db518a4e
sherryl.becker@fexbox.org,@@Masuk123$$,0x2d6d361bfc0fe89563b9e322cb32b5e3d7b4c79d
jaye.kling@mailto.plus,@@Masuk123$$,0xe901d81796ac7f93f098732f607140aaff0dda0a
brett.treutel@merepost.com,@@Masuk123$$,0xc1b3ee8c1b8c37b5dacfea239028d3f581722e3e
hugh.sporer@rover.info,@@Masuk123$$,0xc11433258ea26b5340841f9b734d6981b959ebad
marilu.lockman@rover.info,@@Masuk123$$,0x4e8f26e52010b61eb3fdbf611c3c1083bb8c0937
tamera.auer@merepost.com,@@Masuk123$$,0x3d1ed72d810006bdfaa0071da4794bf2eb4c1114
rolland.kuphal@fexbox.org,@@Masuk123$$,0x3f18b28ab561117fbf736c89c8b74b0b57dfcf34
rufus.mueller@mailto.plus,@@Masuk123$$,0x940f07322b00b9add6448e56f8a86436e339ef69
delorse.roberts@merepost.com,@@Masuk123$$,0xe93e54c4594b5eb21e15bbe0498368bd2e4b0ee8
rudolf.kreiger@rover.info,@@Masuk123$$,0x9ff9e8c861bfaba12879d237f9b19683dd64ba98
ernest.conroy@mailto.plus,@@Masuk123$$,0x6f28004b5161ea73d388b96ae1573397bdc27d7e
dee.quigley@mailto.plus,@@Masuk123$$,0x0151c72f0f545a28c39118d33a648b925b34feea
emilio.dietrich@fexbox.org,@@Masuk123$$,0x628cbcc265ff6777980d76f4510757e458d2bf5b
meta.quigley@rover.info,@@Masuk123$$,0x8017ad0cf5a729d469a769bd4c90be1280973936
harland.gerlach@merepost.com,@@Masuk123$$,0xaff7867670d3d79a28b65b383d4d06f3eb655590
keith.grady@rover.info,@@Masuk123$$,0x0d68c0eed5281b43d438a94ec2b96ff43b67199f
hui.wilkinson@mailto.plus,@@Masuk123$$,0x349be3128288a600888253449a9aac0879b08601
iluminada.sanford@rover.info,@@Masuk123$$,0x19e7755d9e58748d371a4ce6b7f23d2811607e70
freida.littel@rover.info,@@Masuk123$$,0xb4f89dc5a45d955d7bc2d772881e8ef3adec8831
fletcher.macejkovic@mailto.plus,@@Masuk123$$,0xd8a436aeac308bc94b033ff33ba7db453a679d12
hiram.barrows@merepost.com,@@Masuk123$$,0x520e931caabf37a26c34e6d11357f5591d85b48f
sam.barton@fexbox.org,@@Masuk123$$,0x09bed768bdbfe20c6cff832c9a646ef7b4fd48d8
kellye.doyle@mailto.plus,@@Masuk123$$,0x42ff2bef0dc744de414e613d1fce75ac04516a11
reinaldo.schuster@rover.info,@@Masuk123$$,0x593efecc8dcfa1c0afe890a4c220e0d7c083ff4d
joie.stroman@merepost.com,@@Masuk123$$,0x564f46a9dbc7f1f332e4a19211d6668a029ed071
devon.mohr@mailto.plus,@@Masuk123$$,0x64c3b1bd547b1e6548b128fb8e16709ce6d1ff7e
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
