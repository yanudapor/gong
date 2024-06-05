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
antlio@niceminute.com,@@Masuk123#oZ,0xb2d75719945426d0c8d4806e2c85136516187bd7
tolyn28@niceminute.com,@@Masuk123#oZ,0x93603edd1a4f8bec4aff7de5ef398fa16aa43bd7
sixflowers@niceminute.com,@@Masuk123#oZ,0x2da01f716f7c173d696fde7a349011b08647d882
berfu1990@niceminute.com,@@Masuk123#oZ,0xe33f5bb0fe85953f7c7c9f9adaabd4d2cc8658d8
pa0632911@niceminute.com,@@Masuk123#oZ,0x480152010a7ff7c7d8046da419d7961d04e29eca
gulmirac@niceminute.com,@@Masuk123#oZ,0xeec185caf4150ed1b89c88079c5e0d994376fdc9
artempudovkin@niceminute.com,@@Masuk123#oZ,0x9f65cec9c56c122f0cd9ddfbdc9ad5028a57c283
aestht@niceminute.com,@@Masuk123#oZ,0xb00e42a76c5905e5d3c35de224fc1277e4431aae
badroma@niceminute.com,@@Masuk123#oZ,0x34d8bb5209f9df27e48220193fb3920ed908659d
dlemma@niceminute.com,@@Masuk123#oZ,0x81bccccc7d47b83cabc45fe6e9c7590ae8084f1f
lobarev94@niceminute.com,@@Masuk123#oZ,0x691c3dd7ee9c1f53608f5ad9030f6bf58aa5f0f3
mepaul6062@niceminute.com,@@Masuk123#oZ,0x4270575ad43b679d1cda7ceaff667a0f2043c228
wexzv5@niceminute.com,@@Masuk123#oZ,0x9e7590b970fcd44fad018fcd46256abf8bfa6f01
mikesterling22@niceminute.com,@@Masuk123#oZ,0x98e08b0137fac7333806918945fe5e493a2dae59
logvinenkoelizaveta@niceminute.com,@@Masuk123#oZ,0xb384ecc2aa7444c65560d50794dc93df28c66f43
luisaclar@niceminute.com,@@Masuk123#oZ,0x15ff6b3f36b2941ca2bfa5a3bfa9a67dc346ea74
dooman@niceminute.com,@@Masuk123#oZ,0x832f4c1358eeb4865ff95b880f70c17bbb702220
kugofimi@imagepoet.net,@@Masuk123#oZ,0x0394f67b419af24b908daf502507b1e511d62bd2
omikron08@niceminute.com,@@Masuk123#oZ,0x3cd3bcdf89bd30361ed4c32d523d93e15b005a08
64775v@niceminute.com,@@Masuk123#oZ,0x592f47ad1d4b4b850e489e0912d017930d3aea7b
hebemu@pelagius.net,@@Masuk123#oZ,0xa921002b624e8a8e58b5a3997e0fdd2a0dfac3f9
kidwoom@niceminute.com,@@Masuk123#oZ,0x3ccc979529fe4f2420fa056f6fa932deaa7cba75
powaleko@citmo.net,@@Masuk123#oZ,0xacb6554feba44ef8471c52db2d28372a930855c8
ovando@niceminute.com,@@Masuk123#oZ,0x3af26b1ded0bbabcb8aaf9720b66c87569503f6b
webmasterjg@niceminute.com,@@Masuk123#oZ,0xb6456f00cc2425bc57c3c3715d729ad5b022b4a1
xploadb@niceminute.com,@@Masuk123#oZ,0xc718e46741e9df653365ecdaf9eca3452328c4ce
vupazula@pelagius.net,@@Masuk123#oZ,0xfcf09f285ad5a21dbb5f0a71b67bc1a3b0c90108
initdoby5@niceminute.com,@@Masuk123#oZ,0x59890e874e64b11c624220d3784ace8a6a33edd7
magasago@imagepoet.net,@@Masuk123#oZ,0x58c3bebc4f3611485e789f6a1f35bfb8c663e696
bbsm08@niceminute.com,@@Masuk123#oZ,0x2984e76936a43c610148e02a206c131eceb6fb4c
wudyloqy@closetab.email,@@Masuk123#oZ,0x14bd56013610eb94c0365ae712010ce65be67d9f
lera15lox@niceminute.com,@@Masuk123#oZ,0x674b6993068993dd988e673d1c6e1e8fd1cfe3ad
ngnear1@niceminute.com,@@Masuk123#oZ,0x98367df0cb12839087f4296f5892ab414f482c55
llirina2@thueotp.net,@@Masuk123#oZ,0x66662a6a55aff30ae0f1b3bd5e4f93ba1bc89bf1
jefele@closetab.email,@@Masuk123#oZ,0x434b14aa91a911416deb26e48d83da595cf765bf
buk38af@niceminute.com,@@Masuk123#oZ,0x1e07c9df27a88ea9958c2ebc85d17e6902259056
neuro63@thueotp.net,@@Masuk123#oZ,0x35de7726bc84ffd2a21952f9a15071cfc81f2e20
bucace@imagepoet.net,@@Masuk123#oZ,0xceba0d0312f868279c155df2b5ca8a09bcc82cfa
dv8tor69@niceminute.com,@@Masuk123#oZ,0xef9930759db633c9ce00cd0fe29bcd267b04a4af
cerberusa832e723@niceminute.com,@@Masuk123#oZ,0x26e8d8b41a9c697dde3140b3fc06dbe3b2455aef
danwitinok@thueotp.net,@@Masuk123#oZ,0x1534ccfcdb156f483398fe523344cf065b0ec375
jrobbins101@thueotp.net,@@Masuk123#oZ,0xddbd08e21d796e5eb5deded7db48bf61502eb3ec
mojitusi@closetab.email,@@Masuk123#oZ,0x1d3465c8bd56125a515b94f225ecc26fac857e42
icey@thueotp.net,@@Masuk123#oZ,0x33742d886e015058a55e123529b84eadd6b1b977
gebo2007@niceminute.com,@@Masuk123#oZ,0x12516695252dbd4fba8863467819ae0e9a8b387c
humutary@pelagius.net,@@Masuk123#oZ,0x7ffdd47a8eea88ebc44ec8d079ee244b5042f853
lola1980t@thueotp.net,@@Masuk123#oZ,0x89e4453114d15896a2c189802966c915ac15800b
cedobyve@citmo.net,@@Masuk123#oZ,0xed8fc02790dbc63c8000b5118f79dcafb12d7dd1
cablexx@thueotp.net,@@Masuk123#oZ,0xa71c36363a759efc2f8738a7673c43c25cc03fed
bujodigy@imagepoet.net,@@Masuk123#oZ,0x451e571fe002c44d466e28b83eac318e2f729aaf
beni3442@thueotp.net,@@Masuk123#oZ,0x9e3010fed222d2a842359cbf6b440dab4b048610
jkfdghnxcvb@niceminute.com,@@Masuk123#oZ,0xcbd956cde9ae91d81f7ea3ae1ac5b4b13be28585
notttellingyou@thueotp.net,@@Masuk123#oZ,0xb568bd12ba69970dfc81a7b9b779825ec54fd6dc
mtbarone@niceminute.com,@@Masuk123#oZ,0xd61ef3b116c8885dde8079362dc1a6c47eee3709
cuzuxula@clip.lat,@@Masuk123#oZ,0xd84dfb2c7d5992bfd05e6597550cc630dc5f7206
sorocinroma@niceminute.com,@@Masuk123#oZ,0x42f3c4f2dbeb98333258a81556720224fe662fb3
nogglescerenziace.r.k9380@gmail.com,masuk12345,0x93e531fa4c212e4610df5378e1e4ea20c2c4960a
roleyarenstame.oh.d.n.374.3@gmail.com,masuk12345,0xce58f01244b9814ec70b6674b7762ba903b35e11
judefandel.sa.hz.2215@gmail.com,masuk12345,0x4f303491473e6d5ae1e3407600f86803a12233b5
vrbkagatewoodsle.kk4327@gmail.com,masuk12345,0x514ce7121180a27378bd30718eaf03c6bc1e664f
randywoodmr.1.8.1.9.8.8@gmail.com,masuk12345,0xe9820b361f5cd8c8dbd8a1af22056a32fd4c3615
budesasaiaw.vr.e3.290@gmail.com,masuk12345,0x528ef4e17949d75c4f4a390a7f1c928cf8f9bbc9
pangelinagiontatg.v.q58.2.9@gmail.com,masuk12345,0x182bed214790c497360a85941eb40dadd148474b
enomotohashbarc.a3.510@gmail.com,masuk12345,0x68e6b7444e26313e8282b3923d1368f19412e207
masciashahinw.mtqb5.839@gmail.com,masuk12345,0xaf0004d2212050e94bc09ee281ee07a13f91c682
musawakilia.b.ubakar@gmail.com,masuk12345,0xe36505f5ee78e67b0b7b60b5956b48861f265813
sudatsuzukiwh.c.c.6.05.5@gmail.com,masuk12345,0x534903b012a28fbbf685f101820bfd846ebbc8db
collmeyershippeyyvex.b7.719@gmail.com,masuk12345,0xd7e1a19cdde150dbaf9d4cda21bb7947f837f779
surwillogregot.pj.o.9.2.05@gmail.com,masuk12345,0xde02cd1eb6fd6dd3e2dd083408e1a09aedd90ab6
theresahamm.s.23.1.995@gmail.com,masuk12345,0x24699b1c3771859bfb93867d18bb0518d1562878
woofterbloesernxr.a.2.2.4.4@gmail.com,masuk12345,0x5cb3c43b123801d6b1db109d6bc771efe29790d3
raysidemcneeslkoq.t18.43@gmail.com,masuk12345,0xd3e837f485295e630f8ab61f0df6db126cbc828e
amastanseyf.jkx9.0.6.8@gmail.com,masuk12345,0xf904a1d8cc2bf1e7459facb2a5e86a62dc2cb21f
stockebrandsolertjr.i.z.8.3.0.7@gmail.com,masuk12345,0x0579fff9a44733175aa5356e470371140822c468
prospernadels.zm.nx11.82@gmail.com,masuk12345,0x9d728b843d3d58c4f5220dd1bb7fcdf71390a808
bleylgelbartqc.qnc.9.193@gmail.com,masuk12345,0xcd153af193494febec7c64597895fce11a14fd17
golembeskiryonxg.n.d.4.4.45@gmail.com,masuk12345,0x7954970dc5492ff7011f2791a1cd76ca726ec3e5
mcthuneklotz.ok.jq8.46@gmail.com,masuk12345,0xddb0ea0ce606e836d0c17a9a2a4b161ffc36439d
witfieldlambesr.jyc.a9.57.7@gmail.com,masuk12345,0xd46c5c6de6e462bc35afb7e616ba97171ab37b71
wilmotgrassie.l.dtb358@gmail.com,masuk12345,0xad08d73070d1da4b55b2038c26cbb0b70dd9f469
jeanwalm.s1.21.9.95@gmail.com,masuk12345,0x4d58a4e313db04754ab3e918dad9624ab0f7b622
nicholashowell4357+c3ae3@outlook.com,@@Masuk123$$,0xc31344356ab3f1c600ae38b41e30864e6664b10d
richardwatson53472+nv57y@outlook.com,@@Masuk123,0xfc81bd3c4bd17c8b62f76ab1d84ebf5bed2692f9
andrewgriffin3436+oml8b@outlook.com,@@Masuk123,0xcdf53e915508e136be023529bc57bb86242a8d52
paulgarrett4368+d20k5@outlook.com,@@Masuk123,0x9bfc76ded6db97bf49c1f1abd3836ed45dd75d86
nedaxdwillifordh529+yrlwq@outlook.com,@@Masuk123,0x56cba843ea5f4c5add4e9d58585f1a3dfba4fc8b
craigharper3451+uictv@outlook.com,@@Masuk123,0x591c0a316a3169dfa384d84f1baf3d95f2552913
diananguyen4521+aw2t0@outlook.com,@@Masuk123,0x631f489e9e8d23b655f38a292d749382b27d9ed0
stefanibartley220+ghtib@outlook.com,@@Masuk123,0xfdbc0d9109ef204936bd8b0adf0308e30f736c70
vanschoickleesa.ngtz.738.5@gmail.com,@@Masuk123,0x0f9274bfa74340e291667ce362202be96139cbfa
cuadrastassonrbax.c2.05.7@gmail.com,@@Masuk123,0x1dd659fa472ee0f23c3f9ba80fad1168048f8017
vanettahollins5463+iowo2@outlook.com,@@Masuk123,0x32b3ceafa447fd38f2a41d37de8c60520ce9bbfd
rosannaholm847+mksoe@outlook.com,@@Masuk123,0x1b7afea0ed91df3f70b02e0610916a4b2bfcd3f0
brindaxphuguleynv933+w9e7y@outlook.com,@@Masuk123,0x1f3530fcb869a6fedc1461f3bc8c3d96435ac93b
billycastro2626+ktvtg@outlook.com,@@Masuk123,0x4c74a44fe25b0ac4fee14148599e5c4ba5792fcd
stefanibartley220+dkxan@outlook.com,@@Masuk123,0xadf72d747a5df9e975acbe76238c5a83e098620c
eunhang279+24wkj@outlook.com,@@Masuk123,0x85411ef17a0792f81edac5a8c9b7d661f5d393af
viduwyzi@imagepoet.net,@@Masuk123,0x783b66ae7cb5de796ff800246347deeeb7d819dd
fawyhy@closetab.email,@@Masuk123,0x1d28e07ff6d86e01da411963d2048a9f9608ce29
karenbeck4357+wybhz@outlook.com,@@Masuk123,0xeaec4818a353e6b4bab322709d6311e075844dd8
lindacoleman6767+rwhe9@outlook.com,@@Masuk123,0xb3a1daea1270308e90164e3edcfaf9f6b66d38fc
signeprovencher714+yfxzr@outlook.com,@@Masuk123,0xec446081a7d7b1d88fa851bb37f89007e2e7b4fe
anthonydunn7689+uluun@outlook.com,@@Masuk123,0xa62b2f1e0a71445f6d253c8b33340f4bc5176c8c
samuelrichards1786+jch8d@outlook.com,@@Masuk123,0x0ba5971bb6b303e1be2674d42f4c165b74f92fea
hwarupe255+g3j1m@outlook.com,@@Masuk123,0xcfc67a2bbe798be3626c5bea49512e1d4eeec82c
doughtydricardo149+0fldq@outlook.com,@@Masuk123,0x047159413a1f175c9a5a16a0fe160454fadc7d59
yuonnemoniz345+8oi91@outlook.com,@@Masuk123,0x90d91dfa9e5e22fe6cff4cccd110b3061e30af13
deborahortiz5267+rcved@outlook.com,@@Masuk123,0x81babb6bf9204456636d2609d3322eaf6902b7b6
rosalynleyva5648+0irj3@outlook.com,@@Masuk123,0xd1116cf921fc9e7914bc776c65aae448e013d42d
maryleedacosta228+fque6@outlook.com,@@Masuk123,0x58fd420e52f3cebbb0644e0cb5166dd20f162ebb
colettenorcross592+pugms@outlook.com,@@Masuk123,0x6960685584b7941d9a4fd6e954ab8ff0fc773690
bookermaglione543+jd3ei@outlook.com,@@Masuk123,0x0c8574179c43d749f765ff5ac6b7837feeb76fd5
busterponder210+t2alf@outlook.com,@@Masuk123,0x68f6b859a7f552b39e76b5030b5b094244ceca61
babaracanady476+6ws8c@outlook.com,@@Masuk123,0xec3a5cd2ecc78d977eb681822d86e39bcc1284ca
kranzlogwaltneync755+ugyat@outlook.com,@@Masuk123,0xce9d21386df67565399a35c400c5bef59f8514bb
peelefgardenermb769+f7epu@outlook.com,@@Masuk123,0x7d4996b6d8c856241748bd81ed23ed6818991575
jeremyhernandez1238+ads2e@outlook.com,@@Masuk123,0x3dea14c87b5769af583aeeec4f9b425fdd33d974
minpayton326+an8oq@outlook.com,@@Masuk123,0xbd9f00a26a4a5b8efd8dd38d76208932654933fe
mendymarlowe343+wvrpt@outlook.com,@@Masuk123,0x0733b3a5f266a552eaf083b6abd60f5414ed6c32
kennethbrown4267+orbkt@outlook.com,@@Masuk123,0xe4f967992d29e922f94a806af623378f2874cdb2
christinescott5645+lgbyr@outlook.com,@@Masuk123,0x6ef8a9c97c78ad1f98e0ab3f06de1d62fc722960
lorrieanaya56221+chdoz@outlook.com,@@Masuk123,0x8f165b72a9cbdf4d66dc96d0ba24689ae74bf44f
zolicozi@citmo.net,@@Masuk123$$,0xc7a391cd671f5cede9dc1fba9acff324a1e48d91
sanunocy@cyclelove.cc,@@Masuk123$$,0xe3d4f69c0af198acff1fb131cabe14d3ebfe70d3
cuqulyca@molecule.ink,@@Masuk123$$,0xe91a84ac12f7456c11261b6691b80947df7b98fa
nawure@clip.lat,@@Masuk123$$,0x7e0a36a5bb3835398d626fefb4912041a0037dcb
xinaqi@clip.lat,@@Masuk123$$,0xadbc8a5e61b6c4ae98df0703bb02784e16732bdd
wuvuxuru@pelagius.net,@@Masuk123$$,0xabfed8388c6b95bde6fc9fd385165120dca749a5
lepokide@pelagius.net,@@Masuk123$$,0x9818c504ecb764d25b28220023716c2ca8d66200
tygywexu@imagepoet.net,@@Masuk123$$,0xc7bc8f382582514c483ed3fe04c78967f1e87545
tajata@citmo.net,@@Masuk123$$,0x7a362e43b61996a29dee939962a62b444af4c998
sixirapu@cyclelove.cc,@@Masuk123$$,0xd61cdf6224eb85c44c01efca8c993e95e7342611
lelile@imagepoet.net,@@Masuk123$$,0x24239cae83fd1d04e85d0fd2a3a42256379d2114
gyfidoru@clip.lat,@@Masuk123$$,0x49601153a9670b1505704504c690854acfba58d9
hyverimy@citmo.net,@@Masuk123$$,0xc3437bf31285402c89ebd1b77de9b5b4d3441b23
qytafa@imagepoet.net,@@Masuk123$$,0x61ad9b49f09e8ebe3feebb29b6167aa6b68849c0
nyzuby@molecule.ink,@@Masuk123$$,0x07040365faf643b9ab90ba90f62de9d00a6f1bb0
zykiqy@clip.lat,@@Masuk123$$,0xe68710c8c734bee3320b29591153558fc998d58b
vohizuri@molecule.ink,@@Masuk123$$,0xd0ed3b9fd90fcb1548a576181add52b3a47d2a76
zuxymu@clip.lat,@@Masuk123$$,0xda35221dc93af2994835166fd2653c8ac9829515
wedyga@citmo.net,@@Masuk123$$,0x7f29dfa9534464ed0650773940b1a1e79ab1b39c
qodetere@clip.lat,@@Masuk123$$,0x4edd06ca9297f8efbe69df05a5716b2729517bb8
vofebyqo@clip.lat,@@Masuk123$$,0x3a2dcefc947645a9c0254d13c55172f736069b1d
jewufi@imagepoet.net,@@Masuk123$$,0x79d84a034472c7d19dcb62d6c150cf546020ce70
lepuvo@cyclelove.cc,@@Masuk123$$,0xbf88c289d525daf4c49c7dd4d3632bf8538ac5b2
xijujige@pelagius.net,@@Masuk123$$,0xfadf1a3dcdf91521b9abec52e7f6846a5dc45154
worygoti@citmo.net,@@Masuk123$$,0x6f5f48abd77153dad71f875f44313740111c01d8
fakadopo@molecule.ink,@@Masuk123$$,0x9819cc06a8f3459e0285f3f563c2506c7fb57da3
mejonu@clip.lat,@@Masuk123$$,0x0075acbebe51e3ff6d55844137f32708a20b68a1
lilibowu@molecule.ink,@@Masuk123$$,0x5d0ea1db6ad1bd189c2da72040ec1d715cfb4980
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
