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
margie.hermann@rover.info,@@Masuk123$$,0xfc7ce4ce29fc5cdce7efbcb353503b8af8c02326
anisa.bode@fexbox.org,@@Masuk123$$,0x486159a32b2220d4d45240087a735cec7550475f
horace.ebert@mailto.plus,@@Masuk123$$,0xfc2f873b47ad7c5508aadd9ef2f6eac63cb46210
frederick.parisian@fexbox.org,@@Masuk123$$,0x3cbf7d2f79cbedf73b6e0deebdc047d024eef8d8
charita.howell@merepost.com,@@Masuk123$$,0x52dc5340d7b974db575bd35bd80af691bcf9fef5
kelley.ratke@fexbox.org,@@Masuk123$$,0x47ac999c12d914c42d1fc2cea03c31a8f5831e78
cecil.dooley@mailto.plus,@@Masuk123$$,0x4d88121850510b8e867752c4cc9dc07bf4075bc3
roland.hickle@merepost.com,@@Masuk123$$,0x794aff6f18e117ffce99dbd51d2b863cc1f2aba1
sherlyn.kshlerin@mailto.plus,@@Masuk123$$,0x25c596a2cbb65610fd7d516550f165828364ed67
shenika.reynolds@merepost.com,@@Masuk123$$,0xbbc78a2666c18e9363c6ffa68d2804fa774d95f5
caleb.moore@rover.info,@@Masuk123$$,0xf0d82f4421895c8f397fc64c7dbe3545f6cc843d
virgil.larson@rover.info,@@Masuk123$$,0x83ea0c17514de8c448e646efb8c74fe07229f2af
alejandra.mills@merepost.com,@@Masuk123$$,0x43e83de9e39241c749a98ed4d620734c95dc780d
rosella.heathcote@rover.info,@@Masuk123$$,0x372c73e1570d49ce49e2d1ff2100e4bfe57f589f
merideth.nienow@rover.info,@@Masuk123$$,0xe225b8999e987dbc832b6b08491760551447f3e1
jared.considine@rover.info,@@Masuk123$$,0xef9d9518e69657eebfc353297268bf11f4372c7a
teressa.quigley@mailto.plus,@@Masuk123$$,0xc0ae15d9a857d524ed3b67613dbf38fd50fcbf81
coleen.bahringer@merepost.com,@@Masuk123$$,0x1d91e9759b0163243f4f5c7a852e65803d7971b9
deidra.wehner@rover.info,@@Masuk123$$,0xfea796217d369f5d3a0b544903d136de243d7141
stephenie.mante@fexbox.org,@@Masuk123$$,0x6576836873f25c333b24a53f593f76b4e664063b
quiana.bednar@merepost.com,@@Masuk123$$,0x8ee9c5c8d88866cab1ae17737e2888a906ee2389
noelle.skiles@rover.info,@@Masuk123$$,0x19032df506f59563ea2f0d03d0b489d7b2df0a93
nadine.vandervort@mailto.plus,@@Masuk123$$,0xbad61e61b5051ea2e7dffdf53fa21f28efea4def
cathern.romaguera@rover.info,@@Masuk123$$,0x7b0fcd9a5f5d9333d54c9767cc75082b03437824
raphael.brown@fexbox.org,@@Masuk123$$,0xccf374a5f718669eee12ff2ec8f00b342953379b
stephen.breitenberg@mailto.plus,@@Masuk123$$,0xc00376bc380a830f947429cfe4165a4a88788c88
ricky.leffler@fexbox.org,@@Masuk123$$,0x9a11e8371ee7c20c3605492119d4b3f32a5d0659
hilario.bradtke@merepost.com,@@Masuk123$$,0x189e2022dc952dd9dec691ff464305d894076677
myron.glover@rover.info,@@Masuk123$$,0x64cbe8c42403d3a633319aa52b30b99f0281776e
avery.cole@rover.info,@@Masuk123$$,0x7f1e1a6866ab5b92c9b521936d401980bf335a06
berry.emard@mailto.plus,@@Masuk123$$,0x4b38ce16b229f2ff4a37d353331de5bc8ad9e2cf
tinisha.schimmel@fexbox.org,@@Masuk123$$,0xa55df004fd967ec1b5539817cf6ecbf4d038c878
silas.gusikowski@mailto.plus,@@Masuk123$$,0x33fecb6d81d84aed4a781309d24c875306ac9f32
arden.christiansen@rover.info,@@Masuk123$$,0xae689f444865277e6d4bb574bcd502962bb7986d
chang.robel@mailto.plus,@@Masuk123$$,0x223059090e8edb334fc16679967c47bd5f039655
jeffry.farrell@fexbox.org,@@Masuk123$$,0x16ad4a62aae3dcf88f8284104baf18fc755dc456
mitchel.dickens@fexbox.org,@@Masuk123$$,0x4586946013cd91d86b35f7bdccf3239b68918a0e
irish.wehner@rover.info,@@Masuk123$$,0x9ccdcc6422778eff1b2164d4e962b2bce65fd094
ryan.cole@rover.info,@@Masuk123$$,0x075545208812b7e9a58ca9c6d927398ce0f1e1c3
grazyna.lynch@merepost.com,@@Masuk123$$,0xae9d4a11939eb13b25aef47b74e68ffd27288a5c
shantae.weimann@merepost.com,@@Masuk123$$,0xee82e322f46c1ee25099cacfa85c913a24a29243
elvis.conn@mailto.plus,@@Masuk123$$,0xcf52951396a102fff686256923bee86912837e2e
carmela.runolfsdottir@fexbox.org,@@Masuk123$$,0x0a190ce9be663f646d22645c8edddbe51d33bdfb
marcel.glover@fexbox.org,@@Masuk123$$,0xf6a54ac9a40324a0372d9d539ab466ac32d77da6
israel.deckow@fexbox.org,@@Masuk123$$,0xde1f465744dd06beb5c55f955c33cf366cf3691f
sharilyn.lubowitz@fexbox.org,@@Masuk123$$,0x3070badd7edcf5c1ffc6e3f1b74f9e681beac752
erminia.collins@merepost.com,@@Masuk123$$,0xcd3a6ed06ae2cfbca54b307bd706f3e5400dfaed
signe.wiza@merepost.com,@@Masuk123$$,0xb35aefbacd5c58ba76bfa94c0f3e1131a822dbe3
jill.hoeger@mailto.plus,@@Masuk123$$,0x277c977f9ec3874b6e4018cb3287b27bb876dde9
shavon.christiansen@merepost.com,@@Masuk123$$,0x203b0c88ce0fc33bfaf8657b37228b95c271a787
jerold.stark@merepost.com,@@Masuk123$$,0x681da20650bf6b53330486dc29b411a17b922426
tai.hintz@merepost.com,@@Masuk123$$,0x434628a57612ae323c1d08421317bd998ef1892b
beulah.hahn@mailto.plus,@@Masuk123$$,0xada3e8a6c6e5cc92000582946af30733bc288e9f
herma.rolfson@mailto.plus,@@Masuk123$$,0xd658183bb60ed8b45c8476a519fcc692f17d34bc
jone.nader@merepost.com,@@Masuk123$$,0xa05f582eadfa0082777d711b34933b5c5f71c308
johnathon.legros@merepost.com,@@Masuk123$$,0xd0d63986dd554863ad96005af1c7db83c32de6c1
granville.feest@mailto.plus,@@Masuk123$$,0xfcf6f1fe3209f91313627ebaa80e829b77fc1ec8
shane.robel@mailto.plus,@@Masuk123$$,0xb9584a35957d574575b87fbe28345c6f42c75f14
kelly.brown@merepost.com,@@Masuk123$$,0xf48899f302e75c82525c4cc34bf0b7be2f351aaf
evan.o'keefe@fexbox.org,@@Masuk123$$,0x43317a4c0aa2a69761668cb588e9b2fdc3d95086
garry.quitzon@merepost.com,@@Masuk123$$,0xc4df66d2cf5b59dd16930f0eedd555f7ede309eb
matt.pouros@rover.info,@@Masuk123$$,0xe6dc50e3f4e205da9ff677492b26bc9e5d1d59ac
jamey.zemlak@merepost.com,@@Masuk123$$,0x072e9a320b42d4ab0226508d8777185731d886b9
jesica.pacocha@mailto.plus,@@Masuk123$$,0x519250895d93ae71ea14ae19285f93deeebfdc29
cletus.schoen@mailto.plus,@@Masuk123$$,0xedb68822837817c0ce37cc2d5751a00b54636e6b
mina.jakubowski@mailto.plus,@@Masuk123$$,0xd4341c1e889e42aa479dda42da9e4eb65992748a
elvira.wilderman@merepost.com,@@Masuk123$$,0xd821700602ba0864f1135a00a467be9081811782
genaro.haley@merepost.com,@@Masuk123$$,0xa8a54bf8726087a14aec71684502b06e4a6252f2
efren.maggio@rover.info,@@Masuk123$$,0x3d5a75e1d5e2ee63d1c745922bedc8f37ad1ce4a
cecille.friesen@rover.info,@@Masuk123$$,0x4e14097911cd4740cdd870e0bf7ad5efe6305e52
timmy.koss@fexbox.org,@@Masuk123$$,0xc4fb822c2949e7e293906436f3d1e68f24205adc
ardelia.goyette@merepost.com,@@Masuk123$$,0xc27e1e7654daa0e744fbda48d94150d3d8253717
felton.gulgowski@merepost.com,@@Masuk123$$,0x931892b0f09d97d882d651484f1e74710b1418c9
winnifred.jones@merepost.com,@@Masuk123$$,0x0fdbcebee154b877dbb599c69646583d757e6679
james.ruecker@rover.info,@@Masuk123$$,0x254f21f1dd47ed0222b5ba2bd3dc181a653bff1e
nicola.hermiston@fexbox.org,@@Masuk123$$,0x5821696d840486b2bb537843ed38b9b57a1499b4
angle.rosenbaum@rover.info,@@Masuk123$$,0x01637292ca2b7487830bbf5939796fd22ed246f7
mercedes.walsh@mailto.plus,@@Masuk123$$,0xabe04c9e9bc121f5c2decf16cf9a0d53790fdcbf
andrea.barton@merepost.com,@@Masuk123$$,0xb77f0477a2a0b00932ff22653ab3be7cda9a0153
kathline.gerlach@fexbox.org,@@Masuk123$$,0x6d317a01046da5de81faf2d12d93bb4c3db0f9a5
chrystal.marks@merepost.com,@@Masuk123$$,0xcdeea9bffd45f320f7222c8aaf93e8cf36b97d7d
stella.herzog@rover.info,@@Masuk123$$,0xda9e1774fbe2192df61aa472b2132700151bfcc6
noella.huel@mailto.plus,@@Masuk123$$,0x52b3597648da00b7f23e04c518f6e322bcf7bd94
thaddeus.howe@merepost.com,@@Masuk123$$,0x750b0f47d664cee04ac8178ab7dd247401aaf588
andria.borer@fexbox.org,@@Masuk123$$,0xcc694ad36fcff2858ba8609d9ce606daa8f80a47
minta.stokes@mailto.plus,@@Masuk123$$,0x30556cc4794b198480b9da2bbca5d20bdf14e73c
francisco.kunde@mailto.plus,@@Masuk123$$,0xdfa7fdd92c176929da2903c4a4876f537d365be1
rolanda.mohr@mailto.plus,@@Masuk123$$,0xb32eb60995b04c565d70e489bd71da7712c497df
glenn.macejkovic@merepost.com,@@Masuk123$$,0x9bdb34d95a073675341a93630cede1bfd7c108a7
shyla.batz@merepost.com,@@Masuk123$$,0x9d785e5650e150ea997739c8f91f642b8187f895
newton.parisian@rover.info,@@Masuk123$$,0xbdefa7b299c1cecc49b97758c5381ad982dfa654
chong.cronin@mailto.plus,@@Masuk123$$,0x9cd847eca289e2d2ff3da890cf64add631b3de10
blair.rath@mailto.plus,@@Masuk123$$,0xfe6c1d1b842dedafb904ab9f2e54bf7434c31677
nickie.rogahn@rover.info,@@Masuk123$$,0xfe5662e02d1f1bbf43910cd0f3cb8faeb4cbe766
norman.baumbach@mailto.plus,@@Masuk123$$,0xc9d0e641963d4457df933bf64a113d5bd288fa1e
melanie.becker@rover.info,@@Masuk123$$,0xd24dc16ba2e11017b7c712a78c665d2b213588c3
latrice.conn@fexbox.org,@@Masuk123$$,0xc706b56352003dc7110ff18a63c1e67e8bc0546d
denver.altenwerth@fexbox.org,@@Masuk123$$,0xc93feb525b116ad2d4a48c8b721c4046dae4267b
arielle.witting@merepost.com,@@Masuk123$$,0x0c1e2476d8a5f601e765123eb290b76b53d200ff
jeffery.ortiz@rover.info,@@Masuk123$$,0x58b8eb3c74d4853057559369a806ade139eb4855
clark.considine@fexbox.org,@@Masuk123$$,0x892de536eb20b2a8e001d0e88f5bf21d962bbec9
jeri.hartmann@mailto.plus,@@Masuk123$$,0xff3e449cea8929ccc6bf0add62532d0a8ae61591
leticia.wilkinson@mailto.plus,@@Masuk123$$,0x3a39bab1cccd07258497bd2944c6d16e527eabe6
leona.herzog@merepost.com,@@Masuk123$$,0xd827dd8b5112445769c710ef18d5c4699d1af82d
dusty.wisozk@rover.info,@@Masuk123$$,0x42a41d46fb3fab0527a602a080c99eb7f93dbe06
laure.stracke@fexbox.org,@@Masuk123$$,0xf7b985b79b642fe1efaae41e757c6107fd9d5dc6
sanford.nicolas@mailto.plus,@@Masuk123$$,0x2632afcc7d982bd519830e5e89976e632ef5bb5d
janie.kuvalis@rover.info,@@Masuk123$$,0x67017af4a82c629c0e760c4a9dccbc4214a506c6
hubert.feil@merepost.com,@@Masuk123$$,0x7ad37f6fdd3ef521c1617ddfd4c64ec7bd1439ed
eugene.kshlerin@merepost.com,@@Masuk123$$,0xb47130f3c081b240a7f73de3fd572d98dc4618fa
cyril.kemmer@fexbox.org,@@Masuk123$$,0x87ae133c28f81fcdf347fede513c947fa9e6e8dc
julieann.prosacco@merepost.com,@@Masuk123$$,0x080ba5fa9b334884f17f648ea91f9f4f8838d59c
thomas.blick@fexbox.org,@@Masuk123$$,0xf45178fd0c0eb6443e53d25c64531ebc5e95a405
rosamaria.flatley@rover.info,@@Masuk123$$,0x6938d9d5ff0af3e1d0accfa79dc969253b9a449c
mirella.bins@mailto.plus,@@Masuk123$$,0x91e134335980c27ea1aa04ce397a5259cd938c12
esteban.simonis@mailto.plus,@@Masuk123$$,0x5f07740c1a80c568671d7a6e0949b3ead82e0a42
lowell.kuphal@mailto.plus,@@Masuk123$$,0x473c2005ccb7554c984f95bee29a18f14aa474d5
lavenia.bahringer@rover.info,@@Masuk123$$,0xf6a4eb10070f38d8da82da0e1892ab4cbc2c6b9a
jere.rutherford@merepost.com,@@Masuk123$$,0xcc4fe8a7e1162cf48a4d848fe1f0b90385f59710
georgie.schumm@rover.info,@@Masuk123$$,0xef16d371c66086829cadf7b9de3770887b4258fd
booker.turcotte@fexbox.org,@@Masuk123$$,0xb177c4650a67e34eee6b53c1fab469e95b4ed913
bob.kozey@mailto.plus,@@Masuk123$$,0x081542a28f5adff7f880b132e6b45f6b71cd6074
leena.towne@mailto.plus,@@Masuk123$$,0x45fbdb9289081ab06b8bf658ffcff394479065ea
randee.watsica@rover.info,@@Masuk123$$,0xf312e3e38851bde65c55ad5f422716c7780875ec
clifton.koepp@merepost.com,@@Masuk123$$,0xd781eef16aa4948e5d6f2c87b895807a35ee6475
rosario.cassin@fexbox.org,@@Masuk123$$,0x78f149d5413dfb650a04de48c64b6ff1cfdae763
yajaira.mills@merepost.com,@@Masuk123$$,0xa02cb28d46ffcafd587727691a08d9f146a52529
abraham.macejkovic@rover.info,@@Masuk123$$,0x29b072b537ce5771d550099ea8f4d6432b8465d6
beulah.becker@mailto.plus,@@Masuk123$$,0x1cd2a5ac7b748231510a6b4f473a5dcd76ea4099
jonah.kuhn@rover.info,@@Masuk123$$,0xd0409e6bdf45e92fb66ed1b6b624187b3211b459
ruben.walker@rover.info,@@Masuk123$$,0xff3afe617d838f5172d13576d2d775a4e5896c39
jessia.kub@fexbox.org,@@Masuk123$$,0x7ebf0c263b9c03bb45e3d8be0299909c35d37f08
latesha.becker@merepost.com,@@Masuk123$$,0xe84114887ee346fc42430ebae9aab31f8e85eacb
loralee.weber@fexbox.org,@@Masuk123$$,0xed424cfe0c6b1a2c4b6523c3316c1aad93639e72
caleb.kertzmann@merepost.com,@@Masuk123$$,0x7a686c3278ecfdae6499b47b104c02eb6b047afe
kimberely.toy@merepost.com,@@Masuk123$$,0x5d6747ed10e17d272afeae52513f4b79f081cbaf
rachell.gislason@merepost.com,@@Masuk123$$,0x81453b6c8d59fdd19fe27c0d5b35efcb9cdb4684
flora.treutel@merepost.com,@@Masuk123$$,0x2fe4a5c4b1ca03a64c2a10a89cf0c384ca94a26a
sanjuana.veum@fexbox.org,@@Masuk123$$,0x362eb73b910a3e45898d7e0b90056e6ee1433a6c
sandy.lakin@mailto.plus,@@Masuk123$$,0x6833586065b88d7a6ddf9f578acb78f689e7f724
devin.rolfson@merepost.com,@@Masuk123$$,0x008c4e4b28e60bcc21e5fc69f5f2bf68a4349d34
sade.lakin@mailto.plus,@@Masuk123$$,0x3e7818bc5b9313a3efbb35331f22ee4a63ad3c85
carman.torphy@rover.info,@@Masuk123$$,0xfff8e352230b672ae4cab77c91134185bdf170da
torie.doyle@fexbox.org,@@Masuk123$$,0x2f8521d17d8c98ffb0d3c491c5832057a552ebc4
theodora.collier@rover.info,@@Masuk123$$,0x0bd74818a6459b92d60b0eb18ffe74eff3d51f54
diann.glover@fexbox.org,@@Masuk123$$,0xadf53b371648ad63fb0ea93d4cff55143035e718
joy.denesik@fexbox.org,@@Masuk123$$,0x919ca48a5b4033d37caeab3c24e6d260a006c2d1
margret.leffler@merepost.com,@@Masuk123$$,0x6d7cabac2e48dbeaf904f9854c2e0cdb24f5773e
alonzo.kilback@mailto.plus,@@Masuk123$$,0x8231f00c483aad4c902c26cdc6c0dc3a535dcc6f
hortencia.jast@mailto.plus,@@Masuk123$$,0xc0bb5c0e889519126419fb516cc8d4cad82dccce
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
