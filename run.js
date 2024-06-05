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
kayleigh.bruen@fexbox.org,@@Masuk123$$,0xd4d052ebf497b15b1285a51655b42cc203db2e8d
spencer.huels@mailto.plus,@@Masuk123$$,0x2eaf36d8432639aa8211f26f0991737f989f8a79
breanne.hand@fexbox.org,@@Masuk123$$,0xbaf4d83761d153b0da21e380c66259b21b321785
mercy.waters@mailto.plus,@@Masuk123$$,0x2a7d10e692b9196651d314908b6fed7aa773f3e6
grace.haley@mailto.plus,@@Masuk123$$,0x67a885ba19a26da2f5a9cffd53412711d5e5f472
lorna.heaney@mailto.plus,@@Masuk123$$,0x54c558e14ad76acf194a8c96a2512b7273a0770c
beryl.schmitt@mailto.plus,@@Masuk123$$,0x79bc5da090b37d437efd971e9906856a8ade038e
andre.schmidt@fexbox.org,@@Masuk123$$,0xb0f2075eeb84d831e28bd528ec6f25077e2550b7
virgilio.padberg@merepost.com,@@Masuk123$$,0x0cded8d2e62ed77d9f9ba09d889cb05e77354145
salvatore.lakin@mailto.plus,@@Masuk123$$,0x12635a0f7b8dd8df50466fec547d058d3ce946d1
collin.o'reilly@merepost.com,@@Masuk123$$,0x1b3daebaf8f27d9004d8e3bdb8b4c0388b5c4434
christene.heidenreich@mailto.plus,@@Masuk123$$,0xc6c861411004875a62ad6d7b68331d30cf18bf3e
tyler.dickens@merepost.com,@@Masuk123$$,0x673841f3a78a750ce1f2953e4bb9bb8f3490c9ca
hung.raynor@mailto.plus,@@Masuk123$$,0x5c863adaf630a0e6ef97df79b96bf1d60afca27c
arleen.stoltenberg@merepost.com,@@Masuk123$$,0xb8d03a978d291bbb5ea6cdca7b947beaedc0c19c
katherin.goyette@merepost.com,@@Masuk123$$,0x726d00200f48207e98bfc3e2a91f48c1719f93f7
tresa.boyle@fexbox.org,@@Masuk123$$,0x394f1e19e6d4ab3f3c75b1aa4ff5cdc008d61b7c
ray.herman@merepost.com,@@Masuk123$$,0xf316e35057b1097a9d0a2b15d198df9e61086bf9
cira.hickle@merepost.com,@@Masuk123$$,0xa88a87bf23fde588f4e1c9d97d7b4bbbef6d9036
roscoe.stanton@mailto.plus,@@Masuk123$$,0x1fc2616b8225045652ca14b90157b9fb2211a521
della.kreiger@merepost.com,@@Masuk123$$,0x2f70106cc24a2cd24031c74e9101d1467b93f655
harley.mcglynn@merepost.com,@@Masuk123$$,0xc46636b51019bc71dbd2b3528ece9f693d59b3ad
jeanene.stracke@fexbox.org,@@Masuk123$$,0xb27e3d5abd196b066594bbc8f5f478b6c76b7a2f
angella.dooley@merepost.com,@@Masuk123$$,0x407de02f6299d333452a029c9215751d60669efe
tomas.lebsack@fexbox.org,@@Masuk123$$,0xcac8df2ad3c5ef3da23d53be030a443e089bf47a
lucien.luettgen@mailto.plus,@@Masuk123$$,0x763c1b3292e5c6bcd82d42d1bd29e05141720da1
timmy.hackett@fexbox.org,@@Masuk123$$,0x87c0bbce6a0345cd8a3fc48e9edde5f392ab889b
carmen.wilderman@mailto.plus,@@Masuk123$$,0x3356fbae5aac3e555565e311a0897a5233547991
everette.connelly@fexbox.org,@@Masuk123$$,0x098afc569e01a9ab91891b17b8c5691dbb974b32
tod.stroman@fexbox.org,@@Masuk123$$,0xc1beb6c6f6c433c7aef1f2990c3f8e264b7ac54b
houston.cassin@rover.info,@@Masuk123$$,0xc326de6ba7659b02385a4ed69bca6ea457a1e180
shela.bartell@fexbox.org,@@Masuk123$$,0xb6baf498042b92995925647570ea7e436ab9ad04
pam.dicki@rover.info,@@Masuk123$$,0x321f839e689c191a59b1d3b696954cc65428b91d
adele.hane@fexbox.org,@@Masuk123$$,0xf0fc4dc81c7ed9812dce50d95e9b3c3af3cfa477
gustavo.bode@mailto.plus,@@Masuk123$$,0x8cfc609df8df999eb8dd69e2a04549917f2cb9eb
contessa.conroy@fexbox.org,@@Masuk123$$,0x40b7f017485f718fcc8879c342d3bf1e4521007e
riley.casper@rover.info,@@Masuk123$$,0x57b853d029e4b0597ed9eda68446eeff1dd8ca15
arianna.wolf@fexbox.org,@@Masuk123$$,0x2a2e82199199bd62a3ef4c5b3cdddef0548ee4b9
hunter.larkin@merepost.com,@@Masuk123$$,0xa1198ebe8675bd8d42fc59f7adc955e7804f2b78
lisbeth.hilpert@mailto.plus,@@Masuk123$$,0x6b202373e5c5b120c1897846bcefec5aacfadf8c
courtney.murphy@fexbox.org,@@Masuk123$$,0x113df41a7be4d243aeae5c3ce83d8c104426379b
cedrick.hettinger@mailto.plus,@@Masuk123$$,0x15570100d9b104055e09b7694a0de05936812277
ryan.heaney@mailto.plus,@@Masuk123$$,0x07531a7eba1b10ed520714fd876d2cccd155aeb5
rocco.yundt@mailto.plus,@@Masuk123$$,0x6aed1accaf99ae39be9499b2884bf61252c30913
rickie.zemlak@mailto.plus,@@Masuk123$$,0xfdcae59d92d38fe63a75ea6263bed94545c3e013
dane.kuvalis@rover.info,@@Masuk123$$,0xb0faa208d237be9eb58fba7bcd44580656423df4
reynalda.howell@rover.info,@@Masuk123$$,0x0a1c8c16a3b98a9884a8df62a5d3ae8b51068111
delmy.hahn@merepost.com,@@Masuk123$$,0x7e0cff0cbc45a44748f2d280b19b8278ad1b0628
elden.ratke@mailto.plus,@@Masuk123$$,0xe1d4ef57f63781b9ccdd79480c5e81daadd3ea78
lauretta.o'keefe@rover.info,@@Masuk123$$,0x6d35b449a1a25eed8b3c9bfdfdd759a97bb662f9
wonda.grimes@fexbox.org,@@Masuk123$$,0xc6c596370c33c5537231c96b521e244e66e00ab4
mckinley.buckridge@fexbox.org,@@Masuk123$$,0x373ab5fc4048e41730082968b3732db20c49c142
clifton.dare@fexbox.org,@@Masuk123$$,0x7fc7f89847926211918469f44c56c22ff7e2903e
pura.kris@rover.info,@@Masuk123$$,0x9cba54e5d713d9e287c4fbdceec88b5d349e2a24
craig.wolff@fexbox.org,@@Masuk123$$,0xff35869f08ba14df48b137883e63b4cf043f75ca
arlena.abernathy@rover.info,@@Masuk123$$,0x0ff320786bf773acdcfd838f921bf0dda13555a1
oscar.yost@merepost.com,@@Masuk123$$,0xf6a2ab4a0955840e62f478e555fabed7374b9879
paris.auer@fexbox.org,@@Masuk123$$,0xea5a8087a895b8248d2eebe9ea3422ab3d678ee0
tuan.braun@merepost.com,@@Masuk123$$,0x45fb5b4ec2aad1b3cd34339df9300584524bc1fc
dawne.reinger@merepost.com,@@Masuk123$$,0xf52f73a7d4fbcb0313f2595c0ce240472f0ea01e
heather.miller@merepost.com,@@Masuk123$$,0x5fd01cc82eb48665596a5fb37a2bfaba9fc49dcf
nanette.o'conner@mailto.plus,@@Masuk123$$,0x5ba19cb8a22bbea803aa4292471a74b232dca5d8
lyla.haag@mailto.plus,@@Masuk123$$,0x1ef3081e0a284695979569b979ac55e9f537f346
ricardo.keebler@merepost.com,@@Masuk123$$,0x17419c79fb33f9e6acae95955ee45c85c5e79356
jamar.lind@fexbox.org,@@Masuk123$$,0xae10147271534ac9710ebf7d663492bee61626c9
isela.o'hara@rover.info,@@Masuk123$$,0x0ed7a7677f7313f3464ff0d49d946c5b64925d24
bennett.hammes@mailto.plus,@@Masuk123$$,0x75a48dc602028ed0315429d456f45bdfe642d6c0
kenyetta.raynor@fexbox.org,@@Masuk123$$,0x5921da9261c7ba868e7a12ce8457498613aa7c77
newton.vonrueden@rover.info,@@Masuk123$$,0x1b85a53b6431cb3586ecbf6f091e43268040907e
beaulah.hettinger@rover.info,@@Masuk123$$,0x988c0205536e248ea8be482f914501ef9f8c0a77
mae.pacocha@mailto.plus,@@Masuk123$$,0x002c146516fdb7d6dce35c7c235ae10f81d4c4b5
gina.hettinger@merepost.com,@@Masuk123$$,0xbe4f1857539ba40e35b07d40551863735c0a4092
sirena.friesen@rover.info,@@Masuk123$$,0xdefb8c41af388c6bbd13b35c4c2272dac6828eee
walton.gleason@rover.info,@@Masuk123$$,0x19ad2eb9786df28992da90ae0b6274f0ef39f2a8
darwin.koelpin@fexbox.org,@@Masuk123$$,0x305d7a8a7f3c867f5779eda9b1e5f384199f0211
domingo.turner@fexbox.org,@@Masuk123$$,0xc3edd0d816b4fda3eec5f281d7694cad18574456
mozell.parisian@merepost.com,@@Masuk123$$,0xcf8f5269bd136c556ac4121c6e02823ea821fa2f
claud.prohaska@rover.info,@@Masuk123$$,0xe25e1e0a9d2459caa09432443e01716b8f12c860
norah.flatley@merepost.com,@@Masuk123$$,0xe3b1861dd148898bb926044bb7593c6ea5ec3cc3
benton.murazik@mailto.plus,@@Masuk123$$,0x175bb892f451020e7c265ab6012f34f6d571ac90
mitch.kertzmann@rover.info,@@Masuk123$$,0x9ab794b1821b1beffd0de8119e908cff5847180a
elodia.mraz@merepost.com,@@Masuk123$$,0x7b9ec297b2f74de877958e14eb0085869ccf1a2f
nettie.bayer@fexbox.org,@@Masuk123$$,0x2b88d73a3fe15e53feb393fd0526be4da646590a
paula.jerde@mailto.plus,@@Masuk123$$,0x6876259c1ab1b529c070cdadc54e33bc53b1c9e8
jospeh.mcglynn@merepost.com,@@Masuk123$$,0x436f5e7ad23bd725d7893484d35db5ab180e10b4
darrel.larkin@fexbox.org,@@Masuk123$$,0x1366343c6007f0bff7fc77a84faf2820bbfa9809
kelvin.mann@rover.info,@@Masuk123$$,0xa419b170480371ee772094f212d8db0f73b29143
shila.mohr@mailto.plus,@@Masuk123$$,0xca2e03c7ecd252779d588d524bdc43607458a290
bobbye.halvorson@merepost.com,@@Masuk123$$,0xa1a4be13782e127763fbb43548df1fdf81b4b520
august.vonrueden@fexbox.org,@@Masuk123$$,0xe5200eee807b81d0b1daec63af8424eefc51d79d
chase.waelchi@rover.info,@@Masuk123$$,0xa279653d72ff38171d933fc8f56848d3d5f56d55
shila.schaden@fexbox.org,@@Masuk123$$,0xf3f51f252911c9a2a2b195197ffcffc6c13b2363
saundra.okuneva@fexbox.org,@@Masuk123$$,0x7878a488f98b41f8fecb41ca90d5f8f1e7178f0d
emilio.mann@fexbox.org,@@Masuk123$$,0x8700de05d35d1f56c200b0d3ce897d23cf5750cd
anisha.trantow@rover.info,@@Masuk123$$,0x380538a9d094d51298e04601506dbe31433c8a8f
marco.harvey@mailto.plus,@@Masuk123$$,0x9addfc5fc6e53745291d6647d68dd2d38530c635
viva.welch@rover.info,@@Masuk123$$,0x8c0cc17e56861214f828a5501174026f63db5c77
garret.sporer@merepost.com,@@Masuk123$$,0xf925348305f9bba0c466b5be05e4f66bc4e83976
juanita.lemke@mailto.plus,@@Masuk123$$,0x3da7395a992545e7a4487722f997695746f7b69f
lecia.jaskolski@rover.info,@@Masuk123$$,0xcf5f6e24a85ad744b80a4d41c2c3980eadd8f1ec
leon.walker@rover.info,@@Masuk123$$,0x7c8497976b609af3cd58da4f19aa39c22c5f8596
reggie.jenkins@merepost.com,@@Masuk123$$,0x745fa6c955d8803cb5677547c5da78e8f19ab586
dino.wilkinson@fexbox.org,@@Masuk123$$,0xd08339064c1d69772ff1c358cd16de91a25518e5
herschel.volkman@fexbox.org,@@Masuk123$$,0x894acad3e30ef1594ba914eb83a9a950ef1e2b1a
kelsi.lakin@merepost.com,@@Masuk123$$,0x1c5d5ce679bf4d32fd99374277301212df687e80
taisha.pacocha@merepost.com,@@Masuk123$$,0x23f95a40eca619fe4427f29a05d61f77ad827c71
cherelle.green@rover.info,@@Masuk123$$,0x00ec1d2cce02c4eceb5e136721fef62b485f3080
margy.ward@fexbox.org,@@Masuk123$$,0x5f3c47532b2b9cfabbf6c8724533000bcd4c51f8
wilbert.lemke@rover.info,@@Masuk123$$,0x61b243c0f1a4f4225ea5d9d8d9ef2b5f5e6888e5
rodrigo.goyette@rover.info,@@Masuk123$$,0x740b9035c4fe75b886167a570ee647e202b56c72
jamaal.runte@merepost.com,@@Masuk123$$,0x40294a3f1b532b7dd2f1c4a4c802a89a4acea3d4
luis.hamill@rover.info,@@Masuk123$$,0xd3e18c9b475bf1de60a4a68964a8b0e903e7a062
angelica.feeney@rover.info,@@Masuk123$$,0xd3034c03cc89bc122e3cae233ca653ebf7914675
melda.walsh@merepost.com,@@Masuk123$$,0x893179309e581b8ba8ecb1237e697880ea1da275
jacques.stanton@mailto.plus,@@Masuk123$$,0x4cfd7a3db0c035c6183e321a576001d0acec37a8
yoshiko.walter@fexbox.org,@@Masuk123$$,0xb33cf0d820d597641760813ad9e6aa461e7c1fd9
tim.mcglynn@fexbox.org,@@Masuk123$$,0x8c8940651f4aabeb26d0609ec04b19aa631e5820
laquita.bahringer@rover.info,@@Masuk123$$,0x9aa67098ff3a1ea2ce4e34169c65504ca25ce16e
freida.willms@rover.info,@@Masuk123$$,0xff53a434cc99fa91ed9b135a253e94609d927a85
pia.rempel@mailto.plus,@@Masuk123$$,0x8b682256721d6ec73ec8d8d36bd25d6a61083800
winfred.weber@rover.info,@@Masuk123$$,0x521a8269d74b6390a2ad9064d53e2046f78686c1
lannie.jacobi@merepost.com,@@Masuk123$$,0x6c3d7d0b960c2f643fe2785fa8bea12973333531
darwin.schmidt@fexbox.org,@@Masuk123$$,0x81b2deffc3406b6df2a3496404d6834329d04ac1
guadalupe.koelpin@mailto.plus,@@Masuk123$$,0x9eb46ee7028c674a6e128b9023c9496e49d9298c
raye.renner@fexbox.org,@@Masuk123$$,0x07f98b71a9de2155d9ebab0f4d4276bc31bd6c42
madeleine.lowe@rover.info,@@Masuk123$$,0x39b1f42684a21e73d3d6b823b074c3c7ef2f7e8c
cedric.corkery@fexbox.org,@@Masuk123$$,0x284d0435a79224871e0a27be4755999f600f52e5
christin.wunsch@rover.info,@@Masuk123$$,0x610f2580dada2ba19d4c3fb9f93fb8effc6a2c36
kami.hintz@rover.info,@@Masuk123$$,0xe197e3f99ea8523ba27e14c526454ca5377bf87b
renea.hoppe@mailto.plus,@@Masuk123$$,0x9d783b804f3a358ba40df7e2bf93566234cdfe09
joaquin.bradtke@merepost.com,@@Masuk123$$,0x8fe0ae116630e82b32a96179da32a7cb5dd58c49
daryl.marquardt@mailto.plus,@@Masuk123$$,0x9c94c09579332b0e9c8cb989d7c1d8ef90f1d601
collin.green@rover.info,@@Masuk123$$,0xcfc4b952fec60f96a6e246a33e8caed2184ad36e
nick.gerlach@fexbox.org,@@Masuk123$$,0xf3610774c7d8e4f7ef97e5b66a70a984950d2c4b
trena.mitchell@merepost.com,@@Masuk123$$,0xa120ed772d1f40090322310c93baa0dd648a5e39
ethan.schaefer@rover.info,@@Masuk123$$,0x53d7af1eecc655e572120e2ab79a569bb7ba142b
sherika.shields@mailto.plus,@@Masuk123$$,0xf2e0fdb7d1fa95ed6d802d95c8124be4b8c48c26
melodee.carter@merepost.com,@@Masuk123$$,0xd213c6de0f63ee03609f158f56657346f5609fc1
isidro.windler@fexbox.org,@@Masuk123$$,0x515ed8d5670fb66e7920eff2483ba4ecc1bd823e
burl.dickens@merepost.com,@@Masuk123$$,0x1486580d03eecaacbb4e8269769b027517e78b40
oren.ziemann@rover.info,@@Masuk123$$,0x4c040da4da6d7edf53f66b6a3fb9440cbedf45b9
dorine.hyatt@mailto.plus,@@Masuk123$$,0xf9fd2411c817eea66ade55d2c3c54e8ae572c3af
tamekia.bradtke@rover.info,@@Masuk123$$,0x1192322c111f6351b1b8646f956c3b4848379e2e
onita.zboncak@mailto.plus,@@Masuk123$$,0xf0cba07586f7abb9c1859aee7abf166d510579e6
nanette.monahan@mailto.plus,@@Masuk123$$,0xe8feb81026111c308a850cb19d3154fcf8bae070
delores.krajcik@merepost.com,@@Masuk123$$,0x1119d291546501b40c9c352ad04d79111ef9fa50
don.mcdermott@merepost.com,@@Masuk123$$,0x2b46e044f50c38bd2a262e410de79a6ee0e5970c
inocencia.kessler@merepost.com,@@Masuk123$$,0xb58fa5e9ec3a174ee460b7e6e28ee7dea7befe9e
hayden.gottlieb@rover.info,@@Masuk123$$,0x7fb442e24ec8827042f2e687ae75aef57069c51e
efrain.grady@fexbox.org,@@Masuk123$$,0xbace782dd4cfc9197cf1a7658294e9e60e5b78c2
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
