import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const DOGS_DIR = path.join(projectRoot, 'src', 'assets', 'pets', 'dogs');
const CATS_DIR = path.join(projectRoot, 'src', 'assets', 'pets', 'cats');

// Mapping of breedFolder to Dog CEO endpoint or TheDogAPI ID
const DOG_BREED_API_MAP = {
  'Brittany Spaniel': ['spaniel/brittany'],
  'German Shepherd Dog': ['german/shepherd'],
  'Boxer': ['boxer'],
  'Golden Retriever': ['retriever/golden'],
  'Labrador Retriever': ['labrador'],
  'Beagle': ['beagle'],
  'French Bulldog': ['bulldog/french'],
  'Siberian Husky': ['husky'],
  'Pembroke Welsh Corgi': ['pembroke'],
  'Shiba Inu': ['shiba'],
  'Poodle': ['poodle/standard', 'poodle/miniature'],
  'Border Collie': ['collie/border'],
  'Dachshund': ['dachshund'],
  'Pomeranian': ['pomeranian'],
  'Samoyed': ['samoyed'],
  'Bernese Mountain Dog': ['mountain/bernese'],
  'Australian Shepherd': ['australian/shepherd'],
  'Cavalier King Charles Spaniel': ['spaniel/blenheim'],
  'Shih Tzu': ['shihtzu'],
  'Cocker Spaniel': ['spaniel/cocker'],
  'Boston Terrier': ['bulldog/boston'],
  'Pug': ['pug'],
  'Great Dane': ['dane/great'],
  'Doberman Pinscher': ['doberman'],
  'Akita': ['akita'],
  'Whippet': ['whippet'],
  'Jack Russell Terrier': ['terrier/russell'],
  'Basset Hound': ['hound/basset'],
  'Rottweiler': ['rottweiler'],
  'Singapore Special': [] // will use diverse rescue dog pool
};

// Mapping of cat breedFolder to TheCatAPI breed_ids
const CAT_BREED_API_MAP = {
  'British Shorthair': 'bsho',
  'Maine Coon': 'mcoo',
  'Persian': 'pers',
  'Siamese': 'siam',
  'Ragdoll': 'ragd',
  'Bengal': 'beng',
  'Scottish Fold': 'sfol',
  'Sphynx': 'sphy',
  'Abyssinian': 'abys',
  'Russian Blue': 'rblu',
  'American Shorthair': 'asho',
  'Norwegian Forest Cat': 'norw',
  'Birman': 'birm',
  'Bombay': 'bomb',
  'Turkish Van': 'tvan',
  'Devon Rex': 'drex',
  'Burmese': 'burm',
  'Chartreux': 'char',
  'Turkish Angora': 'tang',
  'American Bobtail': 'abob',
  'Singapore Community Cat': null // will use diverse community cat pool
};

// Global pools and caches to avoid fetching repeatedly
const usedUrls = new Set();
const usedHashes = new Set();
const dogBreedPools = new Map();
const catBreedPools = new Map();

async function getDogImagesForBreed(breedFolder) {
  if (dogBreedPools.has(breedFolder)) {
    return dogBreedPools.get(breedFolder);
  }

  const urls = [];
  const ceoPaths = DOG_BREED_API_MAP[breedFolder] || [];
  for (const p of ceoPaths) {
    try {
      const res = await fetch(`https://dog.ceo/api/breed/${p}/images`);
      const data = await res.json();
      if (data.status === 'success' && Array.isArray(data.message)) {
        urls.push(...data.message);
      }
    } catch (e) {}
  }

  dogBreedPools.set(breedFolder, urls);
  return urls;
}

