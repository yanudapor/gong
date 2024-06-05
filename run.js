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
merideth.johnston@rover.info,@@Masuk123$$,0xa1c978f5acfc1b85cc65704bc94025dc6596af77
leonie.veum@rover.info,@@Masuk123$$,0x6fdb3dccb188d10c788d35048ba8f0e37a011896
lyndon.spinka@mailto.plus,@@Masuk123$$,0x622ff80aa3df36a29369a0646bcd41d3de499487
geralyn.ruecker@fexbox.org,@@Masuk123$$,0x469fabf21f5ead3936ca1ce8898e6f8d027c92aa
andreas.thompson@rover.info,@@Masuk123$$,0x3059dd0429eb6a7113191fe84cb002efef38aef5
reuben.pollich@mailto.plus,@@Masuk123$$,0x4a1985921310ba1081713eac55e882536db74f16
stan.gutkowski@fexbox.org,@@Masuk123$$,0x413f62d66825f5c33752678a47903bf6c5b4a963
nannie.waelchi@mailto.plus,@@Masuk123$$,0x8a6629ebee6f57903861c527fd2b282fa8c19d0f
giovanni.monahan@rover.info,@@Masuk123$$,0xce0696420113bab477ad3cd8b7add745e6a7fd23
lesia.hagenes@merepost.com,@@Masuk123$$,0x2d71e05d0636d87da13c3e76f75a666fab0a590e
jack.farrell@merepost.com,@@Masuk123$$,0x94ca58f355d0d477405785c44bcb0c3a48810756
lamonica.brakus@rover.info,@@Masuk123$$,0xdc21bf89bdcd7b75d09d3d391522430518a820e0
joey.schinner@rover.info,@@Masuk123$$,0xa5e519b1fb90436fb87cffcc87140e6930a5a231
merle.denesik@rover.info,@@Masuk123$$,0x4ead38fd899f4c446a34b0481cbf120b100ee3ab
rueben.shields@merepost.com,@@Masuk123$$,0xaf281d8c069b4f69c2de09fb54123b311ebe4b3c
lenna.prosacco@fexbox.org,@@Masuk123$$,0x913457a18c40a64fd47060ed25e0d1daf1dcfb54
deeanna.pouros@rover.info,@@Masuk123$$,0xe1586c02c317d2f203b9856f847bb526e5bbb372
samual.rippin@rover.info,@@Masuk123$$,0x77e9237e5eb8e2fdd116c02df7b5e8c9841272a9
noel.fadel@rover.info,@@Masuk123$$,0x0f538ec7ac91cc046a4ba596c5d4a488cb57c53f
joan.will@merepost.com,@@Masuk123$$,0x204e1ee716fe2c99154a036ddc2fdba52a32db6a
carmine.price@rover.info,@@Masuk123$$,0x68d521a73dedac77ba6d05f8580cbe63d435fcf9
frankie.hessel@mailto.plus,@@Masuk123$$,0x6b2ba32fdadd3b1d2b69019c47c29fe6c59605e7
cordelia.watsica@fexbox.org,@@Masuk123$$,0x8d9a68c56ee2c0dde40502ed74f99e85e923aad8
david.morar@merepost.com,@@Masuk123$$,0xa7d097d81264f9b2b3cedd7435b30d52a698ef24
conrad.swift@rover.info,@@Masuk123$$,0xa3f779e95e8de86917e19fff30808a7954a8bc6e
jose.gislason@mailto.plus,@@Masuk123$$,0xdeb5fb05aa871c1d3e21a6e78d250b957388bc0f
hoyt.rogahn@merepost.com,@@Masuk123$$,0xff064ea99e56d70da1a3d62703922e0cf784f69e
truman.crooks@merepost.com,@@Masuk123$$,0xb9c58cd2e49e28df04e7bcdda46c518030fa7ba5
theressa.cremin@rover.info,@@Masuk123$$,0xc57e4375fdf564a298787844601cb1ba35227b5e
yuko.gislason@merepost.com,@@Masuk123$$,0xa8479d1183af6508debd0bd2e887d425b1aa1f36
lewis.morissette@merepost.com,@@Masuk123$$,0x9cafc1af4e1cca87890dbb69b64344d56c260739
emily.parisian@rover.info,@@Masuk123$$,0xa7a8728598a65a0d44a36a93a9c3aa15413d54b6
rudy.steuber@rover.info,@@Masuk123$$,0xc83de641856b1fa933c75044e970789c01b35412
collene.roberts@fexbox.org,@@Masuk123$$,0x87294720f1598f78eff8dc9f2abd38fe5b98c764
shane.walsh@rover.info,@@Masuk123$$,0x6d36b0b3e25a6ba93f2b80b178e90f8582bdc9bd
joesph.waters@mailto.plus,@@Masuk123$$,0xffe98d037c45146dd085536a82753181654e02c9
antony.connelly@rover.info,@@Masuk123$$,0x7f6038df4c76b9971690b59a89b8d87b00a69ec8
andre.corwin@merepost.com,@@Masuk123$$,0x3af6b36f331b7c02a88da68d2f9af81fc3bd8569
brice.emard@fexbox.org,@@Masuk123$$,0xd98a26d6c8d64ca697027e494fb38f905d4838ff
barbar.harvey@rover.info,@@Masuk123$$,0x165a9194e7b003595c0a4ccb04df21d72c6a7a82
vaughn.tillman@rover.info,@@Masuk123$$,0x43038b0770f87a7eff4ed40ff77ace2ad281fa1f
jewell.swift@merepost.com,@@Masuk123$$,0x0dee5402e9178328993b60765dcd5ca0abb4dc3c
lance.o'connell@rover.info,@@Masuk123$$,0x772e29e25e8710764b947685649fd66121c18647
margarette.pfannerstill@rover.info,@@Masuk123$$,0x9fd5d65437cfc5e8b138528edd1f6f7b07f1c5df
blaine.steuber@rover.info,@@Masuk123$$,0x571bd2a3034124a45a8805107fd121861b84bd43
danilo.goldner@fexbox.org,@@Masuk123$$,0xc2ae14986cc8b9ba2f70d663aaad7dc025fd3c75
brian.ratke@rover.info,@@Masuk123$$,0x02b05eef1810ab478adabf314c65cf0aac4a379b
cyril.metz@mailto.plus,@@Masuk123$$,0x487ec704d2539f2ffddb92fb513550bcfec86645
maudie.skiles@merepost.com,@@Masuk123$$,0x12fa36d947cf91778372e4d6b6aea9cb2e9e4641
william.herman@mailto.plus,@@Masuk123$$,0x5989b5c40fae2aebd75346986d3097a467f048ee
curtis.hettinger@merepost.com,@@Masuk123$$,0x2291aa0f6ed29f6e72134c70b8cc927d1de5188b
frida.wiegand@fexbox.org,@@Masuk123$$,0x8815d304a4f0ce64d8289789afa7cf7548289ece
ramiro.balistreri@merepost.com,@@Masuk123$$,0xb3a40dbdee7736ae1d5d53b46968e9605e0a3b31
dorthy.fritsch@merepost.com,@@Masuk123$$,0xdfa93b40b4216824282e892a77d84a64f9b64cca
frank.cole@fexbox.org,@@Masuk123$$,0x9f705b3e0c19c78fd9df24a4e7dd0b3aa4566373
lelah.harris@mailto.plus,@@Masuk123$$,0xe19b4f6377b00932cb12c0d1f3c01b564074b5e2
maddie.langworth@mailto.plus,@@Masuk123$$,0xdc7ad26f6b1dc04891ce69e4814b12f9c3135983
faustino.funk@merepost.com,@@Masuk123$$,0x787af520630d90ebb6c5ffe534fed4914e0ac396
mason.kilback@rover.info,@@Masuk123$$,0x806d3dec27887ed7c2eabf6971cad436dd4f15bd
heidi.gusikowski@rover.info,@@Masuk123$$,0x3e0c8544c18489650014b4c6863f3c0d1b20b92a
venessa.conn@rover.info,@@Masuk123$$,0x2a4a49ccc38bd989506d988b841d18a3cb159b94
krishna.ritchie@mailto.plus,@@Masuk123$$,0x997e97665421f6ce8c8ecd16cc5b3958e6264b28
wanetta.mills@fexbox.org,@@Masuk123$$,0x5d66a46065b5698712abdad1184cef32166f2446
nathanael.langworth@fexbox.org,@@Masuk123$$,0xad42cb7cdd114f2671cae0fcab220fba9e1c1b5a
lashell.satterfield@mailto.plus,@@Masuk123$$,0x7236876005bca69adf4537a072b375955d3fd522
weldon.zboncak@fexbox.org,@@Masuk123$$,0x52dc80166916380e7075db25c00828a47d2b0d91
alec.bogisich@mailto.plus,@@Masuk123$$,0xdcd46915732787eccad8f092eaa16012c91d84dd
carline.breitenberg@merepost.com,@@Masuk123$$,0x1e5dd9bb7af9a8601cbccb3fcbf9a6add873f97f
marlon.welch@mailto.plus,@@Masuk123$$,0xf905fd00b233d754a37c625e84889db83b35a47d
fernando.goldner@mailto.plus,@@Masuk123$$,0xa14058bf5c3949f77805b4c27eb599f36413f70b
janene.parker@mailto.plus,@@Masuk123$$,0x2f7ac748ef433da89b6b0b015e34c6962eb2af92
blake.hermiston@fexbox.org,@@Masuk123$$,0x3f12c0d0abe94f521b6af1dec89e1223c3925a9b
lindsey.herman@rover.info,@@Masuk123$$,0xa50cf367aeb5aec3af0d1479117f511681586324
verlene.cummings@mailto.plus,@@Masuk123$$,0xa2bc330f2a860ce59ac6549caa00a85acbb50584
jed.emard@fexbox.org,@@Masuk123$$,0x4c6a8f3550a148c0ad1c235d3432560ab28fc8ae
shoshana.macgyver@merepost.com,@@Masuk123$$,0x5e256a0c2caf717c5a10f34d464b7cc4d198ec63
william.lynch@rover.info,@@Masuk123$$,0x74d9595828f8ee3ed5d327c41579b500b9bcd63f
deandre.mitchell@rover.info,@@Masuk123$$,0x6868f46aae4ca7d7c5595b519450a0dca9b2146b
shon.upton@fexbox.org,@@Masuk123$$,0xc0ddea8935bfaaaeadc87739437ee4e3d559b5df
chester.kirlin@mailto.plus,@@Masuk123$$,0xb87d15037641a7fc623f469abb5e204f4c46d1fe
miles.kshlerin@rover.info,@@Masuk123$$,0xe20e9de39476f6fdefa88e501b964b97d19c65f9
alyssa.gibson@rover.info,@@Masuk123$$,0x7dbe8f18c191482035ebbb7f31745bec324d7f76
ivana.hammes@rover.info,@@Masuk123$$,0x1e1aacc8d3cdcf8f00c755c607866d7c708784b7
horace.dietrich@mailto.plus,@@Masuk123$$,0xc2cd6d87f948e46b59bb4a6af27d4667aaef8cd0
gussie.powlowski@merepost.com,@@Masuk123$$,0x76b6f4a42d3dd708120985398f48af6373f134d5
rudolph.quitzon@fexbox.org,@@Masuk123$$,0xfa800c7f1c0ae844396dc1c36e83d457914ab46f
nova.douglas@mailto.plus,@@Masuk123$$,0x131aa6834a8560dafa7b5ead57491cb5e48aa1d3
frankie.pagac@rover.info,@@Masuk123$$,0xfdedebb01f6da91bea61afe71bfeedefcd8ae38b
garland.beer@fexbox.org,@@Masuk123$$,0x2e1b4657f7d7bf00d578206d0b27bdeb5661d8f2
numbers.tillman@rover.info,@@Masuk123$$,0x3ca6bf8d2b3d67255d3a24dbbbd0f9238551d49a
roosevelt.nitzsche@fexbox.org,@@Masuk123$$,0xcc8d5cd18344a24877ac1ebbe4f0d182907c8a4b
nathanial.lakin@fexbox.org,@@Masuk123$$,0xc02c96d6fd6be353da14ed26fb39831c6ab10e00
maddie.gulgowski@rover.info,@@Masuk123$$,0x07a85c5b84e9d08ee421e3890aa7f06f884700b1
allison.yost@rover.info,@@Masuk123$$,0x1a211e3da01f9db173470a686ec0dff61f912dcb
latoya.stehr@mailto.plus,@@Masuk123$$,0x5f569db9bc0a0d3588dc9aae34889320298c7b7f
ozell.hermann@merepost.com,@@Masuk123$$,0x65e9ce140b83661ada8be83e98b2bbd7323f62a6
mauricio.von@fexbox.org,@@Masuk123$$,0x63da7ffd335b5039a53aa52bfed56bf1b17a69fb
elvera.batz@mailto.plus,@@Masuk123$$,0xdb041fdce177497a94b7afa84ac8b09d1e726958
burt.johns@rover.info,@@Masuk123$$,0x595342afe6b1ac66caa04c2a69af9a64e0dd88da
annita.hansen@rover.info,@@Masuk123$$,0x00a10a57b9e140f3fd997ad6ed55d432977e6476
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
vicente.hauck@fexbox.org,@@Masuk123$$,0x0ae14c6f8bf6292a724fa62786817d15abce6ebf
meghann.tremblay@merepost.com,@@Masuk123$$,0x91a7ced726103629212ede396cc32041822fab92
heriberto.stracke@fexbox.org,@@Masuk123$$,0x3cac204f69e8e39aa27b31b6a47389a5024bf944
penni.bode@mailto.plus,@@Masuk123$$,0xe9162feb1f86c2bc817cdfe118a35dfb9caca523
nell.ebert@mailto.plus,@@Masuk123$$,0x63af2f8c219097493f1dfd8a9f0a0b6153598f16
beau.buckridge@fexbox.org,@@Masuk123$$,0xe9ecd19099397686f36132789bc9bf482055a5b8
rudolf.dietrich@rover.info,@@Masuk123$$,0xc13e854481b96796a79ffeba72743b5eee435b4b
harry.rodriguez@mailto.plus,@@Masuk123$$,0x8c228f7ece167337f1052329ac66a280a1f7e8e4
ronda.welch@fexbox.org,@@Masuk123$$,0xb2ad4c33365248c254911ca800ca8d37f66ae7f5
zula.kassulke@fexbox.org,@@Masuk123$$,0x8f46476015d314fd68cee9c23f0015e01b120c60
halina.king@rover.info,@@Masuk123$$,0x597b9bc4f2cc536ba400b1b2ff608f6c774ee356
weldon.gutmann@mailto.plus,@@Masuk123$$,0xdabf309dfac0c2e711d1b064195e0943206e4854
tomas.jones@rover.info,@@Masuk123$$,0xc90d536bf2af8d353efc20baec032c7c25f2aa03
ignacio.heller@fexbox.org,@@Masuk123$$,0x4931b20f142122c7ebb2d5acb495da7549a35867
antonio.macejkovic@fexbox.org,@@Masuk123$$,0x577acc0cc0cddf10ad7e0fc3860ee310f4f8a27a
dale.doyle@merepost.com,@@Masuk123$$,0x155e196a52367fd807b88dc2b1c95cbab7906c76
fernanda.reinger@mailto.plus,@@Masuk123$$,0x0e4ec10d8dfebaaecda0e04cdd09db7954949cd2
valencia.brown@rover.info,@@Masuk123$$,0x08a1df551360b6a51d55ae2d9b7e2cb81a2cc6db
towanda.rath@mailto.plus,@@Masuk123$$,0x78e1d35ff39c93feaee9f85b73161bc229498476
charley.rodriguez@merepost.com,@@Masuk123$$,0x355bf38a65239d43dee96cbeef1edd6be048860a
diego.kautzer@fexbox.org,@@Masuk123$$,0xbeba68177538fa849da263397afcc23760548065
marlen.jenkins@merepost.com,@@Masuk123$$,0x9fed3416de9c6f95ff9a817b73a070969c47a27d
rory.lindgren@mailto.plus,@@Masuk123$$,0xd60a3113be2a8dc876b4a78b27337f5eb523a9a4
mikel.leffler@fexbox.org,@@Masuk123$$,0xcd664761502473f6814158cf41d0051133d9e112
fred.o'conner@fexbox.org,@@Masuk123$$,0x629d9e933497fe49a6552774e03a5d8f91ddadd1
santiago.legros@fexbox.org,@@Masuk123$$,0xebf94cdf6f398cb53fa85d3e3f079685fa8e6aea
donovan.white@merepost.com,@@Masuk123$$,0x610326f458b4b487f9371526c0a15aa341f193f0
gregorio.witting@fexbox.org,@@Masuk123$$,0x01c8d6ed40372a41c0d6ac807a7e532780816f72
luke.corkery@rover.info,@@Masuk123$$,0x53e9f244aaecb84deeba675df733319f3b4d7d82
jada.davis@mailto.plus,@@Masuk123$$,0x27e7c08b9ee606e08ca7f423580363ffc03dbcb5
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
