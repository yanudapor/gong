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
brendan.streich@merepost.com,@@Masuk123$$,0x474cf5c85c479697f6f96c68bcfce2a71bb01b84
le.hudson@mailto.plus,@@Masuk123$$,0x1ce5e9dd3d3dc7fe3f6d97f15cbdec1b858004cb
elza.gutkowski@mailto.plus,@@Masuk123$$,0xa24bcc9256af06dbcde5d6e053a1663a655564be
malka.hilll@mailto.plus,@@Masuk123$$,0xde12c38376aea182051164d4d4a86d30ce19cd36
sam.bahringer@merepost.com,@@Masuk123$$,0x531591ec71052909534809fff75176b4c75c8b93
crysta.wisoky@fexbox.org,@@Masuk123$$,0xc18a69477bb117064b75985887173d782fc2a18c
lakita.bernhard@rover.info,@@Masuk123$$,0xe80d88100ec76b38c13c3b48ce8ea696dc6ea0d9
rocky.mcglynn@rover.info,@@Masuk123$$,0xcc271229f0263009b0cb33917f92c383b9b02c4c
rashad.klein@fexbox.org,@@Masuk123$$,0xb3a34ca24fd8e838f0a68e5bca0c4c360bb073f6
danille.johns@fexbox.org,@@Masuk123$$,0xda4d5f5ee5f4cd6994b801113cab7781a8f1025f
austin.davis@merepost.com,@@Masuk123$$,0xb5d39d41e243513250203c78f4fa8a5f1bffeb5f
denise.macgyver@fexbox.org,@@Masuk123$$,0x0615f5c6bc2424f57b47472019fefded1de0b308
nova.bode@merepost.com,@@Masuk123$$,0x9139ae3da46b1eb9b473cadf1b222d086dfd635c
damon.daniel@merepost.com,@@Masuk123$$,0xc2954b9455d7a4b25c23eca76504b4224c651f2c
roosevelt.fadel@rover.info,@@Masuk123$$,0xba23ebfe0006773c3cf53fcbb4c0651b5679ebbb
carl.daugherty@mailto.plus,@@Masuk123$$,0xd70b74d039901f09fa48eb52ae52e25bb017bfc0
leonora.dickinson@merepost.com,@@Masuk123$$,0xc3906115e5c96cb8723849a2e156711ef5292008
lucy.homenick@merepost.com,@@Masuk123$$,0xe1832eb0176c1327a615bc95ca88d52c6e4d0495
wiley.ondricka@fexbox.org,@@Masuk123$$,0xd6734a406b506c46a784e210573d6ec30fc37df7
candelaria.ortiz@merepost.com,@@Masuk123$$,0x6f8f2664f6f8d85fd27da0cd9aeb73a4c97fe71b
lianne.stamm@mailto.plus,@@Masuk123$$,0xab9a2a07a365930c12e91a19c2c3abb25ab4a0d7
bernadine.rolfson@mailto.plus,@@Masuk123$$,0x05f5a81dfa6149793d4ffe3a8c2bec933236c664
karl.miller@mailto.plus,@@Masuk123$$,0x930fb6a37fead4499ea31f3bb8c9848bb5c151bd
khalilah.purdy@fexbox.org,@@Masuk123$$,0x9fda6f8cd756bbac9f757c514ca6f6427cc92f44
desmond.olson@fexbox.org,@@Masuk123$$,0x9fa5c61498badb8822d010761840f00569f086c2
gerardo.stroman@mailto.plus,@@Masuk123$$,0x91675d9a00758ca23ee164a698b489983edeb3d6
corrine.mayert@fexbox.org,@@Masuk123$$,0xc3d4c301709b695b604531c87e37c7124800997c
una.welch@mailto.plus,@@Masuk123$$,0x0a7505d6f2d8ac0e5c6344bee10f3b3cfeacdd12
darcey.lynch@rover.info,@@Masuk123$$,0x69524589f24773223d1b0d9ed4fdce0df0cabec3
valeria.fadel@merepost.com,@@Masuk123$$,0x34f95613b52223b2a14a21ec9fa2e26d5df56096
percy.stehr@mailto.plus,@@Masuk123$$,0x068aa52cb81193e208a45349c682f8cece6501a4
marcelo.lueilwitz@rover.info,@@Masuk123$$,0xc629d71587a6ec2f7a908e931fe9f2c19355e870
bryce.rippin@merepost.com,@@Masuk123$$,0xe673b94e5a18334702ab9ec8175f5ab7c8f77488
zane.maggio@rover.info,@@Masuk123$$,0x22cd16a11be73dbc3d211d10ddc183d148f2eb09
francina.will@rover.info,@@Masuk123$$,0xe13ade401c28957bf0589b541379863c1814ba95
marisa.hartmann@rover.info,@@Masuk123$$,0x8979042c050477d527fca858c89f82d3f98f06ff
isiah.ullrich@rover.info,@@Masuk123$$,0x3f65cf4392883ce12a3de43316bb85de38dcbe30
eduardo.ledner@fexbox.org,@@Masuk123$$,0xf8a2d5d52ba13bd636f0939cd21d8804df1c4b37
rowena.moore@mailto.plus,@@Masuk123$$,0x2d816e7457818ece1cfb057151914ce4d155cf82
aisha.smith@fexbox.org,@@Masuk123$$,0xc095f84fad997294d1096fb20458cc7a5dad127a
frankie.bayer@merepost.com,@@Masuk123$$,0x682f53d2da2bb9b79483025c4a7fb6135a8617be
lida.schmitt@rover.info,@@Masuk123$$,0xb3a7d86c522f26db3935f01c2df22bfa29c45568
frances.ullrich@mailto.plus,@@Masuk123$$,0xba500835ae83076cd8f4c8c62c4cb54dafc5fdaa
austin.yundt@merepost.com,@@Masuk123$$,0x79fc40fd972ea3d21e8d3e759d65556ba75c4c57
jill.gutkowski@merepost.com,@@Masuk123$$,0x64b6432c154dd4e406c0978efe8731fa6382dd03
elizebeth.o'connell@rover.info,@@Masuk123$$,0x39e73236f03e79dae9798831a8fe77d88e9e7525
keneth.gleason@mailto.plus,@@Masuk123$$,0x2fe8c3198be148640bc6748be2928f803e207dfc
brandon.turner@merepost.com,@@Masuk123$$,0xa0f3be8ea8ece4aa4993766de406a0ff68a29385
grover.bashirian@mailto.plus,@@Masuk123$$,0xec1b1779223c668f3621a909cef18305173a592d
connie.barrows@rover.info,@@Masuk123$$,0x256334ab8c8868a4ad257fb104838dd641361077
dale.reichert@merepost.com,@@Masuk123$$,0xd7e58136c944ed19b5f977f93c1fc954a8643c82
asa.rutherford@mailto.plus,@@Masuk123$$,0xcda510ab44a05688a42139067e6a305089cc2755
huey.carter@merepost.com,@@Masuk123$$,0x57a7e5698e559c821705a671de03fa2dddcd172b
tanner.koss@fexbox.org,@@Masuk123$$,0x0fabe130ca1a9a4c6a4b816db0957fb99581b903
stephen.corkery@merepost.com,@@Masuk123$$,0x2e3729556fa2dc359571eddc950b71caec126933
collette.gorczany@rover.info,@@Masuk123$$,0xa6920135a95593904f70f3d9741027c7cd8227a8
patrick.schmidt@merepost.com,@@Masuk123$$,0xf631bc7d4f2084d24e632a696c2bfee428bedb78
lynn.stroman@merepost.com,@@Masuk123$$,0xf7d74f4b862e9d4406b7121572d6eca8c31f2a3f
palma.satterfield@mailto.plus,@@Masuk123$$,0x5b155d7f6ded8b84de7c48a57fd347fd481b4bcd
selma.klocko@rover.info,@@Masuk123$$,0x6848b7fb90b132c02bdb58d87b30ebe53c9fe85b
bertram.mclaughlin@mailto.plus,@@Masuk123$$,0x26444011ca7673b6db1ca0bfd6f7d99cf48c8ba7
carmelita.stroman@merepost.com,@@Masuk123$$,0xcd1fe57cb3c2937a1e51a7827da179f6cbbc2b7f
norman.hudson@mailto.plus,@@Masuk123$$,0x6b4379b0d3b6c89fd9803fe6007220fc4a47974f
edgar.cronin@merepost.com,@@Masuk123$$,0x5545e111851ac130ed2b3c1c59aa55fd7e1e7f2d
maia.krajcik@mailto.plus,@@Masuk123$$,0xd365640aec3f84eb4a5762c1df118f250d948112
nikole.vandervort@rover.info,@@Masuk123$$,0x7dbaa2265cc5794c322e8d75aeaab40d56d4cba4
cristobal.lind@merepost.com,@@Masuk123$$,0x8d41b588e85aefd2cca50d4d9c85bf96c2c01fa1
reynaldo.jones@rover.info,@@Masuk123$$,0xa1277c3dd36e04a2a8e3afd4bf5be1dc243ea74f
aubrey.schulist@rover.info,@@Masuk123$$,0x41b89ef5153185e68a83752ddf02f06fdb705f47
mignon.bogan@rover.info,@@Masuk123$$,0x036e1a4b4cf5837bd81bec3a3c0ce980757fc7aa
tambra.gusikowski@fexbox.org,@@Masuk123$$,0x0671a3a426dc042dffe511614185832548e57a95
lael.ziemann@fexbox.org,@@Masuk123$$,0x360e06da81dc8ad42b688c7fbfb188f5f944168a
erwin.buckridge@mailto.plus,@@Masuk123$$,0x62e0e417b8f390ad078ebbcefa673bc57cc17801
monserrate.crist@fexbox.org,@@Masuk123$$,0x02668f9f2ab5f10019e3b93d24694afa7b30349f
epifania.schmidt@fexbox.org,@@Masuk123$$,0x56ef05b97956a38c0129bfb72c7c7eb5042f6ca3
orval.becker@mailto.plus,@@Masuk123$$,0x4f0d1433dace333bff514c82c5ab78aa243ec949
lester.bernier@mailto.plus,@@Masuk123$$,0x80a55d8aeaf914d04184fb4685afd723bd42aaa6
nery.runolfsdottir@rover.info,@@Masuk123$$,0xe5c25b214305091acad8393ac2c2221f26722e50
avery.kerluke@mailto.plus,@@Masuk123$$,0x9351f076f4416f346dbdab59bf7e77ec372c9603
jordon.roob@mailto.plus,@@Masuk123$$,0x7bfc45060c11cabce3328dfd2bebf0957135a230
evan.christiansen@fexbox.org,@@Masuk123$$,0x93b107924781c6cee5f0c0a9f19913215111f991
quinn.ledner@fexbox.org,@@Masuk123$$,0x278461cf5529f112da18f031dcc62ade3e2c4442
velma.schaden@merepost.com,@@Masuk123$$,0x3602ec73fd9f1d0f71493e32c89684b4d3d61126
kendall.ebert@fexbox.org,@@Masuk123$$,0xf193b4521e547e3373bfca778e66674e4d746227
charlette.champlin@rover.info,@@Masuk123$$,0x654d601d8416c34893b82f6588fa5e08e1db0d34
celeste.stanton@merepost.com,@@Masuk123$$,0x6188817e8d3f58da033964c90fbbb9052434dacf
lourdes.feil@mailto.plus,@@Masuk123$$,0x6740ba953e96c3637cfc88a38d8300a0e9ebc3da
billie.mcglynn@mailto.plus,@@Masuk123$$,0x2b1e062254211198aef1726b85bc79f5e114c9d5
francis.kulas@fexbox.org,@@Masuk123$$,0xb066a858355565667cff6a3be96fdf3567754e39
domenic.howell@rover.info,@@Masuk123$$,0xd63a14662942913c591a276c50b1bb6f95c1cd88
laurinda.kub@mailto.plus,@@Masuk123$$,0x8ca62da1f9776eef48ca2966bd2a73247bf10fd8
lincoln.leannon@merepost.com,@@Masuk123$$,0xca9dc3f51dd4cd7f6369d95efd64b791dd3a437d
shad.lebsack@mailto.plus,@@Masuk123$$,0x2b6cc1bc78314d4509349c1449566e5ea124b44b
lindsey.bogan@merepost.com,@@Masuk123$$,0x4e47096f32f4018432acac53c2b088006cc24158
tennille.balistreri@rover.info,@@Masuk123$$,0xaba75550f445286ce32982904b2c5be94f6a943e
willis.kozey@merepost.com,@@Masuk123$$,0x1e4556a9e52ee4a128086f032b749cb39b693851
byron.nader@rover.info,@@Masuk123$$,0xc1eec4289e89f331df6d89e1b83896a5a573fb17
angla.bernier@rover.info,@@Masuk123$$,0x2c29d6c4b66b1fbccf93cbf7367ccbac33b3dbd6
taunya.durgan@mailto.plus,@@Masuk123$$,0x5e020f66bb7309e188dddef0dd11c13e077111bd
kyung.breitenberg@fexbox.org,@@Masuk123$$,0x36de3687bd35753c48d4809950b53482c6c9d422
victorina.waelchi@fexbox.org,@@Masuk123$$,0x76add63b992fd6fec5374fbcc458b787cce327c8
myron.walsh@rover.info,@@Masuk123$$,0x8074a62eaff9363979905998bae7ceec38a52fc2
luciano.quitzon@mailto.plus,@@Masuk123$$,0x75dbdd2a3d2acf28707694771fc0635183fb6aa3
lance.pollich@rover.info,@@Masuk123$$,0x56070bd365449097b627744ce207559a87c42282
carson.borer@mailto.plus,@@Masuk123$$,0x0f0fb041f3fd071b7ec55fa4b83678aa9a880785
seema.batz@fexbox.org,@@Masuk123$$,0xf3547bef846c8d9bae065dffd0c66232ea627a3b
tad.flatley@mailto.plus,@@Masuk123$$,0x0cbc2792870d73f6be9a8634dceb7d0c8798ce15
delcie.mcclure@rover.info,@@Masuk123$$,0x25511853279fd379578136b2ce4e4a3a08a64c92
theo.feeney@mailto.plus,@@Masuk123$$,0xf4b1a4fff7622f03fdce71ceb688fc19d70eea97
numbers.wintheiser@fexbox.org,@@Masuk123$$,0x2b1bc9071fe7e6cf83a64e789d04c96a8d5fd8b1
corliss.mitchell@fexbox.org,@@Masuk123$$,0x665396772b9f4d877d651499618a8aa5bb4ceeee
silva.vandervort@fexbox.org,@@Masuk123$$,0xcab6c3623b0d4c6b570c66bd6fb6549c2d8e3311
asha.mosciski@rover.info,@@Masuk123$$,0x20af7a8a3002c31bf46a65020cfbe3dc9385bf4d
diane.lowe@fexbox.org,@@Masuk123$$,0xe0aef9ae45d291ba9afcee1d925dde25c6e62de7
jason.abbott@mailto.plus,@@Masuk123$$,0x9d0734537c56bc9c71c2e46c67666a2f78d5a070
dillon.terry@mailto.plus,@@Masuk123$$,0xe48b393ec773c0066175761ed235a4d00faf0c70
jamison.murray@fexbox.org,@@Masuk123$$,0xb040cc162a6d581f7c4ff7d32f7760841306e995
leonel.hettinger@mailto.plus,@@Masuk123$$,0x2c9567b1895d0b24d5eb6f061f910f314fe7196b
kirby.miller@fexbox.org,@@Masuk123$$,0x43446de2d632b94d94713a1b6fea8deffda1bc1f
nathan.effertz@merepost.com,@@Masuk123$$,0x1c7d1725acca01d28b05dba12a7c55f05b0f86f6
mardell.ullrich@rover.info,@@Masuk123$$,0x522f63be97a949bf057abd71781dfeebc85b660b
malvina.gerhold@mailto.plus,@@Masuk123$$,0x91684c1b54caa9c39fe19f6cbabc56ff9f2cc9bd
dia.casper@mailto.plus,@@Masuk123$$,0x4d4260b5ebd16cd638d3fe3bbab97bb0e9452d9c
reynaldo.schumm@rover.info,@@Masuk123$$,0x38b75c586d1a92f40b36ddcd4b1cef59dc623092
sam.dickens@mailto.plus,@@Masuk123$$,0x2fc94c24542a29be005118bc54df124f6d25db0a
sarai.schiller@rover.info,@@Masuk123$$,0x4c045ba0b086f4db378f0b3b9e9a214c67b32215
eda.schinner@rover.info,@@Masuk123$$,0xd1478dfd951188ff49ba66d65c72ff773dc478e0
wilfredo.romaguera@fexbox.org,@@Masuk123$$,0xfc5c39e98fbfac62c5d6846eeeeedf63317760b8
wesley.blanda@merepost.com,@@Masuk123$$,0xc1025ddb9f6ccfa0dffa51858919af112b7fa492
trena.stroman@merepost.com,@@Masuk123$$,0xf38ca258026cebe9547de68abb9b98ca45c7e574
georgianna.schimmel@merepost.com,@@Masuk123$$,0x5ddf174c481f27474c5c5ddd6471c95d974fc9d6
marline.ward@rover.info,@@Masuk123$$,0x556dce20a3deb6a111a91aa063b2b6e1bb08fc3d
noelle.schulist@fexbox.org,@@Masuk123$$,0x5d99b8341fb85cb90ef6eb5be29241a1fb0e8771
ozella.tillman@merepost.com,@@Masuk123$$,0xb1512d5f7e832b0abb08dda8e3aacfef9bd02201
arnulfo.walter@mailto.plus,@@Masuk123$$,0x20fe00e57f40f6d34b4eb744ea581b1870ec9376
arden.bradtke@mailto.plus,@@Masuk123$$,0xf9a6baa525055f4080a698deb448caf651167a16
cherish.kessler@rover.info,@@Masuk123$$,0x6d68bcaa130c446213aab77d6d987f9d9843edab
margaretta.pacocha@fexbox.org,@@Masuk123$$,0xb6b8d587a9c16c99f79c8cef53b2fd789b4aed3f
burma.mitchell@mailto.plus,@@Masuk123$$,0x1dfade00563e3b94e97d139bdcfcbc60e2085a03
kellie.ullrich@fexbox.org,@@Masuk123$$,0x6b6dc04100a2c3d6acda31f26872abb120eee9ad
ramiro.schoen@merepost.com,@@Masuk123$$,0x7e4140fd35aa313acb08ec1a83a8c3b2923e421f
octavia.heathcote@merepost.com,@@Masuk123$$,0x9c0d09aaa307415d13c0d6a925aec2a93cca3a2d
todd.sauer@fexbox.org,@@Masuk123$$,0xef5a95ac7f748dc8f34c1d7f90593db2d60c46ab
matilde.lehner@fexbox.org,@@Masuk123$$,0x4050441dafb943aa41bdf3c0a8dda42a39c363cc
archie.upton@fexbox.org,@@Masuk123$$,0x520ecfa071c36176138051a646a2e2464161d240
suk.jakubowski@merepost.com,@@Masuk123$$,0x5b332c4a433320a66b75777ffebd9e45743d8e2f
sang.stoltenberg@mailto.plus,@@Masuk123$$,0x9e1dc4a61c24c4b2d304a96d57ec634a123e5c36
olivia.fahey@rover.info,@@Masuk123$$,0x606c4474b5c6df3a9fcdd9c171b11aebaa66d8f7
susy.parisian@merepost.com,@@Masuk123$$,0x00e843c1e438fb5024624f254083395e5eb6dd21
kali.veum@merepost.com,@@Masuk123$$,0x07f97622931a9dbe6b4665453c057024611f2e4e
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
