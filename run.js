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
shantell.kutch@fexbox.org,@@Masuk123$$,0x38a1cbfc6d375c74ecca43a8a93cef5719de69e4
palmer.ryan@fexbox.org,@@Masuk123$$,0xb1785194f7992d97967c03b7d2188e41ba4dee6b
numbers.wyman@merepost.com,@@Masuk123$$,0x3b63ab57ec8af111ca051c220f68c6dfe638e87d
mitchell.friesen@rover.info,@@Masuk123$$,0x0d41684f595ce2e387d8ff19b17d3451cd4d910e
dana.hessel@fexbox.org,@@Masuk123$$,0x8ef46f02b3acda35b0d9866ab2345b5684e67e41
lane.kovacek@rover.info,@@Masuk123$$,0xa4fcf58856c267e33c74d6af22bb9f2b39d01fc6
jacqui.waelchi@rover.info,@@Masuk123$$,0x8544129c03cbca894e39ae817f68008e00b67209
lowell.walker@mailto.plus,@@Masuk123$$,0x33391321775a7166ecf58e805aa9daee146b0213
linda.turner@rover.info,@@Masuk123$$,0x0f85db61b56071924047f684ca49f45ac7902473
milo.hessel@rover.info,@@Masuk123$$,0xda92e3e8c9b984721cb0c4754328e2cc03349cdf
ayako.heaney@merepost.com,@@Masuk123$$,0x720654e6642f3c68de2cd8e0a03c2530862026bf
penni.jones@merepost.com,@@Masuk123$$,0x7b3ea233b8e8640f3b01be31e27cd70f85c4cf39
jena.doyle@fexbox.org,@@Masuk123$$,0x8eec39be9ae1f235ab46e54f93d48ee059493ce8
felix.vandervort@mailto.plus,@@Masuk123$$,0x866c8592e8f8d1411ec7d1089b3ecf32446cd055
brittanie.langosh@fexbox.org,@@Masuk123$$,0x094504a0f3ee728d8a801c9da912aeb75dab4d0e
tillie.dibbert@rover.info,@@Masuk123$$,0x0fdf1b4c807f2a7b82b41f5fd83a878dbb3082e9
olinda.bernier@mailto.plus,@@Masuk123$$,0x1e8e209895fa94723acfc08123d4fedf683f3739
sherman.kris@rover.info,@@Masuk123$$,0x8a5a7780e6497323521b69801e03e4ebb756a09d
adam.swift@fexbox.org,@@Masuk123$$,0xced36acc1f3cec610b960b04b8ac57cb4432235e
brendan.buckridge@mailto.plus,@@Masuk123$$,0x90b84cf482ba8a30ba7e207d73a101f20aef97e0
eli.skiles@merepost.com,@@Masuk123$$,0x34e9d016fb2867fd94957bb1c7f4be9e3542e12d
cordie.jones@mailto.plus,@@Masuk123$$,0x5535d90482f7d1c53b1d8234542f622801f59e68
archie.moen@merepost.com,@@Masuk123$$,0x6d730b6fd42fcc83d639df8bbab3d35d9aa811a2
dale.torphy@rover.info,@@Masuk123$$,0x200ca97b37a4c8cef041444012d7912f2b02e06b
claudine.keebler@fexbox.org,@@Masuk123$$,0x9fc61fd61aacb3b84a52b5dff8ac0ed3af06f0cb
everette.treutel@fexbox.org,@@Masuk123$$,0x6618471f73c802c22647fec5c77f607faa564981
hugo.prohaska@mailto.plus,@@Masuk123$$,0xc0f0812dde62baec5c7332decee08ba54d5fb7d3
garfield.hamill@fexbox.org,@@Masuk123$$,0x6157c231e8c989d1402045a21eb00086b774cc59
debrah.klocko@mailto.plus,@@Masuk123$$,0x04e1ce13435868b273bbe2e104d8e59ee8ab8574
dakota.spinka@merepost.com,@@Masuk123$$,0xf48d2c852f017b66bf46066b5efa283f306fdea2
tamara.schaefer@merepost.com,@@Masuk123$$,0x489433f99b585d175e596f5402b6a1df1dc5b217
bryce.balistreri@rover.info,@@Masuk123$$,0x031b6235254286c0813e8dff61e6153883c7ade5
bobbi.nitzsche@merepost.com,@@Masuk123$$,0xa17baf04a7bfc32bdd20f1b9719a9a0da466af38
aubrey.grant@rover.info,@@Masuk123$$,0xa165cda2e15524a2a1b44f95c891252e4fb50550
cassy.lynch@merepost.com,@@Masuk123$$,0x2e6d6bc1e9d2a2bb2de23dcd3e20887a3a1cb7d4
rashad.jacobi@merepost.com,@@Masuk123$$,0x5694fc0e8ec422a94138693881cf1348a43099f8
robbie.gleichner@merepost.com,@@Masuk123$$,0xeb13d5ef9723972fc784f1b7be22c919322b30f8
leonor.klocko@fexbox.org,@@Masuk123$$,0x40079fd9bdee78f9b74f9f187074a329e90c3ffe
shon.denesik@mailto.plus,@@Masuk123$$,0x68d6ab1d25f051ddaacda9913a7d5b55ff1f37c4
yvette.o'kon@merepost.com,@@Masuk123$$,0xd3eebed9155bef4ddda27d111e89ad4894be765c
robyn.tremblay@mailto.plus,@@Masuk123$$,0x815b6a1edefadc9411935b17fcd53cd53705147b
angeles.bednar@rover.info,@@Masuk123$$,0x244e3f7685dbb6b033b45d8e22372eaf64ca7d69
nelle.herzog@mailto.plus,@@Masuk123$$,0x201a1101a519b1ace7e6287a8b83f96a94bfa280
tawna.gerlach@merepost.com,@@Masuk123$$,0xc1bae2276ea334838baa40d0f39268f10a28a4cd
gerry.larson@rover.info,@@Masuk123$$,0xe8f635fdbff188b46d9ef4e1f34c90c9822e4242
maribeth.labadie@merepost.com,@@Masuk123$$,0x70dc707f62bd06ca69f1b0f4321ce3220e5f3dd1
rubi.lemke@mailto.plus,@@Masuk123$$,0xc3ab44167bfa36d5005ee88392236e9ac0bdf32a
jenee.kuhlman@merepost.com,@@Masuk123$$,0x217d31fc9ca8af5c045b44a8cbfb64296ea7aa09
cristy.purdy@mailto.plus,@@Masuk123$$,0xa44c576fd6a0b24f2abb90707626f6fa2adad428
deloise.conn@mailto.plus,@@Masuk123$$,0x4b02993e1a3d5ef38cc063622283719db543d4e2
domitila.pfannerstill@merepost.com,@@Masuk123$$,0x097c8f18a187745772f508b11030c0e34cd8fbae
elmo.hamill@mailto.plus,@@Masuk123$$,0x323950f0411df1370d8e683bacc3766eb17231e5
edwina.rowe@fexbox.org,@@Masuk123$$,0x82882e8e7aea12c697e0981064ff2366e3ea0df7
mora.dare@fexbox.org,@@Masuk123$$,0xe13a17d0c6d3e3342d783ab8ac029955158fe064
cassy.stehr@mailto.plus,@@Masuk123$$,0xc6b441958ea6a3519f7b2d2e16af2af16645209f
ginger.hauck@fexbox.org,@@Masuk123$$,0xbbc43f4d7fa37a4245f078753b5dfa4ffc1d8616
derrick.corwin@rover.info,@@Masuk123$$,0xb9e9f04fa18159ab8a6756d5b134ccc0a4d56141
errol.fadel@rover.info,@@Masuk123$$,0x62e30047f70afdb016cbcd733e2d4966d4408b3a
cinderella.predovic@fexbox.org,@@Masuk123$$,0x885dcb9097463365f82ee262a49467d2cf28f8bc
boyd.smith@rover.info,@@Masuk123$$,0x185de1e54b5d44cb199d1072caff9badb973705f
gordon.blanda@fexbox.org,@@Masuk123$$,0x687e75b57e568faf85923ad5d6db1f446b93a2b5
shizuko.feil@rover.info,@@Masuk123$$,0x34693e10d46e821227af4e383e6003948e054c75
melonie.kilback@fexbox.org,@@Masuk123$$,0xba3285aa36dae0e35b588597e85892255bb85cfc
scotty.d'amore@fexbox.org,@@Masuk123$$,0x26a1bfa30863057668b09e2d62882b30de76e040
oscar.johnson@fexbox.org,@@Masuk123$$,0x579ae8d1a4dc8c78a35aea696d76d3f131d4357b
len.simonis@merepost.com,@@Masuk123$$,0x539f61aacd3d8f05e9803572e738792bfec994d2
granville.parisian@fexbox.org,@@Masuk123$$,0x8f8b05d66fc73d64c856de2dfcf04e6a42ce4a48
nathaniel.volkman@fexbox.org,@@Masuk123$$,0xe0f89167a923a85c60e7a84e9588aee992366bf6
marguerite.reilly@rover.info,@@Masuk123$$,0xfe7c5b34a085b5af78d27bc528553f82aa3bace9
steve.o'connell@mailto.plus,@@Masuk123$$,0xcefd7f9551f693880b90e21af0b5ee138d1b9314
brent.frami@merepost.com,@@Masuk123$$,0x6ea7510f18098a1a74d4d61ed7c87be0ab01dae8
rickie.kertzmann@merepost.com,@@Masuk123$$,0xc6057268e490ebcbb7c14e3ebaf8184f58a71826
bart.breitenberg@merepost.com,@@Masuk123$$,0x75747c69f30e3fbbc39aa6ad4f630d544d1ae965
adam.kessler@mailto.plus,@@Masuk123$$,0x462f628113999d67bc013d92a3ea87ed06704212
trent.luettgen@fexbox.org,@@Masuk123$$,0x8cf94ac6914b7ce5cf26d88a4eb366c910f7eaf4
carmine.feeney@rover.info,@@Masuk123$$,0x8ef0ebe0e8e8e2091af58b948a081e8025a4fd10
andrea.koepp@rover.info,@@Masuk123$$,0x49a60a64378a4d00ad3ac7fd7764df4b1abe696c
darrel.collier@merepost.com,@@Masuk123$$,0x832ad7d200aa21527d28f823f7a8adc5ae8aa87a
corey.keeling@merepost.com,@@Masuk123$$,0x6931aa7672e1a64f2aae48650f91b65888d7dae1
alva.russel@mailto.plus,@@Masuk123$$,0xec853d91cae5d725b868db0b34c51b6c3bf086f2
danyel.green@fexbox.org,@@Masuk123$$,0xbebf9625564d7a846097597700f4c6840aa38036
tad.d'amore@merepost.com,@@Masuk123$$,0xa7ed355675341fb2024c41d4f260078e22bb1b98
hortense.adams@rover.info,@@Masuk123$$,0x2c17e40a9d835183c4842a329e0f2f76ffff7a8c
tyree.mcclure@rover.info,@@Masuk123$$,0x5634f43e6707c0a30d9e7c53cf6fdd0cec3bba3d
anastasia.thiel@merepost.com,@@Masuk123$$,0x0bd950ecb0a0ca549b4636f6ab1c0e1925ff5965
rashad.macejkovic@rover.info,@@Masuk123$$,0xfe764d9df7caa7f3e090b18bd4f4aaf5b970d704
renato.funk@merepost.com,@@Masuk123$$,0xab9bbfdc6dec2e96f911890bc32ea7a7941ab760
meta.ledner@merepost.com,@@Masuk123$$,0x5fec5382b5a503769847313556a791edba3eaeef
henry.braun@fexbox.org,@@Masuk123$$,0xe8404514b099ff8bb8eb39b8b77d43ef338d1d83
ian.crona@rover.info,@@Masuk123$$,0x1ec63ae63ea1ce129a68a98937313a79810e7139
leif.konopelski@rover.info,@@Masuk123$$,0xb635cb4cf71de5f545e98b7c79781451ce276734
gregorio.johns@rover.info,@@Masuk123$$,0x3680a28c9fe98306c961566e253eb66eb69c0a7e
dusti.ward@fexbox.org,@@Masuk123$$,0x4d3cab8a8503ca51b85909b93447e7854ebf7eab
minnie.weissnat@rover.info,@@Masuk123$$,0x4d6d3c947bcd8afc9dd530447a31c41d134d9a30
verena.harris@rover.info,@@Masuk123$$,0x2658267a00cbb92235e596ceabb7315ae27a9780
matthew.daniel@mailto.plus,@@Masuk123$$,0xafff3948f124df69c6b0ca342dffd2ae790119b4
cecila.abbott@rover.info,@@Masuk123$$,0x8e1865605d37a6ffeb401833c528a74712c877ad
stanley.sporer@rover.info,@@Masuk123$$,0x25dfb34f9d03eb7e3e83f28c0c8f407921ce9862
gary.bogan@merepost.com,@@Masuk123$$,0x1be9ef783bb134fea833ca649e5f79b76f195d21
wes.windler@merepost.com,@@Masuk123$$,0xbf388f5083e55b0f3209ce5da8b165ca290c81b8
wm.boyle@rover.info,@@Masuk123$$,0xa960bf510e25eb8d5c1ee9aca2c8538a7faf18bd
roosevelt.torp@rover.info,@@Masuk123$$,0xcd77a30945c6d235f29af08fe1351fe859b1c319
kelley.balistreri@fexbox.org,@@Masuk123$$,0x4a728eaddeeaea6360231a5fb23b1ab3158b2674
irene.gleichner@rover.info,@@Masuk123$$,0x406e0552292320d50eb7a1dd103008ffd3231202
donald.frami@fexbox.org,@@Masuk123$$,0x8204aa76af700b681ecc11252408a9743c903fe0
mitchel.brown@fexbox.org,@@Masuk123$$,0xbd02d92f6d53ae2fb76b58ce2a48d3eb8e1bb865
luigi.o'hara@merepost.com,@@Masuk123$$,0x20a2beafc8afaf3054f16886fd8c5f17331d5c4d
adolfo.stroman@rover.info,@@Masuk123$$,0x69b680dc67cbff504e8d10df0ce62939811ae654
tomoko.kautzer@mailto.plus,@@Masuk123$$,0x613b1a35afaa4959f2fa4c67d6b154e0cf4370b0
liberty.langosh@fexbox.org,@@Masuk123$$,0xdf8dd57a391b0d1a9bc7453c0fa4b7c470b66be8
roberto.raynor@fexbox.org,@@Masuk123$$,0x6441ecfb48a64cbd4b49aefd0769149372e60053
tobias.carroll@mailto.plus,@@Masuk123$$,0x8b3d3a049595235eeb2864c0cbcbfef3c75dc088
bryant.hodkiewicz@rover.info,@@Masuk123$$,0x2794f90361144e4e9d8012145730f6db3c7e8d97
cristal.nolan@merepost.com,@@Masuk123$$,0xc785fbefa792e842eef984ae37cef12f9c65535b
billy.bashirian@merepost.com,@@Masuk123$$,0xb532276cdd140c0ec65deeaba10c67a2706b46f8
trenton.schinner@rover.info,@@Masuk123$$,0x6818b31cb16a16279654a4fffcf1ea7a7c073e50
melida.runolfsdottir@mailto.plus,@@Masuk123$$,0x2b16c1bad38f61a08f7353838939b3970479b13f
sydney.trantow@merepost.com,@@Masuk123$$,0x44b8297ddce97ba1fe48521d10db37e3380e937d
candie.wilderman@fexbox.org,@@Masuk123$$,0xbb5e9df396a2bd904c7afcb773979838c81b5579
rigoberto.moore@mailto.plus,@@Masuk123$$,0x1456241a073f46afa77b6c6f9ea41a85730af887
queen.grimes@mailto.plus,@@Masuk123$$,0xd458c1a07f51e19ea3c6f7a330749ef7e8f3062a
shira.fahey@mailto.plus,@@Masuk123$$,0x311134c55f3f08db239dad758995368233ad964f
elden.jacobson@fexbox.org,@@Masuk123$$,0x86e492673efa8108d6334bfdf940e4371c0a09ff
bell.klocko@mailto.plus,@@Masuk123$$,0xa1e480b7be0670ddd7b323b74ef23adab3af83af
lesley.champlin@fexbox.org,@@Masuk123$$,0x86365733e62a37d51388fb11d3bd645e91c94f6b
nathanial.trantow@fexbox.org,@@Masuk123$$,0x02dfd7fda64f5b4a3b0da53fed856056bd19ac98
cory.anderson@fexbox.org,@@Masuk123$$,0x6e266e1951222162c5ff860a9d9167e8784097ff
anisa.kuhic@fexbox.org,@@Masuk123$$,0xd42570eaf37925f40f018bde3653f5987e405778
erik.schamberger@mailto.plus,@@Masuk123$$,0x89407fa225b8397ca3c7e89d6edceabff0a3a579
william.heller@fexbox.org,@@Masuk123$$,0x6a455a4ffce895afa494295d8584cfe61dafc53e
sherron.fahey@mailto.plus,@@Masuk123$$,0x8fcc1853b031a9d9f8812d4ea64d703b2bc2437d
velma.toy@rover.info,@@Masuk123$$,0x7dd5a80283bca527c1132ad5c405dbe00fe06dc7
lorna.koelpin@rover.info,@@Masuk123$$,0x5632c53a3462d8a8a78d21d0b55083449378f8fc
lawerence.greenfelder@rover.info,@@Masuk123$$,0x7152a66202ee0662273be59a8906bbd8884a96df
byron.murray@merepost.com,@@Masuk123$$,0x85bd72709edf195934d137f39125b7140b40f414
cami.stracke@rover.info,@@Masuk123$$,0xb0726fee792fd324a4b69ce3f2f0853a799bf89b
jamaal.bogan@fexbox.org,@@Masuk123$$,0x6c00ec3dfb521571634b8d0586a82dece7075653
simona.willms@merepost.com,@@Masuk123$$,0x57483a144877cf6355b78be5655d2657f6f64ab1
terrance.howell@rover.info,@@Masuk123$$,0x6755dbcfa4be251264bf020cdb377ca0ad6dbd56
deshawn.macejkovic@merepost.com,@@Masuk123$$,0x7490b0b6f4ba2ed20ef8b58b0eebdd8fe7b66398
maxwell.breitenberg@mailto.plus,@@Masuk123$$,0x09bffe37cf064f5a390cd216863f05a5daba3784
leandro.hartmann@merepost.com,@@Masuk123$$,0x1d43d61133f1a480337f06d990a9c0c68d6c2cfb
alden.goldner@mailto.plus,@@Masuk123$$,0x9a90241a75a1b9e0663f6f7531f37c8149e7ebb4
kandy.walsh@mailto.plus,@@Masuk123$$,0x03a2db4369783c3f6a8f0aef44ee697904c66fd5
leonora.parisian@fexbox.org,@@Masuk123$$,0xe4f0ee9278ba64abdb63ce307277a533325fc06a
tynisha.romaguera@mailto.plus,@@Masuk123$$,0xab05067b28b62d31d4b86b5a80ca4b8eb776c83d
refugia.stiedemann@fexbox.org,@@Masuk123$$,0xc05ce57fd3fdda6c6ffea776076fdac96eb71891
aubrey.prohaska@merepost.com,@@Masuk123$$,0x8ae61516e2cad2a3988d4734ff5ee7a2dbcf84bb
jazmin.hermiston@rover.info,@@Masuk123$$,0xcfbbf9b821848c9bafa095cdcea380f3fcebea40
ty.gleason@mailto.plus,@@Masuk123$$,0x79131994198603b13b6351c629b53fe69cf77772
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