async function getCatImagesForBreed(breedFolder) {
  if (catBreedPools.has(breedFolder)) {
    return catBreedPools.get(breedFolder);
  }

  const urls = [];
  const breedId = CAT_BREED_API_MAP[breedFolder];
  if (breedId) {
    try {
      const res = await fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}&limit=25`, {
        headers: { 'x-api-key': 'DEMO-API-KEY' }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        for (const item of data) {
          if (item.url && !item.url.endsWith('.gif')) {
            urls.push(item.url);
          }
        }
      }
    } catch (e) {}
  }

  catBreedPools.set(breedFolder, urls);
  return urls;
}

// Global fallback pools
let globalDogPool = [];
let globalCatPool = [];

async function initGlobalPools() {
  console.log('Fetching global fallback pools...');
  try {
    const r1 = await fetch('https://api.thedogapi.com/v1/images/search?limit=100', {
      headers: { 'x-api-key': 'DEMO-API-KEY' }
    });
    const d1 = await r1.json();
    if (Array.isArray(d1)) {
      globalDogPool = d1.map(x => x.url).filter(u => u && !u.endsWith('.gif'));
    }
  } catch (e) {}

  try {
    const r2 = await fetch('https://api.thecatapi.com/v1/images/search?limit=100', {
      headers: { 'x-api-key': 'DEMO-API-KEY' }
    });
    const d2 = await r2.json();
    if (Array.isArray(d2)) {
      globalCatPool = d2.map(x => x.url).filter(u => u && !u.endsWith('.gif'));
    }
  } catch (e) {}

  console.log(`Global pools ready: ${globalDogPool.length} dogs, ${globalCatPool.length} cats`);
}

async function fetchBufferWithHash(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'PetHeaven/1.0',
        'x-api-key': 'DEMO-API-KEY'
      }
    });
    if (!res.ok) return null;
    const arrayBuf = await res.arrayBuffer();
    const buf = Buffer.from(arrayBuf);
    if (buf.byteLength < 500) return null;
    const hash = crypto.createHash('md5').update(buf).digest('hex');
    return { buf, hash };
  } catch (e) {
    return null;
  }
}

// Find all existing pet files on disk
function getAllExistingPets(baseDir) {
  const result = [];
  for (const breed of fs.readdirSync(baseDir)) {
    const breedPath = path.join(baseDir, breed);
    if (fs.statSync(breedPath).isDirectory()) {
      for (const file of fs.readdirSync(breedPath)) {
        if (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')) {
          result.push({
            breed,
            filename: file,
            fullPath: path.join(breedPath, file)
          });
        }
      }
    }
  }
  return result;
}

async function processAllPets() {
  await initGlobalPools();

  const dogs = getAllExistingPets(DOGS_DIR);
  const cats = getAllExistingPets(CATS_DIR);
  console.log(`Processing ${dogs.length} dogs and ${cats.length} cats...`);

  // Process Dogs
  for (let i = 0; i < dogs.length; i++) {
    const pet = dogs[i];
    const petName = path.basename(pet.filename, path.extname(pet.filename));

    // Try current file if unique
    let currentValid = false;
    if (fs.existsSync(pet.fullPath)) {
      const currentBuf = fs.readFileSync(pet.fullPath);
      const currentHash = crypto.createHash('md5').update(currentBuf).digest('hex');
      if (!usedHashes.has(currentHash)) {
        usedHashes.add(currentHash);
        currentValid = true;
        console.log(`[Dog ${i + 1}/${dogs.length}] ${petName} (${pet.breed}): Kept unique image.`);
      }
    }

    if (!currentValid) {
      console.log(`[Dog ${i + 1}/${dogs.length}] ${petName} (${pet.breed}): Downloading distinct image...`);
      const breedPool = await getDogImagesForBreed(pet.breed);
      let replaced = false;

      // 1. Try breed-specific pool
      for (const url of breedPool) {
        if (usedUrls.has(url)) continue;
        usedUrls.add(url);
        const res = await fetchBufferWithHash(url);
        if (res && !usedHashes.has(res.hash)) {
          usedHashes.add(res.hash);
          fs.writeFileSync(pet.fullPath, res.buf);
          replaced = true;
          console.log(`  -> Saved unique breed image (${res.buf.byteLength} bytes)`);
          break;
        }
      }

      // 2. Try global pool if not replaced
      if (!replaced) {
        while (globalDogPool.length > 0) {
          const url = globalDogPool.pop();
          if (usedUrls.has(url)) continue;
          usedUrls.add(url);
          const res = await fetchBufferWithHash(url);
          if (res && !usedHashes.has(res.hash)) {
            usedHashes.add(res.hash);
            fs.writeFileSync(pet.fullPath, res.buf);
            replaced = true;
            console.log(`  -> Saved unique fallback dog image (${res.buf.byteLength} bytes)`);
            break;
          }
        }
      }
    }
  }

  // Process Cats
  for (let i = 0; i < cats.length; i++) {
    const pet = cats[i];
    const petName = path.basename(pet.filename, path.extname(pet.filename));

    // Try current file if unique
    let currentValid = false;
    if (fs.existsSync(pet.fullPath)) {
      const currentBuf = fs.readFileSync(pet.fullPath);
      const currentHash = crypto.createHash('md5').update(currentBuf).digest('hex');
      if (!usedHashes.has(currentHash)) {
        usedHashes.add(currentHash);
        currentValid = true;
        console.log(`[Cat ${i + 1}/${cats.length}] ${petName} (${pet.breed}): Kept unique image.`);
      }
    }

    if (!currentValid) {
      console.log(`[Cat ${i + 1}/${cats.length}] ${petName} (${pet.breed}): Downloading distinct image...`);
      const breedPool = await getCatImagesForBreed(pet.breed);
      let replaced = false;

      // 1. Try breed-specific pool
      for (const url of breedPool) {
        if (usedUrls.has(url)) continue;
        usedUrls.add(url);
        const res = await fetchBufferWithHash(url);
        if (res && !usedHashes.has(res.hash)) {
          usedHashes.add(res.hash);
          fs.writeFileSync(pet.fullPath, res.buf);
          replaced = true;
          console.log(`  -> Saved unique breed image (${res.buf.byteLength} bytes)`);
          break;
        }
      }

      // 2. Try global pool if not replaced
      if (!replaced) {
        while (globalCatPool.length > 0) {
          const url = globalCatPool.pop();
          if (usedUrls.has(url)) continue;
          usedUrls.add(url);
          const res = await fetchBufferWithHash(url);
          if (res && !usedHashes.has(res.hash)) {
            usedHashes.add(res.hash);
            fs.writeFileSync(pet.fullPath, res.buf);
            replaced = true;
            console.log(`  -> Saved unique fallback cat image (${res.buf.byteLength} bytes)`);
            break;
          }
        }
      }
    }
  }

  // Final verification
  console.log('\n--- VERIFICATION AUDIT ---');
  const allHashes = new Map();
  const duplicateList = [];

  function audit(baseDir) {
    for (const b of fs.readdirSync(baseDir)) {
      const bp = path.join(baseDir, b);
      if (fs.statSync(bp).isDirectory()) {
        for (const f of fs.readdirSync(bp)) {
          const fp = path.join(bp, f);
          const buf = fs.readFileSync(fp);
          const h = crypto.createHash('md5').update(buf).digest('hex');
          if (allHashes.has(h)) {
            duplicateList.push({ file1: allHashes.get(h), file2: fp });
          } else {
            allHashes.set(h, fp);
          }
        }
      }
    }
  }

  audit(DOGS_DIR);
  audit(CATS_DIR);

  console.log(`Total images scanned: ${allHashes.size + duplicateList.length}`);
  console.log(`Total unique image hashes: ${allHashes.size}`);
  console.log(`Total duplicate images detected: ${duplicateList.length}`);

  if (duplicateList.length === 0) {
    console.log('✅ SUCCESS: EVERY SINGLE PET CASE HAS A 100% UNIQUE IMAGE!');
  } else {
    console.error('❌ Duplicates found:', duplicateList);
  }
}

processAllPets().catch(console.error);
