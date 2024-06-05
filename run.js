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
tyrell.yost@fexbox.org,@@Masuk123$$,0xe973d3eed89bd9362edb49e6cc392e7193502b29
cory.schmidt@fexbox.org,@@Masuk123$$,0x31f9832425d6245fc369f36b83df392e050d3a51
lincoln.brown@merepost.com,@@Masuk123$$,0xf7e138e32768428bd5cbd7f7efe83aa2687d0fed
angele.heidenreich@merepost.com,@@Masuk123$$,0xb8ccd5f9c6afdbae8b24f8c42fbca8ad5adde0cf
noelle.klocko@rover.info,@@Masuk123$$,0xccf7c048a749f2f4cb78a8f3e9f60bdb518ff178
verona.waelchi@rover.info,@@Masuk123$$,0x84700341a42c123aaa8373a85c3a24628a42d145
leena.jaskolski@merepost.com,@@Masuk123$$,0xd535ce989ad05358549d3e3e1e4d4996eaf3cfbe
dania.jakubowski@fexbox.org,@@Masuk123$$,0xe696af00db2472ec606c50a469ce236782e6c65b
vesta.d'amore@fexbox.org,@@Masuk123$$,0xb254a9421fa21b4e49e371e2384ca6c0465f124f
waylon.bergnaum@merepost.com,@@Masuk123$$,0xaf1d2f5fe643191d68ff76224ecec0cfd6a334fb
linnie.orn@rover.info,@@Masuk123$$,0xff64599ac481891c7c92dd7a9987dc05b0f9778a
leroy.jacobi@rover.info,@@Masuk123$$,0x7d9a9ce3f9805e5e567c79ad3b388f86b1531ff0
delia.hegmann@fexbox.org,@@Masuk123$$,0x2d0bc6883845791af2db9e0b030ffcd6088e9ef2
paul.zulauf@mailto.plus,@@Masuk123$$,0xce53b9043dfc1ad42f34e1c3ced11baab191d908
tatum.christiansen@merepost.com,@@Masuk123$$,0x12b646002e048d775b0365b03c9c6e24780cbbb5
cristobal.bode@mailto.plus,@@Masuk123$$,0xcfac5b3a957c3b0453920a2701c2cf887bc41d0e
ezequiel.yost@mailto.plus,@@Masuk123$$,0x18c3a065449e1dfd92c7b5c05c6a52cbdee4d187
dean.hintz@fexbox.org,@@Masuk123$$,0x4591107a4521a4ecf1df0b51787ac34bbed10643
vivian.walker@rover.info,@@Masuk123$$,0x1cd46f6ac28f11e5df902524f81c9b6a8b7b47d9
elroy.little@fexbox.org,@@Masuk123$$,0xb007901bcd56cae36dede0cf63841d7851691dd0
rhiannon.wolff@mailto.plus,@@Masuk123$$,0x67afaefb5e6936b70b22916556d3a6abe752617c
kenny.hills@merepost.com,@@Masuk123$$,0xd49ed000546b51d961f64e7586925515e506ee8f
margarito.hyatt@rover.info,@@Masuk123$$,0xa659675e7b9b8620f89b7e233d6c6881904ffc7f
daren.ondricka@merepost.com,@@Masuk123$$,0x5d48899a3ef08bfdf3dee0c833aec6b091fdb5e0
benedict.paucek@mailto.plus,@@Masuk123$$,0xea13a0abe2cd7b5e3a76517fdbd7709ca68eb362
williams.zboncak@mailto.plus,@@Masuk123$$,0xabd3bdc0bafe47ccb6eab9b33735eecdb5394c0a
talitha.rutherford@rover.info,@@Masuk123$$,0x94ee1c70113a88a2fd95b8764fd198007f6984cf
cathleen.fadel@fexbox.org,@@Masuk123$$,0xa8a02825fcff67adfeb8936459ea88996eec230d
winfred.gutmann@fexbox.org,@@Masuk123$$,0xeb50a73a238b8d17c55a1e9955fa810d8df8843f
harriet.sawayn@rover.info,@@Masuk123$$,0x068460b408ee56be87f4afa19400f867da90055e
miesha.reichel@mailto.plus,@@Masuk123$$,0x5daf207b9cd45eef4004af9e99acd983cc598f8b
denae.jacobson@fexbox.org,@@Masuk123$$,0x51f971fbee5e7912ff221fe35f8f88874e37f26e
darcel.greenholt@fexbox.org,@@Masuk123$$,0x2de5c9c31923a66d5dafa388a3fb22e057ce25ce
florene.friesen@rover.info,@@Masuk123$$,0xe5e8086ea3454f8e689f3af6c9203d8299cf28ef
terri.halvorson@fexbox.org,@@Masuk123$$,0xc6196e572b89d4fbf452e7453a48418e6a11db9b
douglas.nikolaus@fexbox.org,@@Masuk123$$,0x829e0d35a7b9016796bbb19445e4f6f59ecc4961
kristofer.buckridge@mailto.plus,@@Masuk123$$,0xd1633f54795da2064509385add23a9c1d605b5a3
arthur.reinger@merepost.com,@@Masuk123$$,0x3e9fd5585c51cefc6ecfe8484c9090d4acf6f808
rosendo.bernier@mailto.plus,@@Masuk123$$,0x5cbf1c1dea6d7a402a3104efd040db2c9238d507
natasha.mills@rover.info,@@Masuk123$$,0xdfa4907e01a76872a4f9983a9bd7b35a848e40d1
elna.skiles@merepost.com,@@Masuk123$$,0x42efbd794918c023b6a746492e77438ccbe4e842
isidro.okuneva@rover.info,@@Masuk123$$,0xe3c295b7bc057631328f0b798abd9bb42fd3feb0
colton.bayer@fexbox.org,@@Masuk123$$,0xa114ac618cb905cbec83dbcab920ed47f0a8a944
norman.parisian@mailto.plus,@@Masuk123$$,0xb6165086763804539ec3d85f6a9a22786221d4f4
jerrell.okuneva@rover.info,@@Masuk123$$,0xf88d7264c20662a1ba41460019467498052b7e72
dario.schmeler@rover.info,@@Masuk123$$,0x07cb64aab9dadbe798371c5f257fdcbefc585843
houston.farrell@fexbox.org,@@Masuk123$$,0x77ad1ab6518e817750c4b06788c42a3f55ff29ee
harris.schneider@rover.info,@@Masuk123$$,0x95f76d73b782d114dabd18e5551a9db00c238869
carma.jaskolski@rover.info,@@Masuk123$$,0x37a13816ce158d1beb697b8bc29700b01c95e1dd
rodolfo.little@mailto.plus,@@Masuk123$$,0x3b627a474968ba0586d89b37e4245ab61c4b84f0
valery.mueller@fexbox.org,@@Masuk123$$,0x06dc45d8c497c6edd2d1229c5bc6f2bac91febf3
taisha.kilback@merepost.com,@@Masuk123$$,0x678f7d0ef2c73f318ed97f366d4f4f5d2d8d3e86
haywood.collier@mailto.plus,@@Masuk123$$,0xf1d49f9bcf78bb33eb04a2dfce273f06b51d885a
krystle.hagenes@merepost.com,@@Masuk123$$,0xa4ea57df356acb7383c49eddd19a52d82d40810e
jenny.keebler@mailto.plus,@@Masuk123$$,0x65d6cd060a58231b9ca5be5328d898ae53498651
song.weissnat@merepost.com,@@Masuk123$$,0x3ce2602bb439b018949ce913e05a65e9ac94c73f
chester.skiles@rover.info,@@Masuk123$$,0x871a9dca9ea6e40fd02ce05a82a831547b467762
todd.effertz@fexbox.org,@@Masuk123$$,0x2a12b75a9286f5a2d9dc6a342901958a8f52bec1
elsie.jaskolski@mailto.plus,@@Masuk123$$,0xecdc5cd865f66db2ed80b2b211efa3d682e1babd
erline.nolan@mailto.plus,@@Masuk123$$,0x048b419d8771349c2a594614e41b2f6fc7e69beb
jarred.daniel@merepost.com,@@Masuk123$$,0x08d0a411de08470272a770e76838fe6f91012b4e
edwin.crona@mailto.plus,@@Masuk123$$,0x022a8243cffe0fef7c8b90418d09c75c7c689ae9
ricky.walsh@fexbox.org,@@Masuk123$$,0x76fda2a5a0d55bd714ce4aa86dfd3c9602064780
logan.conroy@rover.info,@@Masuk123$$,0x667800542cafcd3816ea0f219722606cc6388076
pasquale.runolfsdottir@fexbox.org,@@Masuk123$$,0xb598e311152f4bed324490d6ad94ba31ae16fafb
dannie.hauck@fexbox.org,@@Masuk123$$,0xe00ba53d6eaadedfe6ef892f897bde2a88234822
edmundo.beahan@rover.info,@@Masuk123$$,0x31ae1bd668b44a992bdd57e1866d8a69889d0bfe
bobbie.pagac@mailto.plus,@@Masuk123$$,0xfdcb4d567ce458749740262b3953828f387fba1e
emma.grant@fexbox.org,@@Masuk123$$,0x107618e8f2b36c23fbbffa9d532562f95deae494
demetria.bednar@mailto.plus,@@Masuk123$$,0x552ff1450ff257ef691bd9fc4a2eb46ce769dd82
sharika.cartwright@mailto.plus,@@Masuk123$$,0x102b628997f95f5d9fbc6404a7d5e6e2aa6b2ddf
christoper.russel@fexbox.org,@@Masuk123$$,0x310ff44aec72a7d760ad438273d58b31bb571c16
willis.beier@merepost.com,@@Masuk123$$,0x1b3461d8bdd47c63eff9fbf85676b8accccb56a6
myriam.sporer@merepost.com,@@Masuk123$$,0x8732adcd76900e4fc9a04c807c26b414c1ffd67b
lizbeth.mann@merepost.com,@@Masuk123$$,0xe739f76d37a898b977f94c945666057883bdddab
josh.schowalter@rover.info,@@Masuk123$$,0x50e41cdb9fa4b436a037eed979c3dd2787175dab
beatriz.jones@fexbox.org,@@Masuk123$$,0x054a83249e19888a694f7b5a303021be7103fe35
kamala.buckridge@fexbox.org,@@Masuk123$$,0x00fef22a68405f85a9b2350544d314e859eb28a4
tova.ward@merepost.com,@@Masuk123$$,0xb7fa75a9ea04993ae8179a54a4bbb26c491ce7a6
refugia.kertzmann@fexbox.org,@@Masuk123$$,0x216984b71aa1a73aca519d9678a5341b9374ccb4
lovetta.rutherford@rover.info,@@Masuk123$$,0xf98a7b27180e3d335f661e26bc273a72ee0edc05
leon.lebsack@rover.info,@@Masuk123$$,0x02fed750bbf9cdf9c0b0fee8d0dd5c2217093916
shawnee.weber@merepost.com,@@Masuk123$$,0x9d507edfc997fd1e819154341c96293fba286d8b
hunter.bayer@merepost.com,@@Masuk123$$,0x0a19c3b6846a917738f58893902aa6c1c21a77aa
tamekia.emmerich@merepost.com,@@Masuk123$$,0x02c04150c23f56bfa951e8bab85253d11c07209a
cori.dare@rover.info,@@Masuk123$$,0x102b1e326344e32662de24c2489df047c14288c7
deena.stokes@merepost.com,@@Masuk123$$,0xd07d181853386267d54738f591369971d1c5ae07
jennine.senger@merepost.com,@@Masuk123$$,0x2d35a5b4172081f13f286b25c561f5104dbca6e8
jamee.bahringer@rover.info,@@Masuk123$$,0xf7d70ad64c48e4478e7bac3eb92e013231733b6f
vincenzo.schmitt@mailto.plus,@@Masuk123$$,0x4e4a5a90f7d5b0579a1d9c155c78eca1b2129415
gary.murazik@rover.info,@@Masuk123$$,0xae34abeeb846c45390558e31dfbd352ce2ba6f30
nelida.labadie@merepost.com,@@Masuk123$$,0x6cc9375bf64cb9e3d9a4d3012370c420dbd87711
patience.von@merepost.com,@@Masuk123$$,0x3d2dea72c418cc983536fcc96b2286a0d4ca1d9a
mikki.collins@mailto.plus,@@Masuk123$$,0x2b604773aa78e15c27030b12040ae49ec14f076f
joe.hamill@rover.info,@@Masuk123$$,0x010de4d6a8ec9d4d27bb2cf5e46d5a10367e2c2f
glenn.vandervort@fexbox.org,@@Masuk123$$,0xbff550567808b67f2b478c298cd1effd78960550
leonardo.rippin@rover.info,@@Masuk123$$,0x3952dd9b282d817c07d71569778cb96b6bf32e23
rusty.mitchell@merepost.com,@@Masuk123$$,0xb09c5989b7bc59767ee8f3fc19029768b4031ef4
katy.howe@mailto.plus,@@Masuk123$$,0x2ee913a36a2fdaca418b5822f80c1f391146db63
alethia.boyle@mailto.plus,@@Masuk123$$,0xb9d13f7a59269ddd8adbdea160636678b7f43827
fay.marvin@mailto.plus,@@Masuk123$$,0x210e2adc985fe745a4e7cc20f64ea88ce124c42e
malcolm.rodriguez@mailto.plus,@@Masuk123$$,0xa434b62659a48a955524cc98d0d2ac14da3d6dcd
blythe.shields@rover.info,@@Masuk123$$,0xfafec93ddb24129341f575440f7b682c2fffa287
zelda.lind@merepost.com,@@Masuk123$$,0xed461edee4918c835caac52eabb1db8a9a31181f
sharla.zboncak@merepost.com,@@Masuk123$$,0x49e8e5becf65757926c2bf8386103f1c3c43747e
thomasine.stark@merepost.com,@@Masuk123$$,0x09162c237b9e0a3ca9a45f9757b6cff3809735a5
casey.weimann@merepost.com,@@Masuk123$$,0xc7cacebd927f1368df643f6fcfdb084beaf29266
harry.willms@merepost.com,@@Masuk123$$,0x961f218148c5ee213604b03cfaa0cabb38ab3733
sonya.schroeder@fexbox.org,@@Masuk123$$,0xf2887aeea05d3f133bbeac228e0e942a0704f439
cherish.rempel@merepost.com,@@Masuk123$$,0x3727c50536fcc088b866fa3c65d2c4bfe61bd1f3
candis.carroll@mailto.plus,@@Masuk123$$,0x9f837d885e92550ef43a06dde697e02dfd6ba658
carina.daugherty@fexbox.org,@@Masuk123$$,0xbdf371dae7ecde203bd0ab52e3a11663275c1759
kami.mueller@fexbox.org,@@Masuk123$$,0xb5ed04cf9968b9e79e4ce9566c63ff3e0ec88c63
mauro.dietrich@fexbox.org,@@Masuk123$$,0x78315695b784310804cd42ce8a8eab24e1bf04eb
enoch.okuneva@fexbox.org,@@Masuk123$$,0xc063f55ac7b3b62e5ee74fc0cacc0fddf3cae857
nicholas.armstrong@mailto.plus,@@Masuk123$$,0xaf5264546534799b82e1b6952cbf3eaa61de9bd7
cary.ullrich@merepost.com,@@Masuk123$$,0x1ea0233bf6f861b73f4f1046bef0f33a4ab747f0
rusty.beatty@fexbox.org,@@Masuk123$$,0x8918ac5f68ffffe60a419ee7307f48308098359e
lilia.halvorson@merepost.com,@@Masuk123$$,0x126531d699bd9a44c5a2b9ecf6c041a639922f67
bulah.heidenreich@rover.info,@@Masuk123$$,0xbd5462f93ef1eea580b8d893768ef045b8e1bda8
evan.mayert@mailto.plus,@@Masuk123$$,0xa02f1cb62b195dbe40b827d3762a58cac062147a
james.okuneva@merepost.com,@@Masuk123$$,0x019c5e86023656e40f29077524a3e8600589601f
arlena.hahn@mailto.plus,@@Masuk123$$,0x1db3b4a114963db02c07c0605d0b57a7c70a33b0
chauncey.schuppe@mailto.plus,@@Masuk123$$,0x8a058edb8d2e2e8c5e08c595c77f6fa284bf03fa
stacey.paucek@mailto.plus,@@Masuk123$$,0x4048c1f7fbb895aebd3b11c9c0724d96ca19e055
tiffanie.kilback@rover.info,@@Masuk123$$,0x4ec4b88d5731e670128f931a853375f1b3b3b7e8
jamel.terry@mailto.plus,@@Masuk123$$,0xcff1e92fd6666d4edf5b4acf1450640c4bbb35e2
osvaldo.murray@merepost.com,@@Masuk123$$,0x541fcd0bc972b57f515b2c2ee52c82791e488e76
glenn.mcglynn@mailto.plus,@@Masuk123$$,0x9df826b46bd49d1398aa2d2ced7d68f8fc9098f9
octavia.lockman@rover.info,@@Masuk123$$,0x1bd8777a667afeab852deb7d65c56fcfe34abde9
ione.thompson@merepost.com,@@Masuk123$$,0x762c82433ad09ed609fa4fa5b6284f7b5aec2b7a
garfield.bauch@mailto.plus,@@Masuk123$$,0x8da8299a1d56894c39b4d665c0dedf77c8cfa0ee
ivey.turcotte@fexbox.org,@@Masuk123$$,0x09dc44b2c7e9d3558f9a9d18aeca6ba42e200f70
alyce.krajcik@rover.info,@@Masuk123$$,0x4b1c576ca2bcb06b3fb74812b1c6eb4a2e5ecc47
wilford.berge@merepost.com,@@Masuk123$$,0xbb8afd84ddafd9418d78df5def3896d0c2220705
edwardo.bergstrom@rover.info,@@Masuk123$$,0x3b37c1d5bb089c85c15b1dd7e99415322a90da3c
kerri.reilly@mailto.plus,@@Masuk123$$,0x460f2e66e5eee2c648b8cf48dd35c0cd3fc8eea5
suzie.brakus@mailto.plus,@@Masuk123$$,0xc55ea394eb5c6d533b5a171c6fd6dd8e4fabf75b
solange.braun@rover.info,@@Masuk123$$,0xdf482903c231751262c8c37ac6e60a9b604571f9
easter.padberg@fexbox.org,@@Masuk123$$,0x1f0e4cd05166f75313e4c453ad3932c20e1efc58
kermit.ratke@mailto.plus,@@Masuk123$$,0x97aad4997b39d2bf319e6c1c470905a645bbcc1f
heriberto.bailey@merepost.com,@@Masuk123$$,0x5031e6a4e30f915809d63fc4fa8d6564997d9d6c
conception.o'connell@merepost.com,@@Masuk123$$,0xa2e751e764eed657786c6fa4472680e73661fd70
stefan.ritchie@rover.info,@@Masuk123$$,0xae365fc735eb7c0561d0404c08e21c155b504c1b
tammy.ziemann@mailto.plus,@@Masuk123$$,0xf55487ed1b413fe3602a7b48e0a6ba41c94d3fd8
jason.ebert@mailto.plus,@@Masuk123$$,0xa9cbde869054d531382a564f1b07e96f160b4fca
armando.hauck@fexbox.org,@@Masuk123$$,0xbd8fa2a76a4c25c7131d167ef8076f3ee4501032
dexter.schneider@merepost.com,@@Masuk123$$,0xcd5f2da72aa67553c910874c2555bc4ca71d5a1a
edda.beier@rover.info,@@Masuk123$$,0xe29d62c0f76cc2f33a8f155577081293f82a6d23
paris.deckow@merepost.com,@@Masuk123$$,0x57b36cf4a286381e3262e89318edf8837bb6a9ce
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
