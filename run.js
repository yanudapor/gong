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
genia.hirthe@mailto.plus,@@Masuk123$$,0x5c53c4ed8070e96e7874a96b5be3922f33ef07cf
marlana.koss@fexbox.org,@@Masuk123$$,0x67bb80af883805ee8d4f62ae2b2695a4415e5174
joseph.reichert@mailto.plus,@@Masuk123$$,0xc78304f8d37410d0a280499781a21581417301a8
gena.spinka@fexbox.org,@@Masuk123$$,0xa421461f1267bdace9852ec3ce599b1acc4b9a54
belen.kuhic@merepost.com,@@Masuk123$$,0x45d2472388bac7efebcbc97634e525c6aaba1090
lala.ratke@fexbox.org,@@Masuk123$$,0x2086f8bb4d00a455f8b500f520eda671fa7bf62a
thao.kovacek@mailto.plus,@@Masuk123$$,0x9af9db72dd2e49d07246e6958b85f21e045d8611
jerry.erdman@merepost.com,@@Masuk123$$,0x6170fbfdbc8b8c29db4eff5af0c78a5c01795e4a
jeffery.baumbach@rover.info,@@Masuk123$$,0xd8ae9420dfb983c7b50e4b48ee1dfb15a5fee350
marlana.ruecker@rover.info,@@Masuk123$$,0xc57c1be3aeb6f77c6f26b4940f9d7e5c9ef1776f
francina.waelchi@fexbox.org,@@Masuk123$$,0xc5a963c58ada63df492ea2f70258c63815e504e1
romeo.bauch@merepost.com,@@Masuk123$$,0xe0ac1e74c763f014e4ada7aad33fc2a243c1215b
toby.grady@fexbox.org,@@Masuk123$$,0x72b43872dff21b37102e91219248b06cfc1e0994
elsy.kiehn@fexbox.org,@@Masuk123$$,0x145bfe5f89c63d85e8ecef9c527fbbd62e1528ce
eldora.kilback@merepost.com,@@Masuk123$$,0x00e1f5c071d2999ef17fd8cbed202bda59e93137
glinda.yundt@rover.info,@@Masuk123$$,0x6d0591b96dcfb31f5b2d77c57685bc9b4df2d4a6
randall.gutkowski@merepost.com,@@Masuk123$$,0x9b03fbcfa00707ac7d5b18269acabe0bfd570647
rob.zboncak@mailto.plus,@@Masuk123$$,0x640a1020376268439a41ea9884d5dfc8669214db
carlena.wunsch@mailto.plus,@@Masuk123$$,0x6fa9d0332797e006d56984b5c4f15cc8796269c2
aundrea.huels@fexbox.org,@@Masuk123$$,0x2085137335e4146d652d0410a682b5a134432dbd
edison.wilderman@merepost.com,@@Masuk123$$,0xc64c1db5098d18f26cb7bbb9807b2a6105c4dcd7
judson.dooley@fexbox.org,@@Masuk123$$,0xbb8b028d28bf4dfca95cb47154e7bb07c047bb5b
annika.powlowski@mailto.plus,@@Masuk123$$,0x6c63bceb0e48ae1a89259a0e8cc318b3e6be7499
florida.ruecker@merepost.com,@@Masuk123$$,0x7bfbe8b1932f061d04e8525932a721e918a4186f
emory.nikolaus@merepost.com,@@Masuk123$$,0xcc58c221fafd594297b9bc86ca50ec59d8247389
nikita.senger@merepost.com,@@Masuk123$$,0x5ddd86798d58930357f51782fac7ccb6335af7f8
dulce.crist@mailto.plus,@@Masuk123$$,0x42239fed21247b80bf2c6774ede354a1ddb698d7
kermit.swaniawski@rover.info,@@Masuk123$$,0xb23c389f88d6b665fac689b151914671fa0722e6
nicholas.schamberger@merepost.com,@@Masuk123$$,0x9dd3e426fb27133dbec685c6ead1f46acbc42de8
warner.lubowitz@mailto.plus,@@Masuk123$$,0xd2d1ab95a0b420f8bfea522f4c3c9e0af656af35
erwin.adams@mailto.plus,@@Masuk123$$,0xeb7f9ffacceeaea3520468738749b7ed30e57be5
kay.lockman@mailto.plus,@@Masuk123$$,0x2676f03ee61c0450a4018d66e3cfd528811e897e
lee.collins@mailto.plus,@@Masuk123$$,0xe4caabf0528b7071699991ccdc007e6071a34e9d
nicholas.orn@fexbox.org,@@Masuk123$$,0xa000af791f9cf9c3ef77325e812399aa07f0b59e
yuk.hyatt@mailto.plus,@@Masuk123$$,0xe3b7aa5e7ef4d27da5fc07e697fd8124b0f77a4a
coleman.friesen@rover.info,@@Masuk123$$,0x5043841d5a0c160fcd545e96a7ae932359d5e19a
kandice.nienow@fexbox.org,@@Masuk123$$,0x6f1e60f5bbf38dce65185ecba84ffeee29a5ba42
danita.romaguera@rover.info,@@Masuk123$$,0x561b53c80da06daefc6d1b11310ec79968cdef89
laure.kunde@merepost.com,@@Masuk123$$,0xa14d2f535177301c32e1a306e2888c1ed0e69724
bernard.prosacco@rover.info,@@Masuk123$$,0xba0fdaa135135264a272609e8f9062a28c815df3
nohemi.hagenes@rover.info,@@Masuk123$$,0x26f751a96288ae79565da0826b793373d6e9f2ae
joan.ledner@rover.info,@@Masuk123$$,0x699bf657e9a7e5ff97f87fb23b531c82457eafbe
wiley.d'amore@merepost.com,@@Masuk123$$,0x2b252f71f57d7df6762b3443b756e8be20a3d4a3
edgar.gottlieb@merepost.com,@@Masuk123$$,0x8cecddfe6fce596aa2adce29710b23bc8418f01a
jewel.halvorson@merepost.com,@@Masuk123$$,0x987335048ccc05f58f9668e772424c9c501e3a16
ernest.deckow@rover.info,@@Masuk123$$,0x655b3550ba73bc42253cf32b253047171ec323c5
jasper.rutherford@merepost.com,@@Masuk123$$,0xe9ae3d608f53bee2d32eb7050fc84597c2d7e505
barb.cummerata@merepost.com,@@Masuk123$$,0xb7456617bb9bd3c0c860b3fe804f4d98860e1d41
jaimee.beier@fexbox.org,@@Masuk123$$,0x9444f00d014c740828730c851caca9cd2a6382f9
lucien.metz@fexbox.org,@@Masuk123$$,0xeb389de2386479c6acb39b07fb3bd24c1adea69a
rosie.cummings@mailto.plus,@@Masuk123$$,0xf90860930c7091c6359282b8fbb90fb1a16852a0
almeta.pfannerstill@rover.info,@@Masuk123$$,0xb3640a1087ee52708e666654a187f2e0e70f07c7
ellsworth.ryan@merepost.com,@@Masuk123$$,0x95abcf725420ca88db7eb15bfaa1e1e75d69f07a
hiram.bernier@mailto.plus,@@Masuk123$$,0x277187e3705135a43285ca88749f99d138ff7399
stanford.swaniawski@mailto.plus,@@Masuk123$$,0x719dbb2aba4b592d48b7b900afed40db8d47e03e
altha.conn@rover.info,@@Masuk123$$,0x3779b8959b1f1ccd134f7e550c1c80fa9ffcf77f
jordan.hirthe@rover.info,@@Masuk123$$,0x14215a22e782441b7c32b9c63cc2a12f8c170722
chong.schulist@rover.info,@@Masuk123$$,0xc631c95ea41df2deabb797cc4e878b447c4f1dc9
patrick.raynor@fexbox.org,@@Masuk123$$,0x199b13b9da292e72aa324b55fa0b97e2e2be5025
junior.grimes@rover.info,@@Masuk123$$,0x2e194fc0c9285b4de15933bfb0214f0c5cc351c8
tamar.grady@mailto.plus,@@Masuk123$$,0xbe88241ee77299e083fe8f80f6fe4b1898791811
antony.rosenbaum@merepost.com,@@Masuk123$$,0x335b2f6fde3da7e85b28febae68bbf4d11f13a07
rene.deckow@fexbox.org,@@Masuk123$$,0xe2a85ab832703e341cb25cb648a82cc10ed6e344
hyman.terry@rover.info,@@Masuk123$$,0xa59ed0aeda9b9c68d5885c53e12751bea54c7448
alycia.rippin@fexbox.org,@@Masuk123$$,0x50225d63b57a57fcbb2dad53968ff2dc0efccb9d
malissa.simonis@rover.info,@@Masuk123$$,0x3e3d36634bfb31da4096c043d39ad9e3f47b587b
desmond.stoltenberg@mailto.plus,@@Masuk123$$,0xd0e66b315c361307f4154c1794f070a4a31b91df
enid.herzog@fexbox.org,@@Masuk123$$,0x44680100f554f8b0cc9dc082080d75d1fc07983e
margarite.powlowski@fexbox.org,@@Masuk123$$,0xef2b0ba697170e250d713ff6e0192d4fb2623a16
grover.pagac@fexbox.org,@@Masuk123$$,0xf58dfe313fc02a08bc7c7e650590e6a8482b43b6
harvey.huel@fexbox.org,@@Masuk123$$,0xf46edfc149c08d6dfe3586710d49dea828610f23
antonio.skiles@fexbox.org,@@Masuk123$$,0x041cdb0d81a79374396828dcad7fb1ff9efb1771
del.luettgen@mailto.plus,@@Masuk123$$,0xa1d8275f6b851db9263b6e4197b1ab28fc18b78a
lindsay.jerde@rover.info,@@Masuk123$$,0x0a74305498d812b8818373db9416c941702d22cc
henry.breitenberg@fexbox.org,@@Masuk123$$,0x40e9c2eaa8ef227107e9bbef243024b3750eca60
napoleon.hodkiewicz@mailto.plus,@@Masuk123$$,0x3f51b937f3aeea299e7d90b1907ee4c46770da38
anthony.dicki@rover.info,@@Masuk123$$,0x23c1f2187191cf3919473a652befff1b3184cac7
pauletta.lesch@fexbox.org,@@Masuk123$$,0x993b85ed8cfa54080b4084fe396b89192bfb3092
shirlene.balistreri@fexbox.org,@@Masuk123$$,0x0a24bb1c2627f4a4d9671ceb8b8aeecd8d1fb614
mitchell.mcclure@merepost.com,@@Masuk123$$,0x7287130fccdcc066eadc4aafbbb3965239c726ca
rueben.white@fexbox.org,@@Masuk123$$,0x05ee8af2632dc9c5a15f55b43bbbf9abd291478c
lesli.dietrich@rover.info,@@Masuk123$$,0x689669e43483cc0a948cb6fb2d60bcbde5c623a8
tabetha.mueller@merepost.com,@@Masuk123$$,0xb32c2788c0d152441d075e5de5d58ef5050e1504
hien.white@mailto.plus,@@Masuk123$$,0xb2966a68f6d7e477470b60605a3f7f7e16161880
gerda.towne@mailto.plus,@@Masuk123$$,0x19ba4673759536defda12c1b09f00710393cde8d
sang.bahringer@rover.info,@@Masuk123$$,0x3b0fbed4a8c016ab4e7682bcd701bf69b7189eb5
marcus.wolff@merepost.com,@@Masuk123$$,0x0746febd4bd26ecd2665e7f2ad95b1acd763ada6
darron.lynch@mailto.plus,@@Masuk123$$,0x9f94d389b4a1b810841a01cae307283c5c9fd83f
vernie.dietrich@mailto.plus,@@Masuk123$$,0xf7ee29c98209b333b85e296bd3550a1f13c418a5
wynona.zulauf@rover.info,@@Masuk123$$,0xcb3984a227168a4fe21bec98b0a661ac9ff7129d
carlo.dicki@mailto.plus,@@Masuk123$$,0x64e7f26814bd4d52deef1ea8ce9eff2c1fcb9c0e
domingo.abshire@fexbox.org,@@Masuk123$$,0x8d8b3f34eefe9230c87ccc89662fb92fe09ffc5d
rhona.kreiger@rover.info,@@Masuk123$$,0x4050d33db1c0c567bdc93708fbe19f68714c3304
anya.vonrueden@rover.info,@@Masuk123$$,0xca81a6e031f2ecf551e44495d168cbb5c8d6d443
josiah.crist@mailto.plus,@@Masuk123$$,0x213ad499175f025e8fe225a6bcad1b8eb2132bea
shena.blick@mailto.plus,@@Masuk123$$,0xe79d3c86e93018675914d8ce7b998190cdbd4038
daina.kohler@rover.info,@@Masuk123$$,0xe1e385a1da6b523e989cd01ae01febbe8e5de412
roni.kiehn@merepost.com,@@Masuk123$$,0xb13dba05d5adf515de35c50e7dbb7c536799f187
jonathan.lakin@merepost.com,@@Masuk123$$,0x809ebfcaba068653501acf29a19df5ee73ba772c
damian.bode@mailto.plus,@@Masuk123$$,0xb6d39de69482f6780505500f995b7b6cb77b8990
wanetta.schroeder@fexbox.org,@@Masuk123$$,0x262f7e839649bd056150d633abd91b63b23467f7
piedad.beer@mailto.plus,@@Masuk123$$,0x707c12d6db8c5728a0f255499e9c7279fed9c9c1
freddy.stoltenberg@fexbox.org,@@Masuk123$$,0xe6673ad7426ab938976ea7f49f5fe7119f52f65e
connie.mann@rover.info,@@Masuk123$$,0x52edb1958fb44476478cf848aee09cc7e6d3c69e
gary.corwin@merepost.com,@@Masuk123$$,0x4a7dcddec546772cf5d3af5085f868b0a03452f5
alisha.jenkins@rover.info,@@Masuk123$$,0xfcb4119ef4449a9af7c3c12b294b2742431950b2
wiley.schuppe@mailto.plus,@@Masuk123$$,0x2a8f26ff93bd4882a64a782684ae1769f2f599db
elodia.corwin@rover.info,@@Masuk123$$,0x0b2f9b0e0e5f8ca6a614b33c20c8ff171594fb37
mckinley.green@fexbox.org,@@Masuk123$$,0x52c65f1fe678e80b5ff9160b5be57cc8fb6c306a
ned.howe@rover.info,@@Masuk123$$,0x9863e4570f5695d56f33393a95bd1878ba576c22
hong.harris@merepost.com,@@Masuk123$$,0x9293bc64866f228cc9bbac6fb6c3ece6ff72d363
stevie.bode@fexbox.org,@@Masuk123$$,0xe2ff8c0d753d9dcec74f8050c5bd8f8349a0f792
denisse.volkman@fexbox.org,@@Masuk123$$,0x96623f65c780eecc3b097c5af6b9c00240d7cecd
angel.schowalter@rover.info,@@Masuk123$$,0x5d706980eaea266913707db2142e747254056338
contessa.jenkins@merepost.com,@@Masuk123$$,0x53ba859cf995834041d628d70342b6fc2627adb2
marc.walsh@fexbox.org,@@Masuk123$$,0xd53650a7aba269b2524e3a82a6b8ac7988a98ceb
anton.jacobi@merepost.com,@@Masuk123$$,0x4092e0e666b3300cc458f0f92a83aad3bee30a35
beau.parisian@fexbox.org,@@Masuk123$$,0x66a8ef4b4c68e9633e275ff8ad5606c702fb64cd
charlie.ortiz@fexbox.org,@@Masuk123$$,0x4b513fb52f126b1a04f33ff1b75d674bc3b6faba
merissa.kreiger@merepost.com,@@Masuk123$$,0xaffc14d00db4174225d786eba2e543e0adca4c1c
keneth.heathcote@rover.info,@@Masuk123$$,0x8ac95434e99d8933c4115b18fc27e5c6413bdc3d
tori.denesik@rover.info,@@Masuk123$$,0x53ecacfa811348179491728454081f0bdfef7e23
sharan.cormier@mailto.plus,@@Masuk123$$,0x1f207938d932ff21dad99d2a00c93220d1ab79e3
arlie.robel@fexbox.org,@@Masuk123$$,0x6745f2cac67124cc5d9cc25f372d2ab27e1e3eaa
isaiah.lang@fexbox.org,@@Masuk123$$,0x6723a24a01b676cffc953efbf9a4d1329df32ae3
janey.abernathy@merepost.com,@@Masuk123$$,0x304e466183807dc5329fe1b7cb58ed91542f38ed
josef.lockman@fexbox.org,@@Masuk123$$,0xd6a394949842c4bd06a2701ffaada01626a12f1f
steven.veum@rover.info,@@Masuk123$$,0x77b86bc587449f02267ce83689221df7d2ae02d9
earle.schaden@merepost.com,@@Masuk123$$,0x315ddd41fa8a87dfd658640637b0f4d50e85457d
nicol.crona@rover.info,@@Masuk123$$,0xbaad2c58d90f85e93461788d264495bb883a647f
bryce.jast@merepost.com,@@Masuk123$$,0xe3e0f0c3108c186cfdf54006eba2faf660d9f69c
grant.goldner@merepost.com,@@Masuk123$$,0x94afc9d733bd934e9ca6fdb6c2b61312ecbd54e0
kiana.buckridge@mailto.plus,@@Masuk123$$,0xb6e6d2088e6c20e85d4d04bed529e71998eeebd2
bruno.cartwright@merepost.com,@@Masuk123$$,0x37bcaf8e76d9f1849255ce4e2698aecee28c0369
thurman.langworth@mailto.plus,@@Masuk123$$,0x84d1bc8ae4036826f1f3ec7076eff4b35e30afe8
sid.gerlach@rover.info,@@Masuk123$$,0x4a3017f8db570857e0e998b2d29824639f47e529
dan.kuhlman@rover.info,@@Masuk123$$,0x2b8b90e76aaebeca15ef648b1f4f7b564d12aab6
austin.buckridge@rover.info,@@Masuk123$$,0x08c7d30ffa07a4eff775aefcbcbe019af668c7c3
trudi.murazik@mailto.plus,@@Masuk123$$,0xf513cacb248e0ffa37ed85fbdd86809c48f01f19
mariella.douglas@merepost.com,@@Masuk123$$,0xb6bbf9ea35d1756db2391e8c65763b04107c4999
annamarie.armstrong@fexbox.org,@@Masuk123$$,0xbc8d551cde2063a0429df1a1d505e2fb845801d0
dionne.williamson@mailto.plus,@@Masuk123$$,0x19ac286d031a919baf427c0352f0819de955730c
alonzo.dach@merepost.com,@@Masuk123$$,0xf5002f5faea0ad945b1c3d8dff381fbfeea6e816
hilda.gleichner@mailto.plus,@@Masuk123$$,0xee189b026533464b7454b6ae47c5829e001baada
chere.herzog@mailto.plus,@@Masuk123$$,0x29b4ee018296b7ba2746aa262cecec07ba51b3ac
vicki.bosco@mailto.plus,@@Masuk123$$,0x0f9194b760164d9fb22a6c64a39003703c6acef0
jillian.zieme@fexbox.org,@@Masuk123$$,0xb40dae8e97866f81ddabfa9e3965bce878869c9c
robbie.walsh@merepost.com,@@Masuk123$$,0xfabe13890884b1b3ad560f6c84fc9eb1c727b394
olevia.gerlach@merepost.com,@@Masuk123$$,0x4cae1f8ac43a1779395394067823c54801452586
anh.padberg@mailto.plus,@@Masuk123$$,0x51881e1490c6b46881998f92e6f26f0c34128d94
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
