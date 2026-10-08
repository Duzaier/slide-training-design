import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.resolve(__dirname, '../public/assets');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const assets = {
  'speaker_portrait.png': '3950d4ace790ab564a9bb148f313ec151a60f294',
  'slide_ahc_1111_poster.png': 'c7f33c4e8d9e9c5c284e5ead5211b408fa0f2e76',
  'slide_sketch_grid.png': '1bd8ed046ffaa5bbfe2fdfc418fbcc0ffdddfca4',
  'slide_poster_layout_breakdown.png': 'c73e8bebfdcbc3fca85521b4a8e2cb37885b51a0',
  'slide_vovinam_3d_title.png': '3ea2e7bd3e430d421711ddc3a96aa500caefee17',
  'slide_diquamuaha_logo.png': '78e583d73507d4b4a1eb4d3d19fb66c6152b1236',
  'slide_440hz_logo.png': '7fb5f7823f6687486f0aa67dbceb079fdc6ea830',
  'slide_vovinam_dongform.png': 'e74f00ce554a93a61c39023db2839ca17b2b73ee',
  'slide_sponsor_storylab.png': 'd3ff9e3ae30e20ce04d98947fe5bb5f6c8d76e73',
  'slide_lowg_summerflow.png': 'bd44b9319e763cebc1a63c66f7f6f59bf0dcd4c7',
  'slide_hangzhou_champions.png': 'df595c2f90a983b6e82847c1a8519e5eb2d2fd97',
  'slide_kiyomi_warrior.png': 'efebfcaf42f01eb0c8ce75ec8caed4e97669bb8e',
  'slide_anime_classroom.png': 'ed728b7e28d8442c5549048a1c97a2ebc96f9bf1',
  'slide_anime_whitehair.png': 'df595c2f90a983b6e82847c1a8519e5eb2d2fd97',
  'slide_character_model_sheet.png': '23fb63345479426f83fe1d16e0accc4f85e4ea75',
  'slide_cartoon_monsters.png': 'd0b6ca7cf31a0e5b7e9bfa3b6c72ec6e3e56c5e2',
  'slide_3d_halloween_icons.png': '6d38e2195f26fd7d4b067d559eeec8414598d1a1',
  'slide_color_analysis.png': '5d28b8cf47bfb3469a53ee0f9d9cf9e3dcfa6e46',
  'slide_3d_primitives_lighting.png': '0072b2259160e184ed9ff802f06b998fd4479590',
  'slide_3d_course_intro.png': '00864919e95ee4c143c10ab1659d510b5ef05aed',
  'slide_fb_440hz.png': '5fb4662d513812738fa093ce6bb76db4f9380fa0',
  'slide_multi_3_horizontal.png': 'a07153b6920f757276ea9cb78c66e2c3feeaef11',
  'slide_multi_3_vertical.png': 'ea96e2bebb55efbf6f5ed660bbfbfaeaebcbbba4',
  'slide_multi_4_horizontal.png': 'd94918f6f59c8bc84df58d519b5bfb428d09819a',
  'slide_multi_4_vertical.png': '4e9e497f39443905085d77ae38302061e93c1143',
  'slide_multi_5_plus.png': 'b360be1c4dd7c844db3be2ae3e2db78393e8aa4c',
  'slide_baitap1_ahc.png': 'bf5702d98c0a8957b9a2b730eb63afa044bbc838',
  'slide_baitap2_shopee.png': 'd18d1de21b2e887b132054546d58f166772fefee',
  'slide_world_travel_awards.png': 'c201b456c56752696aedfd248ba64487d53fd2ad'
};

function downloadImage(filename, hash) {
  return new Promise((resolve, reject) => {
    const url = `https://www.figma.com/file/NVo1DakWt5BmrRFsh8ztfs/image/${hash}/download`;
    const dest = path.join(targetDir, filename);
    const file = fs.createWriteStream(dest);

    const request = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (response) => {
      // Follow redirects if any
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            const stat = fs.statSync(dest);
            console.log(`✓ Downloaded ${filename} (${stat.size} bytes)`);
            resolve();
          });
        }).on('error', reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${filename}: status ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        const stat = fs.statSync(dest);
        console.log(`✓ Downloaded ${filename} (${stat.size} bytes)`);
        resolve();
      });
    });

    request.on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log(`Starting clean download of ${Object.keys(assets).length} authentic Figma assets...`);
  for (const [filename, hash] of Object.entries(assets)) {
    try {
      await downloadImage(filename, hash);
    } catch (err) {
      console.error(`✗ Error downloading ${filename}:`, err.message);
    }
  }
  console.log('Finished downloading all assets!');
}

run();
