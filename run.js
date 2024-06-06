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
buck.mayer@merepost.com,@@Masuk123$$,0x8e4d26313ba1016c7795a79254dc7794b89eab3c
travis.nienow@rover.info,@@Masuk123$$,0xcb79cdf39b813b51d05301499c864b5e126c93e6
leeanna.hackett@fexbox.org,@@Masuk123$$,0xe451c1ae57e477ab18f098ba0b90729ac5580a23
wynona.dach@mailto.plus,@@Masuk123$$,0xbdee602b652e7040c493f8f90cfb8ad8f0bdc417
ralph.donnelly@mailto.plus,@@Masuk123$$,0x8e3abe8a48f191a4383b936ec18fa84fc89b8775
aleida.zboncak@mailto.plus,@@Masuk123$$,0x462a1e5cc2cb5060d9e775a23749e3f86e67890b
samuel.west@fexbox.org,@@Masuk123$$,0x4b79357af9b0adcf7f968347e2e47d1fe9212f9d
jonas.grimes@merepost.com,@@Masuk123$$,0xbaa837a7c750e78729165aba648ff14082612de9
yuonne.marks@mailto.plus,@@Masuk123$$,0x5581ad2a2a6d09b02214595e29c8c8afad2031fa
quintin.hartmann@merepost.com,@@Masuk123$$,0xbb55f661503aae2c4d688b512086b7541c4ad0b4
remedios.rice@merepost.com,@@Masuk123$$,0x6b0f3778e4367631fce618ce9ed5d5cf45a084c1
sharonda.kunde@merepost.com,@@Masuk123$$,0x473165210229f2ea786424abdc81e5a6ef9ca8ca
perry.hoeger@rover.info,@@Masuk123$$,0xb01c4248a6ed45b3346b28498613243af9190db9
maurice.mayer@mailto.plus,@@Masuk123$$,0xd3d6b52c6978d605d30dc4c0dc3d94ff692d0e38
clemmie.rippin@mailto.plus,@@Masuk123$$,0xc058e039cdfe80c828c3bc0d139b043e78881caf
chance.gutkowski@merepost.com,@@Masuk123$$,0x9de592c067e249a61910b5ef6ea78282ff8654dd
junior.kshlerin@rover.info,@@Masuk123$$,0x9adf1dabc163387193100c6472ab7efd664ba6bf
neely.bechtelar@fexbox.org,@@Masuk123$$,0x161c977222db150670fd963d7ad75a9a0e4547fc
gregorio.gorczany@mailto.plus,@@Masuk123$$,0xa3692c5edc4299291081ebc88cf80c862e2e97a6
juan.hayes@rover.info,@@Masuk123$$,0x813022a0ffbab9afe2ab5bd26637c98c1364020b
cari.herzog@mailto.plus,@@Masuk123$$,0x56192cdf21d7a697f2070bb53f2475637be9176b
gilbert.shields@fexbox.org,@@Masuk123$$,0x170dd75f2fa8fffc1148a7902b6fe486b506b505
margie.morar@fexbox.org,@@Masuk123$$,0xc9cd9a2e13655d2443d442a849f1650c8770e672
lory.waters@merepost.com,@@Masuk123$$,0x2581377e5533b1c20387f4262aae8c2226286956
isabelle.braun@fexbox.org,@@Masuk123$$,0x70f3e63c33ce0f44cf44fed4aeb28301ecd3cc31
alberto.mosciski@mailto.plus,@@Masuk123$$,0x8fc7b654493570171a83b2dbf9f6fb78cf69081f
almeda.hermiston@merepost.com,@@Masuk123$$,0x28195286c06c3dda09e350e19a3c4f2e06c10821
lorena.schinner@fexbox.org,@@Masuk123$$,0x503d5243e0e5aea586ea76670e723d0b88db8399
herb.becker@mailto.plus,@@Masuk123$$,0x06abd97811cb8df0aaae759e542d27a457bd7d5b
patricia.jast@mailto.plus,@@Masuk123$$,0x972a2e7d6b3b3289344fa1216f4f915dfee07354
aldo.ebert@rover.info,@@Masuk123$$,0x2a6ca42c0b41fc8c0d275e17350d95a8cc60da66
brock.feil@fexbox.org,@@Masuk123$$,0x4ed362eee72725f0f4e8335fbb9abe53f7159e2e
tanya.lindgren@rover.info,@@Masuk123$$,0x465c9c50d07079a6f75d575ac9aa0950f4b2d6ed
carey.murray@fexbox.org,@@Masuk123$$,0x3e8bd38610d5e7e1db5eb09708e206cc7151aea8
margert.kling@fexbox.org,@@Masuk123$$,0x88bbe3f5ca30d8463ec5fdc87c3e23bcc71818e2
laronda.mills@mailto.plus,@@Masuk123$$,0x832f6308df9e52e72809f9421abbe04d9bec58e3
alva.schimmel@merepost.com,@@Masuk123$$,0x34b6cc34347c6c3c5d1f4db3141caa7121b1d4de
lilly.stiedemann@mailto.plus,@@Masuk123$$,0x9d91b507be4af159256d090c4129618cc0fba3ca
byron.goyette@fexbox.org,@@Masuk123$$,0x9bec243647453b9a8f22a49a4b018fe01cc10fc0
christiana.kreiger@merepost.com,@@Masuk123$$,0x356dde853e09c5e16b02cd7db9545e855837fbe7
lina.effertz@mailto.plus,@@Masuk123$$,0x07c47ba6ec098ae35df959fcd28367b2516f5f14
daniel.mante@rover.info,@@Masuk123$$,0x9dd6321cf3205a36d8d2b2193aae4d58811870b2
becky.veum@fexbox.org,@@Masuk123$$,0xb265579f19210ea84658eb87be4b8ef24c1758b2
mariette.padberg@merepost.com,@@Masuk123$$,0x5346177579fa7fd118044cbdd5e3721122b9e640
vern.goldner@rover.info,@@Masuk123$$,0xba16c064c8a12f2be3867667fed4fb30593ec326
tamekia.schmeler@rover.info,@@Masuk123$$,0xcd3664357b075ecfa27a23bc144d534d977b4537
jarvis.sporer@merepost.com,@@Masuk123$$,0xdcb43d5b7f3bd0ef2a6b081541818d680c05ef94
shyla.parker@rover.info,@@Masuk123$$,0x63c7522761c09a877f9789da99b871fa522baa17
tiera.steuber@merepost.com,@@Masuk123$$,0xcacb937a6d71d0bc260952b0a66cb5eda1ce43a5
ali.nienow@merepost.com,@@Masuk123$$,0x5e735ce83479f093cde7a072dca4e69518bfc449
charlie.douglas@rover.info,@@Masuk123$$,0xc085f14c595d41e366d199f92f1128decd054ea9
demetrius.hirthe@merepost.com,@@Masuk123$$,0x9fdcba22a76faee05ba50227665cc158a11b3cae
lakenya.lind@mailto.plus,@@Masuk123$$,0x9a4ab6e93929dc231f1ce2f66ccc6ef8b506566e
john.cassin@mailto.plus,@@Masuk123$$,0xe6dcde234b12af3f7ff5a6bb321525ec4e45965f
lorenzo.padberg@merepost.com,@@Masuk123$$,0x2450082fe9c8961c1c9c11f58402475d5f2d033a
gale.sawayn@mailto.plus,@@Masuk123$$,0x56f10c963f9724ba8e26fc0344ed566c4812fe25
emile.franecki@merepost.com,@@Masuk123$$,0xc32eb4a9b45d0384d0b04daf9d53e747283e546e
dara.stamm@mailto.plus,@@Masuk123$$,0x28ae8b3ef2609a98c078efa61213f3442eaa0123
libbie.jacobi@rover.info,@@Masuk123$$,0x9a3d708e2751a218cfcb5f3bff1f73cc21a3dd23
burton.gleason@merepost.com,@@Masuk123$$,0xa2908483ff5895f8687cd3be4115ebf5efc6a5cb
shemeka.littel@rover.info,@@Masuk123$$,0x1c9f842b2b215e4932572d59090210cf7c7c4b09
anibal.schamberger@mailto.plus,@@Masuk123$$,0xe1f689f4e00b42a2c5939a5452fad0e38c3f510e
arden.beatty@rover.info,@@Masuk123$$,0x8a4a802617674b35c4c1b827a70657ca6568f504
alexia.ward@merepost.com,@@Masuk123$$,0x80dbb8a4ccebeb96ce7b7da2f3204324c5855234
allena.schultz@mailto.plus,@@Masuk123$$,0x7623b8592f17911523f31a31c0f599493290b504
sammy.stokes@fexbox.org,@@Masuk123$$,0x3bcb6bfb581d94bca9a819e539171fb24954139b
joe.hirthe@rover.info,@@Masuk123$$,0x8f58eed6c17e972e4d8f3ab4277475de4767c079
davis.quigley@merepost.com,@@Masuk123$$,0xaf23f56241fdb09b2b2d2760d88b2d5d3b184bbe
lloyd.yundt@rover.info,@@Masuk123$$,0x077760517dcdfccf2f23a0886ebb296ef8fc29f2
brigitte.stark@mailto.plus,@@Masuk123$$,0x642adc9ec8bbd4a128e54fa68298cea9efe556a3
gerri.kunde@mailto.plus,@@Masuk123$$,0x6784f63d65640f0b2ac8d24a7bf814c0ba1a4820
jimmy.wisozk@merepost.com,@@Masuk123$$,0xdbb61bff9bcd9850690d9ed1a7c29276be4e6eb6
reid.olson@merepost.com,@@Masuk123$$,0x6cd8eac505ccd9d4dfdc3bdf549bfc3b8be40a20
jami.bayer@merepost.com,@@Masuk123$$,0x64813cb8b8c0eeea4db21d1ebc44b10cc999a3c9
joel.hudson@mailto.plus,@@Masuk123$$,0xaf8a5c09c3db737a2d4c160483fc89fbb100fa59
shizue.strosin@mailto.plus,@@Masuk123$$,0xb3b488f92e6bf4668f10bfcca1c5a393ad81752f
georgianne.blanda@fexbox.org,@@Masuk123$$,0x0cebca4c05944fabc948839c23ae435c7f399c92
ronald.beahan@merepost.com,@@Masuk123$$,0x421dce5bb94f585630fdceb0394156044de093bf
marline.bradtke@fexbox.org,@@Masuk123$$,0xa9bc0f2a3353928e6ec61117fbef524ba208d422
debbi.feeney@mailto.plus,@@Masuk123$$,0xbd3f4a9f05efc18bb07205c40f85a8ac24c491cf
derick.kozey@merepost.com,@@Masuk123$$,0xc731e163b3e597e425f3c284ab25db78b9bd4016
pablo.dibbert@rover.info,@@Masuk123$$,0x01422ff8befd6d9e678a6b0f1675d45704efb2b0
shella.torphy@fexbox.org,@@Masuk123$$,0x08d0576c3b68868f549704726092f3d61f140bb4
savannah.daugherty@mailto.plus,@@Masuk123$$,0x8bebc8b93bb24619a0b098219e67fd256a80fc4a
donnell.schneider@mailto.plus,@@Masuk123$$,0x2e9f612804c9eb80d3419b7f816c5994056311b0
oliver.bogan@merepost.com,@@Masuk123$$,0x14f243c93f70a238feb9ebd1d97815faab73df4d
lorena.okuneva@mailto.plus,@@Masuk123$$,0x766e7c6b8fe861b8f2d0ae68db8a634cc87886f0
rhett.wiegand@fexbox.org,@@Masuk123$$,0xb5293976de85332a6a91a63ac85e5ebc1fad5c70
ardelia.dooley@fexbox.org,@@Masuk123$$,0xafd9faade415f3aba343d29f742d1c3ae39d151b
chance.rau@mailto.plus,@@Masuk123$$,0x558ef0609a1659b0c1584730d4fbd5e883966017
garland.marks@mailto.plus,@@Masuk123$$,0xb41ba5eb6fc26857f50d77490049922b9bfd5c9a
lowell.quitzon@fexbox.org,@@Masuk123$$,0x680d4ce6033b45920990486ad83a7c5dc9ca61e8
domenica.lockman@mailto.plus,@@Masuk123$$,0x9842a9102295f0f2c1e24025c6d6b59cd96d15e9
emilio.sawayn@fexbox.org,@@Masuk123$$,0x82496b2c8f0c59b696d7f2389e68dbb1847722d3
madaline.rosenbaum@fexbox.org,@@Masuk123$$,0x97477b6e55a42e15caf3e2299ddf0d79dddde2c7
marcell.douglas@merepost.com,@@Masuk123$$,0xd61294ac4933c1d1e7da6890fa7fe61770254c97
lien.streich@fexbox.org,@@Masuk123$$,0x79c5b172fb1b5cadb43d1d2851035facfaf15fda
alessandra.ankunding@merepost.com,@@Masuk123$$,0x1ccf3cf47c65bb5944ea36fb745be4ea2d437f67
michal.friesen@fexbox.org,@@Masuk123$$,0xefb76019172b1fe1065c4b2fd0d4841905c46e1e
glenn.shanahan@rover.info,@@Masuk123$$,0x71cfe1d55ed5cf3d23293c756e4a9cd9abd7dc18
brooks.trantow@mailto.plus,@@Masuk123$$,0xd017ea7e4770c13980ffdcbaf096bab0c59facb2
may.stanton@fexbox.org,@@Masuk123$$,0xe958b6096a69187ae009e780987f973e269c73c4
mickey.botsford@fexbox.org,@@Masuk123$$,0xff07afe0885b30d36b6f003a912129d161635535
billy.reichert@mailto.plus,@@Masuk123$$,0xe583ec22a71b91cedb999ead5c067b66cacf7bcd
merle.d'amore@mailto.plus,@@Masuk123$$,0xf701698fc1ff0341797da0f0d4cb968c7855b745
luetta.wilkinson@fexbox.org,@@Masuk123$$,0x9b09041db29c7c1e64997d861fed5bcf6430c3a2
dusty.bradtke@rover.info,@@Masuk123$$,0x2f7dfbbe39ac2be3bc1de3cebe98c87b9c92b48e
jermaine.schultz@fexbox.org,@@Masuk123$$,0xc27e6a34c9d0c594c56915f6ec816fd93c225991
percy.toy@merepost.com,@@Masuk123$$,0x6162501e0dc7c467d0a0c3e37c1d3ff5d57c6c75
odell.fisher@fexbox.org,@@Masuk123$$,0xde73c36a17283c1d9915e4f2599aed6ea8b02c0b
sage.huels@rover.info,@@Masuk123$$,0x51360fa1732d53ce7cf6edb9e07f50a6b70bf30c
reanna.wisoky@fexbox.org,@@Masuk123$$,0xcf65b007908699d06daf64913c76973961c6ffbc
kyong.crona@fexbox.org,@@Masuk123$$,0xf7ed4233a04238883e07eb0e450b5538c4120858
maribeth.mclaughlin@rover.info,@@Masuk123$$,0xaa4caeb1fab41400b9a75bc7729e1b48c5b74d60
adriene.marks@mailto.plus,@@Masuk123$$,0xd9eb978b91434724c04803c841c1f9c024c45599
frederica.schmitt@fexbox.org,@@Masuk123$$,0x7202e4e90de3f2b96ab5fabb4e3d7a32ea2ba4bc
ethan.feeney@fexbox.org,@@Masuk123$$,0x31a651355fbdc976c8dda3596ad51503f05f4779
jena.denesik@mailto.plus,@@Masuk123$$,0x21c965463c7fd1c0bd0100cf0b97b095f19af391
jacquelynn.leuschke@fexbox.org,@@Masuk123$$,0x0bd87f3b61027aca7db23d8555711bd01097d3f3
efren.herzog@rover.info,@@Masuk123$$,0x8a25bd6c39c1d5f5eef296d583500160c48880d7
ernesto.jenkins@merepost.com,@@Masuk123$$,0xb36007ecfa08a86748e2e959e0161cdf9299d148
lynn.jaskolski@rover.info,@@Masuk123$$,0xf85803557f2c3e0f4c2212786bcf00ff3951976c
clementine.reichert@mailto.plus,@@Masuk123$$,0x7a63cf88e1bd71202a6031670932ccb93e3ba51f
frances.schuppe@mailto.plus,@@Masuk123$$,0x8451f560ffc07e7edc8f080f005b52145fec6fb5
jonah.smitham@fexbox.org,@@Masuk123$$,0x7255290632204cba96ebe9fded7487d64eb38fa1
leif.fisher@rover.info,@@Masuk123$$,0xe39e4b764cf3334edc2ed88de6a9b71dceae0278
mendy.osinski@merepost.com,@@Masuk123$$,0x654cee8f5361f82dab31ec70f611bc4205178093
perry.cronin@mailto.plus,@@Masuk123$$,0x0b067e03dc37720bed83b2e058e4e4b3ce466f34
archie.medhurst@mailto.plus,@@Masuk123$$,0x9c4f6fa67e734656931b2500c56b706cdfeb9dbe
viva.ankunding@rover.info,@@Masuk123$$,0xc58c94afa69ef10255900bc9246a86c837e10c43
caryl.lubowitz@fexbox.org,@@Masuk123$$,0xee35d4729c21fc135ee7ad01dcb00d50e0617851
rima.ernser@fexbox.org,@@Masuk123$$,0xe6113b562b2a4d1e73fd3abbb5176904bd817f68
terrell.o'hara@merepost.com,@@Masuk123$$,0xc72c3eeda8f216c87fee2b54bc04667a2a61bcee
troy.bashirian@merepost.com,@@Masuk123$$,0xd18a907d8c2c61a5fbda17d6dac1b10ec2399848
humberto.king@fexbox.org,@@Masuk123$$,0x64a2fb3d73a1876fbbdd96570a895eb96b7c406b
kareen.sawayn@fexbox.org,@@Masuk123$$,0x2034a8bb7a254543d932515b4ce9208cc6287c52
broderick.schroeder@mailto.plus,@@Masuk123$$,0x17ffc91a98b72689ae0b7919a2adb855eb2f2790
sharee.nolan@merepost.com,@@Masuk123$$,0x649c27548487d72d5d4c432bd2c14e0a8d2ba3db
tyson.shanahan@fexbox.org,@@Masuk123$$,0x061116b8c60e9ca80155c716270a773ff1d91c64
tonita.herman@mailto.plus,@@Masuk123$$,0x9aa3bf5ff015e966ccf6b95951d8d60dc8975203
alecia.berge@merepost.com,@@Masuk123$$,0x905e0a7ebec541f47020ebc945d9b132600aa160
dallas.thompson@mailto.plus,@@Masuk123$$,0xd6f54b73636ef93b296472535ea2a552e49cf265
cameron.spencer@mailto.plus,@@Masuk123$$,0x14eff771cdec477dc93b7b8d2e6ae8165d2c7e64
princess.lehner@mailto.plus,@@Masuk123$$,0x04e5e18a52597fd46a2a2b45fb2784a79adc80e4
santiago.baumbach@mailto.plus,@@Masuk123$$,0x4de99a37c481827d6fe83ef8eae3135c90cd1dee
gino.schultz@merepost.com,@@Masuk123$$,0x25d18d7786fbc5f8ad2639eda4a5f1f60d6a196a
pam.treutel@mailto.plus,@@Masuk123$$,0x9a44924074b960f53b67e3e4358078bb5bb5d952
orpha.gusikowski@rover.info,@@Masuk123$$,0x949eb89ccaf2683374ee5c5dd19dd3a0553ce6ce
willian.sauer@mailto.plus,@@Masuk123$$,0x6ca3b7be686fc376f7c847226435858d1a68087a
lance.nader@fexbox.org,@@Masuk123$$,0x44f027d4239c2ffd4f3fe6384c88e895eda15f8d
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
