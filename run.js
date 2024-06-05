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
cipemy@clip.lat,@@Masuk123$$,0x42bbca086eb05a44731995be41a612b4ff612935
lipyhamo@molecule.ink,@@Masuk123$$,0xf87fe9a3b846f4c62386134af0278f099b74a54b
labeni@citmo.net,@@Masuk123$$,0xc205db46c263d49218b0c2822ad19bde3d110acc
hikibe@cyclelove.cc,@@Masuk123$$,0x893495425de199e66aafc63b3a2d339cae5e9093
dumilyse@clip.lat,@@Masuk123$$,0x5b3276796334efe6c14ee7fbac3779a33effb2d2
lyjalaka@molecule.ink,@@Masuk123$$,0x1c815213c6885a015d2bfc6fbb2c41e7dc72cce0
runekuko@citmo.net,@@Masuk123$$,0xb4f3fc6257fff4d17f6565dde37a65c4f0c95bf8
badufe@cyclelove.cc,@@Masuk123$$,0xf20667492c9ef8df33ae496da74eab09e9b404db
tofuziji@imagepoet.net,@@Masuk123$$,0xb8eea1e1ebab8fe46d67dca5d17f3237e7f0a85d
xokeqybe@cyclelove.cc,@@Masuk123$$,0xdee7116ca954fcd4f3a9a37a5ea4e925e16de4f2
lyfury@cyclelove.cc,@@Masuk123$$,0xfedd765f27ef303a838672c141a12c85f822a501
safatuwi@clip.lat,@@Masuk123$$,0x23453410a569fa055d01c6fbcef6ee7f7b159b83
wyjesipa@citmo.net,@@Masuk123$$,0x6ec945cc0acc5e7e525e6e3eeb1390399351db6e
wohygo@citmo.net,@@Masuk123$$,0x0dab4fbbc5b76a248bc6e6453b46e4e69ef5b8a3
lilipacu@pelagius.net,@@Masuk123$$,0x4767033b773ae00d58e8888fb44c348cbfea0299
rowihiwi@citmo.net,@@Masuk123$$,0xa13317065f90248d81220e2d2ae476d5a73d5870
kefumi@molecule.ink,@@Masuk123$$,0x2d2875a5fc0124de3f96c89efc895cde2f0dec41
gatotixa@pelagius.net,@@Masuk123$$,0xebdead5eb41905aac035e7c49b9ffffc3a6f3b0a
vizivati@citmo.net,@@Masuk123$$,0x37c34f163fdbad12a23d2a4c608bba01619f808a
linekore@cyclelove.cc,@@Masuk123$$,0xf7917eee381bb94a96f61ff8070b5fa4dc70b88e
qylulymu@imagepoet.net,@@Masuk123$$,0x449443043cc4eab1df88da1778e7072d3f2aeecc
cufiki@citmo.net,@@Masuk123$$,0xbba4c821463cde12e27e834ae238c6eda65386f8
vesozamu@imagepoet.net,@@Masuk123$$,0xb750bf61fc060337e50cfb978e297a1b4a5852c5
lutofaco@citmo.net,@@Masuk123$$,0x1401c2e48b917502aaf88c5c37cb5b417bf9e3b4
wulexu@pelagius.net,@@Masuk123$$,0xd1b2396a474c1adcf76d08267a74a29c65cf34c3
cyxegy@imagepoet.net,@@Masuk123$$,0x70ebf745f13434142b9daad0268a0d721489f8d6
karisaczenderslb250+jtvcn@outlook.com,@@Masuk123$$,0x1a20d6437c0a9372e7f66e93d26e3e3973fd4edc
qoqitoqu@clip.lat,@@Masuk123$$,0xd19b9b94bb7878824d6cf6fc51472becf4c27022
pagigyqi@cyclelove.cc,@@Masuk123$$,0x55e5cd73d8477954d11365330b476d87543689b0
setani@pelagius.net,@@Masuk123$$,0x3d5a921c8718d0d35d7d3bf6e6a20175af80f1fd
mosazi@molecule.ink,@@Masuk123$$,0x19b19bc0674ddc34c279d71ccbc2ffa7830d8234
ramirofretwell523+hvj8e@outlook.com,@@Masuk123$$,0xfd19536ec573126064e33610199dc455755c3a37
qobimoca@cyclelove.cc,@@Masuk123$$,0x306c2023db191edb297b40c219393ae62fc60a7e
voxise@clip.lat,@@Masuk123$$,0xc2b41ef5c924ab73ada7741c97e54f99ac855b7e
xihyvetu@imagepoet.net,@@Masuk123$$,0xadc25e2922dfd73c875235f207a6f2f65c2a566d
gaviga@imagepoet.net,@@Masuk123$$,0x77bd6eb6f582159fbcc3a9638653876d3830b749
benjaminmiller3465+ehxtn@outlook.com,@@Masuk123$$,0xab40ac687034e8343a85533c9e9c9382652bada6
rachelere261+2j3ms@outlook.com,@@Masuk123$$,0x8c753d33ed00a31fb8797b0c29836074d912e353
tamara324753+5hep2@outlook.com,@@Masuk123$$,0x9fbda7a3c3528a30a703b1016843b7aac975bae4
karisaczenderslb250+ctyo4@outlook.com,@@Masuk123$$,0x4fbde287454f81183fa8e49f80b1c971bd8080eb
donaldsoto4562+uoibh@outlook.com,@@Masuk123$$,0xc435631d35af57189f9b39edebed964165922b1a
markbradley65312+vc9a3@outlook.com,@@Masuk123$$,0x96490802f14d85a7dd2836131f16b9b5c370eb6b
nathanrichards3463+tdmey@outlook.com,@@Masuk123$$,0xca8eb7421cf230b06bc925427efba3c37c02b691
bryancarroll5457+lohhd@outlook.com,@@Masuk123$$,0xb13699118b836bb06e1395f25fd7ad4dd609cb04
rodgerweller5642+xhmdq@outlook.com,@@Masuk123$$,0x711d3afc0b1b0d1b2d0a570e820ffdb76202a1e3
anthonyferguson645762+htuds@outlook.com,@@Masuk123$$,0xd655bd59f192d85c324d907e5dab6d703e77370a
sarahgardner5375+k1nrv@outlook.com,@@Masuk123$$,0xe0531a710aa5b0f88b95258029763d72109078c3
bettysmith4326+88b3g@outlook.com,@@Masuk123$$,0x159ba82a6996a3cd5a3ddd05b5170c3edf1ce707
amyfranklin2232+nh9h7@outlook.com,@@Masuk123$$,0xaa82ca1a7047978f20a0f6e3a927819b9786b1e6
janegarza3467+albs3@outlook.com,@@Masuk123$$,0x80bbc878b5afc77415426f34d1ef23081ba1bdfe
valentinmello535+hpz58@outlook.com,@@Masuk123$$,0xc603714fce8422ef50f24feaf2e829acfb4f4211
aubrey.rolfson@rover.info,@@Masuk123$$,0xa1f2950e7c9e167828e147384b3ed88cfd66f3bb
tomeka.mayer@fexbox.org,@@Masuk123$$,0x7b1ab0032c86f8e4e349c8b949fc910cbbaa5a8e
jamison.schaden@merepost.com,@@Masuk123$$,0x631e4c469aeaff04da2f06fa0776e92b52ac7463
alex.schumm@merepost.com,@@Masuk123$$,0xf557005503841ad315101e2d8e6d6e4c6c1497dd
roland.hudson@mailto.plus,@@Masuk123$$,0xa4b3326e3e516628dbc8c14de96610ca4c7c6e5a
shani.legros@rover.info,@@Masuk123$$,0xa5fdcc27db75eeaecded0989be2ef834771ed45c
harold.ferry@rover.info,@@Masuk123$$,0x89feaa46135de4fb1e537593b870153fdc69ede1
edmond.roberts@rover.info,@@Masuk123$$,0x3857cb2be8552a18f6c2b1109084708f104af574
mickie.zulauf@fexbox.org,@@Masuk123$$,0x963bb113e388a1c0151a1200b1187a44df46d241
lewandoskishona.uq.y.l2.4.8.8@googlemail.com,@@Masuk123$$,0x7c0f2a1b2719f96d7acf3ec1b30283945de30deb
foster.hammes@fexbox.org,@@Masuk123$$,0x979db84dd7f2973fd07df7a288c05a14f70843ba
dexter.purdy@mailto.plus,@@Masuk123$$,0xaca88aa26752b44c1e78bf7132de09ae8fb866c6
willis.okuneva@fexbox.org,@@Masuk123$$,0xe4d32b40fe486322838612233ab014374103ced5
everette.mcclure@mailto.plus,@@Masuk123$$,0x9e731663b0ce5ca91c8430bb11493b07a5778aaa
jovan.ward@mailto.plus,@@Masuk123$$,0x02d4f140f95d187de2a814d94a5ab50acc8e715c
trey.hudson@merepost.com,@@Masuk123$$,0xa6e3c4b5e6fdf5fdf28e13c2c2acfc1f4d94c168
emile.marvin@fexbox.org,@@Masuk123$$,0xa9128e66dab3d61d163e108acf3836910b97a581
elda.lehner@fexbox.org,@@Masuk123$$,0xe5cdafa68cf40cd84622aca3f6a48ac09a6db93b
russ.frami@fexbox.org,@@Masuk123$$,0xb889ddc2d07831ade5138138c08881d5c2b74f0a
harland.keeling@fexbox.org,@@Masuk123$$,0xe4a8dfe94dbe1ab8f52059760365fbc4bc45c0c0
odis.reilly@merepost.com,@@Masuk123$$,0xc12cfd5cd17fe1eea7c63b88e582d02f87dbce37
ardis.pollich@mailto.plus,@@Masuk123$$,0x9d913dee281b1f7869d69b680feab98b13d700e9
lonny.swaniawski@mailto.plus,@@Masuk123$$,0x12cc24c6c4e2b66f7b0f7ec71b9467ec1ddbc5e9
lewis.balistreri@mailto.plus,@@Masuk123$$,0x66993683a2287ba41da72ed3ea39af105eb0a05d
samatha.grant@mailto.plus,@@Masuk123$$,0x8c5b79aa57d0935b9f699e751d54c556bb182fa0
kecia.schultz@fexbox.org,@@Masuk123$$,0xfdc0a59cad31b4f75f1003f7451c50b2773fb28e
ping.steuber@merepost.com,@@Masuk123$$,0x041bd9492fc3c0bf1331401770e449a5e303ed2e
latoria.purdy@merepost.com,@@Masuk123$$,0x67aaacf3abebdda170fceca5345b57d70adb0b19
sue.gutmann@rover.info,@@Masuk123$$,0x58317e0e9a5780407b915fc7108d1076328b79b6
bennie.ondricka@merepost.com,@@Masuk123$$,0x3d91af031132e5c0fdb7d6c0e82e17b2fec38ce6
ilana.bergnaum@rover.info,@@Masuk123$$,0x204719e1293823cf6fb605a0d567dce2c0297bfc
odelia.hermann@mailto.plus,@@Masuk123$$,0x4a6cb6b24b1debe50ea24809c89fee42c5a2bcc9
shayna.nolan@merepost.com,@@Masuk123$$,0xace213096393435c7752b8f352b1122fca6ae23c
jamison.schimmel@mailto.plus,@@Masuk123$$,0x1f20980d387d2d72c7e3735f04d5357591f57930
christina.mayer@merepost.com,@@Masuk123$$,0x078aae024dc66123c9e8fd3075e2d4d193d876dc
alfredo.mueller@fexbox.org,@@Masuk123$$,0x360714c10f202e847fa1cfdbdb188554e48c100b
vince.rogahn@rover.info,@@Masuk123$$,0xd1dd2437af54c596533743c4e8c0adea3b30611f
christiana.hirthe@rover.info,@@Masuk123$$,0x3187e70d06564f8bdb7ad3b9fdb04db449cea6c8
martine.ziemann@fexbox.org,@@Masuk123$$,0x1959b30b2c4ff3a32c22ddd46599d5b44f897f21
avery.jakubowski@fexbox.org,@@Masuk123$$,0xef1245bda82bdd94f58fc63cdb1f879c213d4d1a
jesica.smitham@fexbox.org,@@Masuk123$$,0xb43ba2e64ea423ced880a1fc84baa9902b92cd83
marlon.kirlin@mailto.plus,@@Masuk123$$,0x9be0bc3f15b4b3e64978a6aa52c5a85240f64bef
vance.daniel@merepost.com,@@Masuk123$$,0xae99fd1d87aac20dd2b0ed1e86e0706eeec0c116
edwin.steuber@fexbox.org,@@Masuk123$$,0x14147a0e10f8db65d863e4e2ec85ed9c00eccbab
leila.sipes@fexbox.org,@@Masuk123$$,0x10707df5620ea707cecbb0e269e9e8750bf119ae
rudy.pollich@merepost.com,@@Masuk123$$,0xeee34e743232f08c381e1d9a675b6eb3a5c6f640
tory.cole@rover.info,@@Masuk123$$,0x72b97d3291c39f18138565c93af6d3ac29df239f
katina.cummings@fexbox.org,@@Masuk123$$,0x7b67349383a97dc5b8f4eb64dab8710bd69d89b5
josefina.spencer@fexbox.org,@@Masuk123$$,0x05cbedf233db0a251a5a5ebdb605d08073db5d28
fae.jast@fexbox.org,@@Masuk123$$,0x2e21935b6d3629b5d707728836c552f2fc0c2335
jeffry.white@rover.info,@@Masuk123$$,0xb381b4e807a885a5067d8bdcc5196468bcb8a484
archie.ankunding@rover.info,@@Masuk123$$,0x26405082127b838d61d8e70379a8819885d8b590
leigh.kulas@mailto.plus,@@Masuk123$$,0x67d3a94678d362c1e88228b6dce408893c7b860b
cruz.schuppe@merepost.com,@@Masuk123$$,0xa5f9aad3dca6c8b204e119ab339ebf36c3876771
dinorah.davis@rover.info,@@Masuk123$$,0x84c49cf8c669db5a065118af77e44cbd8c8da1cc
marquetta.satterfield@merepost.com,@@Masuk123$$,0x539a1b7465f5c8b035f333d0f1a7fddffb29a8d7
chuck.kris@rover.info,@@Masuk123$$,0x622b048144dd1d017fa414c160e971469b1f60ba
kena.kuhic@fexbox.org,@@Masuk123$$,0x1856cc042f01c742c74349608bf5fab55981d526
francis.kub@fexbox.org,@@Masuk123$$,0x1b06f3731d7d7063349cd253f895b8e8b0a7a14b
brady.schulist@rover.info,@@Masuk123$$,0x214188ed50953f84aeb09500e43fc1e033e8c233
lonnie.leannon@fexbox.org,@@Masuk123$$,0xac9651dfe3e06c5e8dc59469f76912ef53fa5862
cheryll.daniel@merepost.com,@@Masuk123$$,0x167191d75c8c0ecba769d670de60f32eb1b6b7f7
blair.dibbert@fexbox.org,@@Masuk123$$,0x77edb33dedc4902dccdb7827b17263c927223f51
karoline.collins@rover.info,@@Masuk123$$,0x6e1193ad289aa5261353512bd6c52e1b166d9e97
xochitl.roberts@mailto.plus,@@Masuk123$$,0x1488a6134305dfad4dfae78dfa29b3ec7a43f6ab
son.huels@mailto.plus,@@Masuk123$$,0x337db5a1156d1f1717d7995c40ff0e48d5bee53d
shira.daniel@merepost.com,@@Masuk123$$,0x849165dba5255764f8128c92f6c4ed2dc3ee9bac
refugio.gibson@merepost.com,@@Masuk123$$,0xe8116ce5b5cc198b96175107f28732397d57b38d
lavern.metz@rover.info,@@Masuk123$$,0xf8b3f77afc570ef343fa673a1d3b8bb5a8c61759
heidi.fadel@rover.info,@@Masuk123$$,0xd03ec222f6ccd1fda7a0f96207e2216c1b007294
grant.paucek@mailto.plus,@@Masuk123$$,0xf6895e6053a69200f3f62274fd0cbb42eb0e6418
lady.dickens@mailto.plus,@@Masuk123$$,0x942a790f17b2e1f9eef28107375ae882afc391ad
moises.schaden@rover.info,@@Masuk123$$,0xca78bd6320249946d93e09e3093d8c94dbf81a1e
rhett.macgyver@mailto.plus,@@Masuk123$$,0x0666c54d376cf4e8479f3cd8407a54be6a954dec
benny.little@fexbox.org,@@Masuk123$$,0x43b2c39c4ae2f52a26cbd3f4c7efff8c862246b9
claude.rippin@fexbox.org,@@Masuk123$$,0x22481d385903841cbe2d86e1865d8d3550ade1fc
lorina.carroll@merepost.com,@@Masuk123$$,0x564f8b5ba6793e93a2245a0d341f758a0fb0fe14
charles.kuhn@merepost.com,@@Masuk123$$,0x66f8f0b3aa95965c1ecb48aa91feea0a1fe57881
miriam.williamson@merepost.com,@@Masuk123$$,0x0a0fe3f3150bb6994b1b93218b55f5883c691f43
erich.jaskolski@merepost.com,@@Masuk123$$,0x0b847866545760253a53a02f4dae8abf5cb3a070
isela.parker@merepost.com,@@Masuk123$$,0x1da910d772893af39fe618c92fb0f394a02297b5
whitney.toy@mailto.plus,@@Masuk123$$,0xa5f192fc52466fee66bc77736dce6222694a2f76
chung.collins@fexbox.org,@@Masuk123$$,0xb93703dd64b6d6fbc52be8315ea605778db120ea
reginald.walsh@rover.info,@@Masuk123$$,0x5f8390d77fc35b80f64a4a07438de93eccba0a26
shandi.nader@fexbox.org,@@Masuk123$$,0x04924832a11e5b064243f6e2247371e4eb5214cd
kaitlyn.weber@fexbox.org,@@Masuk123$$,0x3665bc7a961b2b789e3ad6c88bf04e266879010b
viva.rosenbaum@merepost.com,@@Masuk123$$,0x59456a7f6a1f7b437c5d83848c208f8d430d3c20
darin.runolfsdottir@rover.info,@@Masuk123$$,0xe3d83036b172d0eb4c8cc89ccdfd799c4d3a513e
zackary.langosh@merepost.com,@@Masuk123$$,0x3bdf7ca2809d534e79bfb8c02b7c152753bace51
theron.murphy@fexbox.org,@@Masuk123$$,0x6bcb60d97686241ac1a8527d743141c7de5fd471
allie.gottlieb@fexbox.org,@@Masuk123$$,0x17639f6e2e4cd309f79aefb47cdd887a3ba3d242
tonia.trantow@merepost.com,@@Masuk123$$,0xbdf04b6874a862ffa9b1f6d1bb1421d899aeaa45
felicidad.sipes@merepost.com,@@Masuk123$$,0x2cbb36c5505fea44629c9d2206a50052db6eec4a
tara.balistreri@merepost.com,@@Masuk123$$,0xc117abd60665c9de5c53a90a480c2c800b9f6b5d
hong.lebsack@rover.info,@@Masuk123$$,0x9021e90c7ff2d6a0f9b6cca5db0c9882bfb34d62
barton.stokes@merepost.com,@@Masuk123$$,0x5242514fedf790dc521c8608190b449f7bc41b6f
ivey.hermiston@mailto.plus,@@Masuk123$$,0x7f31d8db6aa2e1c89036f4177f5cd334b611a3f5
magdalen.kuhic@mailto.plus,@@Masuk123$$,0x67bcd284a29fa82147dd47ad5e9986bf343ad7f5
wilbert.shields@fexbox.org,@@Masuk123$$,0x3c1a91301d9bf7b79cec133426d6df78239f7ba2
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
