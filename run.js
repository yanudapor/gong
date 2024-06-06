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
valarie.lehner@rover.info,@@Masuk123$$,0x65934d039874e05a0ff8db2cd44c2c4f6aa76775
domingo.rogahn@merepost.com,@@Masuk123$$,0xa1bb4f452b81a0fb012e183829f8f277f720988f
cory.pouros@mailto.plus,@@Masuk123$$,0xb9bbc335ba2916c031608ff47c133e0500671b39
dylan.feil@merepost.com,@@Masuk123$$,0xd7c081d51c7828e3ad300bed6f97f81236238cf8
aretha.bosco@rover.info,@@Masuk123$$,0x165e49284c679f3ddaee2d37d2517c49d5e354e6
kacy.gerlach@fexbox.org,@@Masuk123$$,0x0bf6fa4e1ba972d06ebdf278e880d431b2ec9c0e
les.emard@fexbox.org,@@Masuk123$$,0x81195d88f84c34a3cb9853a1e0d436a0c34aae0d
mitchell.fay@fexbox.org,@@Masuk123$$,0x6ce3b93c5e9dd32ee224de55df96c0e527649e71
marty.dooley@mailto.plus,@@Masuk123$$,0xf983fc03aaa23efd5be1c5972418653b7635311a
carroll.cruickshank@fexbox.org,@@Masuk123$$,0xbeb22f57b273134b887f16cc5bb574d33ea69e63
candy.shanahan@rover.info,@@Masuk123$$,0x405b1e11c48192dc2ce24b29beb5ca1f093141ad
alex.marks@merepost.com,@@Masuk123$$,0xbb8872de15458e6d72ecddcb8380eb5b5108cbf6
melissia.crooks@rover.info,@@Masuk123$$,0x5fe25b4cb4f815814da9b17e1d1cd1838af457c4
babara.langosh@mailto.plus,@@Masuk123$$,0x0e34b9ddd160974a7944afbcad800dc98c4b6744
aurore.macgyver@merepost.com,@@Masuk123$$,0xf8aeaf5e0308524421de618bf8c50b280dd57efa
olen.prohaska@fexbox.org,@@Masuk123$$,0xd92baa3c207b0573257138e4beb4bab8c5290f20
jocelyn.reichel@fexbox.org,@@Masuk123$$,0xf18afdf9574f161b5999693f053e66aa8e19427f
karima.runte@mailto.plus,@@Masuk123$$,0xe6aa808fea4c938b3b2f5ffee3b87dcfc5d4ac65
edelmira.white@rover.info,@@Masuk123$$,0x577ed2e2e58440cfce20b277e50e2e57e0d3e857
alfonzo.reynolds@fexbox.org,@@Masuk123$$,0x8c6187f71d4a116339a2c85454942eccb6937cb5
cherlyn.parisian@rover.info,@@Masuk123$$,0x5d53b36089005d7a64f0b34fff266ec6d10cdec0
melodie.runolfsson@rover.info,@@Masuk123$$,0x15f97b7f9bf01e02627d35cf736587c3a5e19053
ellis.greenholt@rover.info,@@Masuk123$$,0xeded8bcd2e6bc7ab2ef85cdcd86b5bfcc5ec9775
lean.jaskolski@rover.info,@@Masuk123$$,0x2028d9f82cb52b5b62ce682a1eebaff5f0b9da63
brenton.olson@fexbox.org,@@Masuk123$$,0xd518cb117bab21d6dc8f05b5e1da8d88b9f1d400
dong.goyette@rover.info,@@Masuk123$$,0x6cd2c6fc5651174d0dbba5b2e13f4c2d9999c487
rikki.hartmann@mailto.plus,@@Masuk123$$,0x131890fe77dcbfe15b594ce16ff3b999fa746f44
bradly.leannon@fexbox.org,@@Masuk123$$,0xe53724166063dd47364f31f5e5873e73b650a524
cherelle.cole@merepost.com,@@Masuk123$$,0x7d2166257bc8df8a6d49c6e1803a8274621dc81e
santiago.farrell@mailto.plus,@@Masuk123$$,0x17b0c0029adaf6e37baa6bdbcd32e699889c8481
bryon.lind@fexbox.org,@@Masuk123$$,0xe48b234a821c4762c603797673474c9b255616de
jarrett.simonis@mailto.plus,@@Masuk123$$,0x635b0a614e50a7e493a13f11c26b1da9dada7a6f
owen.runolfsson@mailto.plus,@@Masuk123$$,0xb3e0375c7e6ed39a1589a1208645cf6d37a53136
tony.zemlak@merepost.com,@@Masuk123$$,0x3b3d293877d58e53f3a97cf4f0f6615399e15231
marcell.thompson@merepost.com,@@Masuk123$$,0xcba3a7c69b9f922e59f1c4822ebeb47b44d61d0d
quinn.conn@mailto.plus,@@Masuk123$$,0x3c09019605b58fe69a05b75adad73021c90d60b3
pierre.schroeder@merepost.com,@@Masuk123$$,0x63508b4d870174f1d802539801fcbeed745d04dd
jan.skiles@fexbox.org,@@Masuk123$$,0x74b5a39e69a81045a7463ede3d273f57d8f3182c
quintin.stiedemann@rover.info,@@Masuk123$$,0xa03a713afc814d10cfc662e18a488bfee4a409b7
karyl.zboncak@merepost.com,@@Masuk123$$,0x148ee8f2bed76b4706292722c7ecd7685e7cce39
richard.denesik@rover.info,@@Masuk123$$,0xf0ffc55b9a979fdb7f8d136e4f475a795908e932
santos.hilpert@merepost.com,@@Masuk123$$,0x8bbc088f7f0515b90152af4d68f10ab13e76dfb4
alysia.ullrich@mailto.plus,@@Masuk123$$,0x2266a6db7bed4004bbd846da6e30f1c368bfe7f1
noel.nienow@merepost.com,@@Masuk123$$,0x4a451cf6b1f82d80795c4550e31d2516a58c7ffb
vaughn.schoen@fexbox.org,@@Masuk123$$,0xcdc0f6e01f0d05501a7e9228db690a6253b7a773
dylan.heller@merepost.com,@@Masuk123$$,0x73cfff440647acdceb447c2c4c4a3f547fa2b50c
tiffanie.stark@merepost.com,@@Masuk123$$,0x07d6b9866b550b9ba721174410658987fd4d7632
marie.bayer@fexbox.org,@@Masuk123$$,0x8b0543fd3dc39160419a713582a58c00e5d62660
marhta.rau@mailto.plus,@@Masuk123$$,0xf274a8e58354a5c7d519327e7e2bbcdb0901980a
esteban.wisozk@rover.info,@@Masuk123$$,0x303252835facbeab4682361f2b164a7a949cf8ce
elna.feil@merepost.com,@@Masuk123$$,0x955d78e39a28de8c197e6654f1a4970dc8af5332
alberto.tremblay@fexbox.org,@@Masuk123$$,0x5d96aa7814ee57402a8ff367cf5f6fe2701ce75a
bernie.mayer@fexbox.org,@@Masuk123$$,0xbdb242f55edf2d0d8af314e0fc7757bccce593c7
stanton.krajcik@rover.info,@@Masuk123$$,0xfcca56130451b5c630e3172ae002160e61f9a933
shira.schuster@merepost.com,@@Masuk123$$,0x72f772eab345fc4239eaa1d796e58f15840d225f
tiny.kerluke@merepost.com,@@Masuk123$$,0x9b2b6e6a8083344fae54eb7fb9181635ee189678
karine.keeling@fexbox.org,@@Masuk123$$,0x94d6127e020d5a94d09cf2647e2527f06a5a4592
marcellus.lowe@mailto.plus,@@Masuk123$$,0x65b001e18d7bbc79247e96b81e84ccae8f1347eb
lane.bashirian@mailto.plus,@@Masuk123$$,0x91571927cbd7fad5101d8abcb57b94b8984f9197
harry.boyer@merepost.com,@@Masuk123$$,0xa8bb7f637bd675005d49b815bfad7a2f777c2b10
derek.bins@rover.info,@@Masuk123$$,0x77ea97a6321639c50aba1ec9f52700eed513e410
quiana.stroman@fexbox.org,@@Masuk123$$,0xaa9980efd87821663729e274b08f0bfc246fe03e
wei.flatley@merepost.com,@@Masuk123$$,0x386038c5f8a834d3e99763ed203a803d30ebea84
doreen.kris@rover.info,@@Masuk123$$,0x669fe65c80c1aa46b1b3747424ae4c15bb08252b
titus.hintz@mailto.plus,@@Masuk123$$,0x5203fd6d872afbd891099999ba7ecb83c7f347db
rayford.ledner@fexbox.org,@@Masuk123$$,0x76738754738a2bdd1c3661499f6664b6803b74cf
wilfred.sanford@rover.info,@@Masuk123$$,0xaf2b2d92bb122b219fa389a6eb54c0e0930ea99e
kalyn.boehm@rover.info,@@Masuk123$$,0xa4927ac13872e9e3c98e4befb20e05d1074c06cb
renato.corwin@mailto.plus,@@Masuk123$$,0xc948808ac8b6b2b65b0f572e55641d9eaf435355
cornelia.daugherty@rover.info,@@Masuk123$$,0x037fef87f1c280f15018673ac674c14d2fdf987f
russell.kertzmann@mailto.plus,@@Masuk123$$,0xddb72777ac727ff52a424942b757af96aa5eafa5
antony.block@merepost.com,@@Masuk123$$,0xc9c08f8508cfaa8b5d1d4d09bddaf2e7e59ef47f
mose.wehner@rover.info,@@Masuk123$$,0xfe4bab7455ab1b1609a883b14f4b7e1831edc304
shelton.schowalter@mailto.plus,@@Masuk123$$,0xd226ed4a70ae22a154dbbbc215e18884d351ec78
lucien.bashirian@merepost.com,@@Masuk123$$,0x1041636c13de05ed8f85d9e7d641d777ef00d82d
randolph.pacocha@mailto.plus,@@Masuk123$$,0x02a0b533a878d20401155fba16fc9bba3dfc24d6
myrle.heller@fexbox.org,@@Masuk123$$,0x35c3d73eb853bf65e84e7f105c7079e7361f5d51
vertie.wolff@mailto.plus,@@Masuk123$$,0x1473a3cba02c852beae694ffd3e57f38d71c9309
tod.schulist@rover.info,@@Masuk123$$,0x863cd7a7280d0bcbbd9041cabda30955fa61fc3f
freddie.heaney@rover.info,@@Masuk123$$,0x8997801da07477b2e5fce44ed320525047cd6fab
dustin.corwin@mailto.plus,@@Masuk123$$,0x2c8f4b60b2dc6e50065da3ffc1e1b60d8759071d
deidre.o'kon@mailto.plus,@@Masuk123$$,0x6c74a678c149afeaf060e319ea013bec82d10e9d
tania.mueller@fexbox.org,@@Masuk123$$,0xb044225ca7b8b79f08380b9433f4070d6d886d9b
lucas.franecki@mailto.plus,@@Masuk123$$,0x9c38c9bfe5cc87d6ae7208acd1a49c52108b8846
jacqulyn.wolf@mailto.plus,@@Masuk123$$,0xe668891e8d7268edf7113c8798d6467f121c0ade
lupe.macgyver@mailto.plus,@@Masuk123$$,0x726d28b144944064c44599b6884a9ce56244ec81
phillis.lang@merepost.com,@@Masuk123$$,0x25b2b33091b630f2ba8ea4a5e6947a7187ea9023
dennis.jacobson@merepost.com,@@Masuk123$$,0xb44ac46acda0696fee3d13ea962a70bb4caef1c1
wendell.schmitt@fexbox.org,@@Masuk123$$,0xef4563b46acb8a1e46fd6ae2f19e70ac22d265df
treva.reichel@rover.info,@@Masuk123$$,0x3a5c89280cfb3ccb08201238f048811760c35dbe
sima.yundt@merepost.com,@@Masuk123$$,0x566762239de97d1102c7af61d9b40c59c55fbf42
dori.braun@rover.info,@@Masuk123$$,0x7029fd693a939d603ea6ebe484a782c556779453
vanetta.hartmann@rover.info,@@Masuk123$$,0x02136dbacdac0e01d6150d8ba019231f4adb3cef
torri.oberbrunner@fexbox.org,@@Masuk123$$,0xe9e332ad30e58b03ac8e7d3facd840f05dfe2ea9
natacha.prosacco@fexbox.org,@@Masuk123$$,0x203f542973a9144df162bd91278e85d633269f81
guadalupe.reichel@fexbox.org,@@Masuk123$$,0xa1a0d7be24a2caff847ac6a09639c2ea3e7e5615
jose.brown@rover.info,@@Masuk123$$,0xe99a3cac2f137aecccc969779015d091cf57c441
alejandra.cole@merepost.com,@@Masuk123$$,0x0f680e7ae46885ccd9de3f8684d26788387c022c
deetta.jacobi@rover.info,@@Masuk123$$,0x391f637211bfae1aa4a52caa53cf6476dc4c176a
lenny.dietrich@rover.info,@@Masuk123$$,0x46e5c42856f819c0cbbcd26c1bb8f96023543821
rudolph.balistreri@mailto.plus,@@Masuk123$$,0xcf0e0b106d19a98a3478bc7f580d265de25d1164
edmond.maggio@mailto.plus,@@Masuk123$$,0x262ad131f0cfc35e94a06a13d598f95877dfa5c3
richard.schmitt@merepost.com,@@Masuk123$$,0x85f1645afaeb55fd92fc77172ea9de20f97248f0
isreal.hansen@fexbox.org,@@Masuk123$$,0x6d863c5337d9f54a46edcb4e7e71363ca30ddb64
angelyn.stanton@fexbox.org,@@Masuk123$$,0xf79fbea19c1b7993bf3ce4de92ece1a2a02a743c
laurence.ryan@merepost.com,@@Masuk123$$,0xaea6543dc8807413029e8fac154d58404c9974fe
nakia.franecki@merepost.com,@@Masuk123$$,0x385f8ed7b4bfa805718225e06c73765e61fe0807
emilio.borer@merepost.com,@@Masuk123$$,0x5af13a60c4be95b8e2ac37c2fb9007d7c29a39cf
jody.langosh@merepost.com,@@Masuk123$$,0x7c6c884b504700f3c0649a0bd037cc8610ae2817
nerissa.fahey@fexbox.org,@@Masuk123$$,0x6aa2f47672f55574fa57e2b8b469807812acf591
bernie.schimmel@mailto.plus,@@Masuk123$$,0xe42c26dbce30e3847e9a3ad20bfd78c01d0915d0
terrence.hegmann@merepost.com,@@Masuk123$$,0x7e42847cd2f1eb0a3d0a10433a86aaecbd8940a9
alfonzo.lowe@rover.info,@@Masuk123$$,0x93e5351ffa4083c3aa25426cf4e8bc40c0659c95
carlene.davis@mailto.plus,@@Masuk123$$,0x082da7119f36a6567034ce039e1ff8add75c74a6
lashaunda.langosh@merepost.com,@@Masuk123$$,0x3cb402f4b3acf6f2e9f7d0598685e811f7b886b3
jillian.kiehn@rover.info,@@Masuk123$$,0x1a3088c6b47d47aa4262b8dd4c36c18717dbbbe4
lucio.marvin@merepost.com,@@Masuk123$$,0xbc30804d485bbdcbacf9bda8bc052bdd9b157ae0
jewell.runte@mailto.plus,@@Masuk123$$,0x806360750050497f099774fa70c1384598b58369
korey.bailey@rover.info,@@Masuk123$$,0x4415b72cc856daf281e11b62508cd300f55662d1
lamonica.willms@merepost.com,@@Masuk123$$,0x6f82e9d310c23d5f7554fe0625a4ff0baa86cf76
erma.gleichner@fexbox.org,@@Masuk123$$,0xe2921921321835b89e3c615f064fa81ea0959755
glenna.zieme@mailto.plus,@@Masuk123$$,0xbd1ddb27f0fe524b13ddb9e8ae0a5a5a1441665d
emeline.lang@mailto.plus,@@Masuk123$$,0xb537ddc3a46a0caf693f332b5a7cba609b47b9ef
lucille.haley@mailto.plus,@@Masuk123$$,0x2034d60dd80a59ef2f230e61df43793ea5aff665
stewart.kling@rover.info,@@Masuk123$$,0x37230bcd5bb8faa604b10227210c6aaacc493387
freddy.rempel@fexbox.org,@@Masuk123$$,0x6f5bcc61a20b117516d8c139b534929f87bfd2df
latanya.rogahn@rover.info,@@Masuk123$$,0x57a44a94f3b1c221c7bde1dd271b92dbb644ddf5
amalia.johnston@fexbox.org,@@Masuk123$$,0x8d84484ce5da1d67f7c9a446e102d936fc06ee86
sabina.schowalter@merepost.com,@@Masuk123$$,0x05a5e8d41244a45f55855a4d5506ff316259bd1a
boyce.bergnaum@fexbox.org,@@Masuk123$$,0xccb1943fe031f2302bab2411d7ebe96cf4b36132
deangelo.waelchi@rover.info,@@Masuk123$$,0x3fbdd09587189d1345ec53ba05774e502deb6f32
max.wunsch@merepost.com,@@Masuk123$$,0x930e115428320f7f7e920cc29b3129cd6d92a45f
euna.beatty@rover.info,@@Masuk123$$,0xac114c7069d2acd66327b111c25776750eb9483c
racquel.adams@rover.info,@@Masuk123$$,0x2571752428fd31cb4f301325dc84fdab92f8ce47
benny.mohr@rover.info,@@Masuk123$$,0xad1e146372f004766223a44565494f2f35bb3dc7
lakisha.simonis@fexbox.org,@@Masuk123$$,0xfd3306edcdada2240e196cbbf39899f84342fc2c
buck.grimes@merepost.com,@@Masuk123$$,0xba7300ff877bec618f08a7fb966786ebfbbca16f
julieta.hahn@fexbox.org,@@Masuk123$$,0xa703dd49b408128f3626c512df65267369cd57d3
ali.huels@rover.info,@@Masuk123$$,0x25a5d34396a8c33a601e1e51b9a2e371a63056f0
dion.hand@mailto.plus,@@Masuk123$$,0xafb22eb30fa557ff48f61b27d5f592b2f953bb42
sabra.rogahn@mailto.plus,@@Masuk123$$,0xb04c6872adc8f0bab5c799b38705840f3d672dd2
jong.bashirian@fexbox.org,@@Masuk123$$,0xbcefcd2eb2152e6c2474ee29ebf9d3bffec706db
steve.hartmann@merepost.com,@@Masuk123$$,0x775dc82b4a7fc9bdefdcc40b468f07a7329a0b3f
david.purdy@fexbox.org,@@Masuk123$$,0xbc8c2c55efb629569f0ea6de31f4f890ac8c68ea
otelia.jacobson@mailto.plus,@@Masuk123$$,0xa59e43ae38c6c3fd709a1986d65e01d2947316a2
noma.marquardt@mailto.plus,@@Masuk123$$,0x4d1ef0dfc696b710e67c65c64f38b294836b74e3
malik.heller@mailto.plus,@@Masuk123$$,0x0bdea59851eeb17573a8e0db5747dd44c3e5dc1d
tamekia.jast@fexbox.org,@@Masuk123$$,0xd9756c5b45bb822f014034843a56f5cf6d74231a
jeannetta.o'connell@fexbox.org,@@Masuk123$$,0x592c19fdbfe39ed9a4ae8e6d20d32a3fe4043a0a
bryon.mertz@fexbox.org,@@Masuk123$$,0x6f66b150eed5ccd1e5516cd545b22b01bca367d8
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
