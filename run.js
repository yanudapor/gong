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
erich.d'amore@merepost.com,@@Masuk123$$,0x85737ce95c1dd15df30b58bcdba7f359b296462d
ernesto.frami@mailto.plus,@@Masuk123$$,0x130d02af5d6b2261013234918278831c9295dcc9
mohammed.simonis@mailto.plus,@@Masuk123$$,0x25620887c50c309178852f4bac70e6f24dcd4a82
claude.wyman@fexbox.org,@@Masuk123$$,0x5831fbaca9b490c2f6069cdbe91fbecdf4f414b6
jimmie.kautzer@rover.info,@@Masuk123$$,0x611624bee4d7872a6c4d9df50fa9ff171d59513b
margery.prohaska@mailto.plus,@@Masuk123$$,0x2df74775e81c67e9d17dbc24088135f156f58d62
clement.koepp@merepost.com,@@Masuk123$$,0x91d134699f172a9702c7466dc06e70fbbace45d1
jason.hartmann@merepost.com,@@Masuk123$$,0xddbadda0b42fb7692e4f69cca6704b8d84c951cb
sarai.bernier@mailto.plus,@@Masuk123$$,0x6f93185945a34f07f43f17537bdb0fcb60cd50ba
brett.hirthe@fexbox.org,@@Masuk123$$,0x5ec3a649d130db4e35b80ab735bfe255aea9c191
david.boyle@fexbox.org,@@Masuk123$$,0x2f54d1fc74d3be2049bd2c2e03f27f6456931afd
rosario.stiedemann@fexbox.org,@@Masuk123$$,0x0e3108a05708f8977625fd5f4ae86ce29f32f795
latonya.schaden@merepost.com,@@Masuk123$$,0xfb690be3c3e4c4a09dda4325b7aecc182ba96f8f
august.torp@fexbox.org,@@Masuk123$$,0xecf25e1e1934595bd9354af4face2ec8e582c815
danilo.morissette@fexbox.org,@@Masuk123$$,0x774500b4c371bcdd39e59795c61c5f89bcd8f7c0
rene.crist@fexbox.org,@@Masuk123$$,0xd534871a2c1084c7004a1f72e4b9e44b9f2acfdb
rolf.greenfelder@fexbox.org,@@Masuk123$$,0x1e8a9e15649a96459aca82e9df379d69fe374a69
bert.kling@fexbox.org,@@Masuk123$$,0x45c8344bb0ca6c54c9a8888ad550229d33af889b
erika.upton@rover.info,@@Masuk123$$,0x039a5e71b0406820f682714c7d75c7e8e10d2570
rodrigo.graham@fexbox.org,@@Masuk123$$,0x43da8c9377c18fe967b9153d2724b6a01cf55a9b
kimberli.rowe@merepost.com,@@Masuk123$$,0xc2c58cef3273929a3570f1faf7bcb44df3253f5f
shandra.leffler@rover.info,@@Masuk123$$,0xdcf95b3306c7d33e78011097c3c3f0d6ea1d71fc
edmund.schulist@mailto.plus,@@Masuk123$$,0x64789bfaad6a062ad7878990656a4cb8eda35585
sana.torp@mailto.plus,@@Masuk123$$,0xf439a3ecbc241f29e03aad78fc4744882f932465
jesus.schuster@rover.info,@@Masuk123$$,0xf136b874e7ce719ed1f4749ac9bb69677477d88e
lesley.lang@mailto.plus,@@Masuk123$$,0x7eb6b9180fb7f123820e2e381713c4cb64030127
jacquline.armstrong@fexbox.org,@@Masuk123$$,0x61d66524ec2bd8b9b14316fd66eed16c204e6065
rebekah.thiel@merepost.com,@@Masuk123$$,0x91a9d174f4f23747d91294a1ce1a10b74716e8ed
simon.schuppe@mailto.plus,@@Masuk123$$,0xbe4df1ffcd88db4640562cec9d9ce875e8566534
kimbra.spinka@mailto.plus,@@Masuk123$$,0xbb47b98bb8cc5c23d099cdc5bfd24c4ae15a3b8b
jarvis.dietrich@merepost.com,@@Masuk123$$,0xb62d0c409444467fb1645ccb2f2212ec931c562b
elayne.harris@rover.info,@@Masuk123$$,0x37c9be30ade767211c3dfad4f09e1c7a402f7c5e
jimmie.vandervort@mailto.plus,@@Masuk123$$,0xf1eba440983625da6656f4ef398410ecabacab31
zachery.hilll@fexbox.org,@@Masuk123$$,0x1c8fa90ba9bf1527965c1ddaf5c056720a0a2954
hector.pouros@fexbox.org,@@Masuk123$$,0x8935d9437c03742f18f192ff258818ad3be548d8
ok.schmitt@mailto.plus,@@Masuk123$$,0xadf09b06c2b56d8c069ba16c28fa5c3fe514b6da
bobbye.mraz@mailto.plus,@@Masuk123$$,0x7f9c59c1e5902d25794f7e481ed50e47505aebb7
twanna.rice@rover.info,@@Masuk123$$,0x9e7cc643a6f20c594c623d7f81121acf6b315edf
arron.rosenbaum@fexbox.org,@@Masuk123$$,0x034ed0bcae3fccd4dcdf09ecb817b72d7a6ca3c0
porter.koch@mailto.plus,@@Masuk123$$,0xcf7fddef196bc183d24cc39aa2e1a640e4d29787
kerry.beahan@mailto.plus,@@Masuk123$$,0x1d0dc9e162a2eaf2ce43b0577a44f5656932e270
merrill.barrows@mailto.plus,@@Masuk123$$,0x47743989304d0f0f74844353afa9f2ac92634ab3
yolanda.swaniawski@merepost.com,@@Masuk123$$,0xf9455c5f833db9383ce78d960e24b88d60a04ad8
katelin.gibson@rover.info,@@Masuk123$$,0x74ce561cea9274f25a32edfd2b40ff22d62eb6fa
brooks.hyatt@mailto.plus,@@Masuk123$$,0xe990c4b402be081acd14bbfbb5bb5eb0de543309
micheal.steuber@fexbox.org,@@Masuk123$$,0x490e90e2f975aea78bd011ac445d924a9ddfb4e0
aja.cassin@fexbox.org,@@Masuk123$$,0x246f55f19f472dfbc22e12103b31b56fb8970cad
laverne.berge@rover.info,@@Masuk123$$,0x41345416a526a7a1c8e5398b08f29b705d968518
malissa.satterfield@merepost.com,@@Masuk123$$,0xabdfe13df80f76c24309a84fb8abe1afcff71584
mickey.farrell@fexbox.org,@@Masuk123$$,0x795a12bbe6725d944a7e84740cb4439453f7801c
joanna.parker@rover.info,@@Masuk123$$,0xd5bf779a178a344cd71adb35d3d60cafbe499fa8
kourtney.parisian@mailto.plus,@@Masuk123$$,0x2f20567d640aa123ae43eaf132abb2c3e96bbf12
maile.daugherty@rover.info,@@Masuk123$$,0xd330b9e808f62118705aebb280eceec695376018
mi.greenfelder@mailto.plus,@@Masuk123$$,0x6667615e7e7d565398aab0f78a6f4731c53d0044
tyler.jacobi@mailto.plus,@@Masuk123$$,0x4b88edce0081a023f208a4a932403578ebcfb37d
milo.hoeger@mailto.plus,@@Masuk123$$,0x75a6e556f8b3b7f43d32f0d522ce9c454e176b42
meridith.feeney@fexbox.org,@@Masuk123$$,0x06a99136725d477cb14175134874d8e3fa484b7a
sherrie.ritchie@rover.info,@@Masuk123$$,0x331b3c8965013f88440b51afac8933de6231155c
ronald.hoeger@fexbox.org,@@Masuk123$$,0xe66ca975d7d344eec92ac1b067446574426d1f23
olen.funk@fexbox.org,@@Masuk123$$,0xbee62a703bc08a6d66e2c16bb19a572b8735fab4
federico.hilll@fexbox.org,@@Masuk123$$,0xdbb238e32577fe1ada43a215df2f82bb116145bc
lakeesha.anderson@merepost.com,@@Masuk123$$,0x2b3991a5fe0a1bd1fb4321fe7ff7949a335e7373
rebeca.hyatt@fexbox.org,@@Masuk123$$,0xacf81131676666607d64d9f5c12327321cf9bb5f
linsey.botsford@mailto.plus,@@Masuk123$$,0xc01683ed0dec91d5b29e52cc2957968e4e24312b
dominick.mueller@fexbox.org,@@Masuk123$$,0x7456b0f780b974b38ad720d37eb05c74abb97dbf
violet.farrell@fexbox.org,@@Masuk123$$,0x4bb494550339b369499c406e93b2b4bf293ef4a3
mckenzie.mayert@fexbox.org,@@Masuk123$$,0x0fe4d052fd5acfeec1a8dee6834d48a6a54b6262
lucila.kulas@merepost.com,@@Masuk123$$,0xb551ea93b917ab34f51f28033126e70b5088756b
valentin.douglas@rover.info,@@Masuk123$$,0x3816fb36400fbf32fff585ef59791d9e0346a428
judson.ward@rover.info,@@Masuk123$$,0xb510660118196bbf9bb577a0a60ef21c6980b699
trinity.lubowitz@fexbox.org,@@Masuk123$$,0x2f010f044b338797383cf5affd6da4d6286da222
kaleigh.kris@merepost.com,@@Masuk123$$,0x61e138482ce735bd5b849deeaf2f9a1a27284141
everette.terry@fexbox.org,@@Masuk123$$,0xb1c29ffb04ad06e8cee05b4378cd0cb347d17011
margrett.herman@rover.info,@@Masuk123$$,0xd2dd2ca008840fac6485f6689f6a73d0ce237459
dino.braun@merepost.com,@@Masuk123$$,0x14913cd77dafdd141f02d5bb2e7edfbc0245bd38
rosamaria.shields@mailto.plus,@@Masuk123$$,0x060de4e8601e0b44eb26d245b2002ae019d0ec93
gustavo.dare@rover.info,@@Masuk123$$,0xf7dc2aa4b97e41edaffccb9ca4f13b4f9b36d465
lenny.hand@merepost.com,@@Masuk123$$,0x71ee1a9b6b487c309820741caf3c490318d59055
wilmer.farrell@mailto.plus,@@Masuk123$$,0x48457d5f545db4a71a8d32cb3561bfe3f2007f72
laverne.runolfsson@rover.info,@@Masuk123$$,0x8c32ff1a0076da2b6d7d9c8206d8b37f89484852
dion.heller@merepost.com,@@Masuk123$$,0x15388e517f15a7f5b307732ef027b8c739c09417
enrique.schumm@fexbox.org,@@Masuk123$$,0x992e5b7e677cca5ee75fa63aa84c95847e26f862
rebeca.kessler@mailto.plus,@@Masuk123$$,0x7eba9d13e1dbbce4135ef98d029294ff94493756
spencer.langworth@fexbox.org,@@Masuk123$$,0xf589739134abeda3edadeb2711bbe52ccaa2fa9a
bruce.bogisich@mailto.plus,@@Masuk123$$,0xdb182327f3c8b0ac16c6bc0744940f953f1a32bf
oretha.kautzer@merepost.com,@@Masuk123$$,0x3333d7467cc759e000c2594700d03313af59a499
shad.stracke@fexbox.org,@@Masuk123$$,0xb62a90f070b10faa7af48ad72755b48ccdfd1313
ressie.cassin@merepost.com,@@Masuk123$$,0xc77c7ca801c47cf45e727a5aa6292804c4381d3d
ty.haley@rover.info,@@Masuk123$$,0xf007be88838f3d0150424fd7ddd17ae5194c719c
rolland.sanford@mailto.plus,@@Masuk123$$,0x5cb1a2b67ab9bb313cff4cd2268df8c0f6a52dbf
eusebio.bednar@fexbox.org,@@Masuk123$$,0x142c4c41ec183c19537b23b79e28d2886fdb28c6
january.wiegand@fexbox.org,@@Masuk123$$,0x9d8526a107098dd208e1685d13668186a2b1b699
lucilla.pouros@merepost.com,@@Masuk123$$,0x5c376b8bdaa98eee0ecbb2abb8e4a927041f9018
kathryne.feeney@rover.info,@@Masuk123$$,0x787b7ab8c68e039b3532f0d62ce5467b3b600196
brigid.robel@fexbox.org,@@Masuk123$$,0x58103a800ae4917c8c624b71d9a427bc3d72f385
otis.will@mailto.plus,@@Masuk123$$,0x088164cb66133876b588b5e2843e5daed134dae5
antonio.predovic@rover.info,@@Masuk123$$,0xc232de0fd5deef556999a00fbf508738fae77cb0
rosenda.blick@merepost.com,@@Masuk123$$,0x7509d5e0900eea1ef93460bd5c009310e5e0ffea
tonja.bartoletti@rover.info,@@Masuk123$$,0xabe2891a5684f2dffddfb89eba3e512db5acf7a2
denae.kovacek@rover.info,@@Masuk123$$,0x1ea6e396b852169786ba4a85537f5678b2d8e64a
luther.hamill@rover.info,@@Masuk123$$,0x0c0e4f7639de26e04cd868c8b98035afe61160ff
eugenia.hoppe@rover.info,@@Masuk123$$,0xe242533e98cd856909da5ec2f985ac03d12aefc7
jesus.casper@mailto.plus,@@Masuk123$$,0xdca14121074a11d4725d25e0dace79c1410f5e7e
tony.mueller@merepost.com,@@Masuk123$$,0xd07965d5bf5d0723562afd14d78b1095a951e604
rashad.waters@merepost.com,@@Masuk123$$,0x50904b220970deeacbc614d382ab1e9e5b81cb0e
robbie.doyle@fexbox.org,@@Masuk123$$,0x29ad9d1a50030b692075254324bb3080c106c146
fabian.walsh@rover.info,@@Masuk123$$,0x079892fdcbb541c4cf9586dc1875b66ccd96266a
daniela.wolf@fexbox.org,@@Masuk123$$,0xd5cad5558541663171e17a869554131fbf244e76
thaddeus.gorczany@fexbox.org,@@Masuk123$$,0xae148c3e10937e16d576b126811a9cd31dbfbd00
concetta.wiza@merepost.com,@@Masuk123$$,0xbaf79955cbaa2030f117f735534447b32b6d3463
blake.kutch@rover.info,@@Masuk123$$,0xa761e437216435074fb7f228f311304ada469571
golda.mann@mailto.plus,@@Masuk123$$,0x8738869721149431808a932b1c7044f53ec0f7b9
janae.kunde@fexbox.org,@@Masuk123$$,0xdc20048d5692e8634e5cd064a988b983e970c482
earle.hessel@merepost.com,@@Masuk123$$,0xfb563f1ab4476529989d1040b2be93a575bc7868
rey.marquardt@rover.info,@@Masuk123$$,0xc3f3616fc5aff9d69031297deb2266931eefc301
bertha.upton@fexbox.org,@@Masuk123$$,0x280e034b06e86842095f93d4d64684e29797a985
sam.jacobson@merepost.com,@@Masuk123$$,0x4a14de145b59e114036a96da6e518d504c8d5baa
walter.abernathy@fexbox.org,@@Masuk123$$,0x8127b2e52b7965f8e20976eba631a5a37978d04d
janise.quitzon@fexbox.org,@@Masuk123$$,0xe598f8db21209a2f606afdc6d369ac2dd309a338
felipe.ankunding@merepost.com,@@Masuk123$$,0x2dd5ab1d7b8b7811ba131a1ec046144cbaa7840b
myron.funk@rover.info,@@Masuk123$$,0x0360af34b253e06cceac2df6b8c5abeedf1b96b8
keneth.jenkins@fexbox.org,@@Masuk123$$,0xbd5a708d08aa15ba354331db5d533441d4932c00
harrison.nader@mailto.plus,@@Masuk123$$,0x20286bf48d832f34edc57ec59574e7942110ac77
latricia.lowe@mailto.plus,@@Masuk123$$,0xb0691d7556ce52013aedab63b07fb9887ef1a174
kandis.o'keefe@merepost.com,@@Masuk123$$,0x2b3ad5579f682aa83dfe6f1eb2874c522a75b7c0
lucius.little@merepost.com,@@Masuk123$$,0x5fb8b7153d37a5e0e5e2ec76c7f47341e4cd891b
dannette.christiansen@merepost.com,@@Masuk123$$,0x5d349d806768366b59698882582c1822cecba5dd
wilson.o'reilly@rover.info,@@Masuk123$$,0xa6eacf613b0418f4f874667f9ef8c4de779faa96
dominic.denesik@merepost.com,@@Masuk123$$,0x52b3caa897c366814b65134c39b06d41f0426050
racquel.lockman@mailto.plus,@@Masuk123$$,0x25f73a8e5af3157bc6fd541df97f4b753f12ace8
ellsworth.feest@rover.info,@@Masuk123$$,0x1203e72eb1041dc5afef92e215001e53db7ae6f2
colene.mills@fexbox.org,@@Masuk123$$,0x2372e61d97cf2695115d53b9102ad5014181c9fa
clarence.ziemann@mailto.plus,@@Masuk123$$,0xe0449e986dda152cb14355f2c953f8a214eb121d
bruna.corwin@rover.info,@@Masuk123$$,0x0d0c6e75b33c66ce655eaac19d69e6a5936957b1
arnold.bradtke@mailto.plus,@@Masuk123$$,0xff0d8169e3a4ad7843bc5030372148b5fe47c95a
fallon.gusikowski@mailto.plus,@@Masuk123$$,0x4932647375464f45e6556e38afa739c45bb7f9d7
sally.welch@merepost.com,@@Masuk123$$,0xc8a9c69785928f238ad834874ef4d06e2336d08e
lisha.gutkowski@merepost.com,@@Masuk123$$,0xfca4610f0136cb06448f4dd7f958cfc98a8e1e08
elmo.robel@merepost.com,@@Masuk123$$,0xcb123cf049b852d81b4338e123d75d5dfeb95284
curtis.vonrueden@mailto.plus,@@Masuk123$$,0x473113b62a8b3cb4593fbf3151a160addb3a0da6
bernita.hansen@fexbox.org,@@Masuk123$$,0xb6cc62939b6dafae5d496413f242e750d675a1e1
eladia.dare@merepost.com,@@Masuk123$$,0x37412e39061a9afcf42e4bafb1cbc16365d687da
matthew.turcotte@mailto.plus,@@Masuk123$$,0x0761e7487d76d8fde6cc8c429d2c8cd1c050173f
ophelia.anderson@rover.info,@@Masuk123$$,0x1743dd0b4c20816f857185ee09ae6ba1e37fc55d
ezekiel.fisher@fexbox.org,@@Masuk123$$,0x922191fd03cf66f32813fed0a7e9dbc085f9f9e2
ozie.witting@rover.info,@@Masuk123$$,0x698c5367955ce8897d7827457403942a8520c5f1
reinaldo.wolf@fexbox.org,@@Masuk123$$,0x99b73644b7cbaa0ad7482a74f0f2ac8a3a7d88f4
tu.powlowski@merepost.com,@@Masuk123$$,0x199c3161ebf6135d71932f9c20378c1471e69a41
corinna.haley@fexbox.org,@@Masuk123$$,0x73eeb4be80a981e68fe810fac581fa1809e2563b
keneth.flatley@mailto.plus,@@Masuk123$$,0x749fd06594117301fdaee5552614d2a8bdd61cdb
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
