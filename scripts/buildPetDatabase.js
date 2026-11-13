import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const PETS_DIR = path.join(projectRoot, 'src', 'assets', 'pets');
const DOGS_DIR = path.join(PETS_DIR, 'dogs');
const CATS_DIR = path.join(PETS_DIR, 'cats');
const DATA_FILE = path.join(projectRoot, 'src', 'data', 'petsData.js');

const SHELTERS = [
  { name: 'SPCA Singapore', location: 'Sungei Tengah, Singapore', dist: '0 miles away', outOfTown: false },
  { name: 'Causes for Animals Singapore (CAS)', location: 'Pasir Ris, Singapore', dist: '1.2 miles away', outOfTown: false },
  { name: 'Action for Singapore Dogs (ASD)', location: 'Lim Chu Kang, Singapore', dist: '2.5 miles away', outOfTown: false },
  { name: 'Cat Welfare Society (CWS)', location: 'Bishan, Singapore', dist: '0.8 miles away', outOfTown: false },
  { name: 'Save Our Street Dogs (SOSD)', location: 'Jurong Island, Singapore', dist: '3.1 miles away', outOfTown: false },
  { name: 'Oasis Second Chance Animal Shelter (OSCAS)', location: 'Sungei Tengah, Singapore', dist: '0.5 miles away', outOfTown: false },
  { name: 'Animal Lovers League (ALL)', location: 'Pasir Ris Farmway, Singapore', dist: '1.8 miles away', outOfTown: false },
  { name: 'Purely Adoptions', location: 'Tampines, Singapore', dist: '2.0 miles away', outOfTown: false },
  { name: 'Mercy Relief Haven', location: 'Yishun, Singapore', dist: '1.5 miles away', outOfTown: false },
  { name: 'Voices for Animals (VFA)', location: 'Toa Payoh, Singapore', dist: '1.1 miles away', outOfTown: false },
  { name: 'Kitten Sanctuary Singapore (KiSS)', location: 'Mountbatten, Singapore', dist: '2.8 miles away', outOfTown: false },
  { name: 'HOPE Dog Rescue', location: 'Bedok, Singapore', dist: '2.2 miles away', outOfTown: false },
  { name: 'Woodlands Companion Foster', location: 'Woodlands, Singapore', dist: '1.9 miles away', outOfTown: false },
  { name: 'Seletar Animal Sanctuary', location: 'Seletar, Singapore', dist: '2.1 miles away', outOfTown: false }
];

// Helper to sanitize folder and file names
function sanitizeName(name) {
  return name.replace(/[\\/:*?"<>|]/g, '_').trim();
}

async function downloadImage(url, destPath) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'PetHeavenApp/1.0',
        'x-api-key': 'DEMO-API-KEY'
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = await res.arrayBuffer();
    if (buffer.byteLength < 500) throw new Error('File too small or invalid');
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, Buffer.from(buffer));
    return true;
  } catch (err) {
    console.warn(`Failed to download ${url}: ${err.message}`);
    return false;
  }
}

// Generate the list of dog cases
const dogDefinitions = [
  // 1. Joey 7142 (Exact case from p1, p4, p5)
  {
    name: 'Joey 7142',
    breed: 'Brittany Spaniel & Labrador Retriever Mix',
    breedFolder: 'Brittany Spaniel',
    ageGroup: 'Young',
    ageDetail: 'Young (1-3 years)',
    gender: 'Male',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (26-60 lbs)',
    coatLength: 'Medium',
    color: 'Brown/Chocolate',
    houseTrained: 'Unknown',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs'],
    daysOnPlatform: 3,
    shelterIndex: 0,
    story: 'Just like his brother Chandler, Joey took a couple of minutes to adapt to the unique surroundings of buttercup blossoms but then he began to enjoy the freedom of the park with nonchalant candor. 7-month-old Joey is a handsome, quiet, easy-going canine who takes treats gently and is learning to walk contentedly on leash.',
    imageUrl: 'https://cdn2.thedogapi.com/images/HJgLVTaVX.jpg' // will fallback if needed
  },
  // 2. Zues (Exact case from p1)
  {
    name: 'Zues',
    breed: 'German Shepherd Dog',
    breedFolder: 'German Shepherd Dog',
    ageGroup: 'Adult',
    ageDetail: 'Adult (4 years)',
    gender: 'Male',
    sizeGroup: 'Large',
    sizeDetail: 'Large (61-100 lbs)',
    coatLength: 'Short',
    color: 'Brown/Chocolate',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Dogs'],
    daysOnPlatform: 7,
    shelterIndex: 2,
    story: 'Zues is a magnificent and noble German Shepherd who loves human companionship and outdoor agility games. He has undergone basic obedience training and will sit patiently waiting for a head pat or his favorite rubber ball.',
    imageUrl: ''
  },
  // 3. Flame (Exact case from p1)
  {
    name: 'Flame',
    breed: 'Boxer',
    breedFolder: 'Boxer',
    ageGroup: 'Young',
    ageDetail: 'Young (2 years)',
    gender: 'Female',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (26-60 lbs)',
    coatLength: 'Short',
    color: 'Brown/Chocolate',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs', 'Cats'],
    daysOnPlatform: 1,
    shelterIndex: 1,
    story: 'Flame has an energetic, bouncy personality that instantly brightens up any room. She loves zoomies in open yards and curls up like a donut right next to you during movie nights.',
    imageUrl: ''
  },
  // 4. Chandler (Brother of Joey, from p5 story)
  {
    name: 'Chandler',
    breed: 'Brittany Spaniel',
    breedFolder: 'Brittany Spaniel',
    ageGroup: 'Young',
    ageDetail: 'Young (1-3 years)',
    gender: 'Male',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (26-60 lbs)',
    coatLength: 'Medium',
    color: 'Brown/Chocolate',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs'],
    daysOnPlatform: 2,
    shelterIndex: 0,
    story: 'Chandler is Joey\'s observant brother. He loves sniffing around gardens and has a comical curiosity for butterflies and tennis balls. He is gentle, well-mannered, and eager to please.',
    imageUrl: ''
  },
  // 5. Golden Retriever - Sunny
  {
    name: 'Sunny',
    breed: 'Golden Retriever',
    breedFolder: 'Golden Retriever',
    ageGroup: 'Young',
    ageDetail: 'Young (1.5 years)',
    gender: 'Female',
    sizeGroup: 'Large',
    sizeDetail: 'Large (61-100 lbs)',
    coatLength: 'Long',
    color: 'Golden/Yellow',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs', 'Cats'],
    daysOnPlatform: 4,
    shelterIndex: 4,
    story: 'Sunny lives up to her name with her radiant smile and boundless warmth. She loves water puddles, fetching sticks, and resting her chin gently on your knees.',
    imageUrl: ''
  },
  // 6. Golden Retriever - Bailey
  {
    name: 'Bailey',
    breed: 'Golden Retriever',
    breedFolder: 'Golden Retriever',
    ageGroup: 'Adult',
    ageDetail: 'Adult (5 years)',
    gender: 'Male',
    sizeGroup: 'Large',
    sizeDetail: 'Large (61-100 lbs)',
    coatLength: 'Long',
    color: 'Golden/Yellow',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs'],
    daysOnPlatform: 12,
    shelterIndex: 5,
    story: 'Bailey is an old soul in a plush golden coat. He walks like a true gentleman on the leash and has an extraordinary knack for comforting people after long days.',
    imageUrl: ''
  },
  // 7. Labrador Retriever - Cooper
  {
    name: 'Cooper',
    breed: 'Labrador Retriever',
    breedFolder: 'Labrador Retriever',
    ageGroup: 'Puppy',
    ageDetail: 'Puppy (5 months)',
    gender: 'Male',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (26-60 lbs)',
    coatLength: 'Short',
    color: 'Black',
    houseTrained: 'No',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs', 'Cats'],
    daysOnPlatform: 1,
    shelterIndex: 6,
    story: 'Cooper is an adventurous black lab puppy who thinks every leaf is a toy. He is making great progress with potty training and loves puppy peanut butter treats.',
    imageUrl: ''
  },
  // 8. Labrador Retriever - Daisy
  {
    name: 'Daisy',
    breed: 'Labrador Retriever',
    breedFolder: 'Labrador Retriever',
    ageGroup: 'Adult',
    ageDetail: 'Adult (3 years)',
    gender: 'Female',
    sizeGroup: 'Large',
    sizeDetail: 'Large (61-100 lbs)',
    coatLength: 'Short',
    color: 'Golden/Yellow',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs'],
    daysOnPlatform: 15,
    shelterIndex: 0,
    story: 'Daisy is a sweet yellow lab who loves belly rubs and long afternoon walks under Singapore\'s shady park connectors. She gets along smoothly with kids of all ages.',
    imageUrl: ''
  },
  // 9. Beagle - Milo
  {
    name: 'Milo',
    breed: 'Beagle',
    breedFolder: 'Beagle',
    ageGroup: 'Young',
    ageDetail: 'Young (2 years)',
    gender: 'Male',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 25 lbs)',
    coatLength: 'Short',
    color: 'Tricolor',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs'],
    daysOnPlatform: 6,
    shelterIndex: 8,
    story: 'With his floppy ears and big expressive eyes, Milo will melt your heart in seconds. He possesses an unstoppable nose and enjoys scent-tracking games in the backyard.',
    imageUrl: ''
  },
  // 10. Beagle - Barney
  {
    name: 'Barney',
    breed: 'Beagle',
    breedFolder: 'Beagle',
    ageGroup: 'Senior',
    ageDetail: 'Senior (9 years)',
    gender: 'Male',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 25 lbs)',
    coatLength: 'Short',
    color: 'Tricolor',
    houseTrained: 'Yes',
    specialNeeds: true,
    goodWith: ['Dogs', 'Cats'],
    daysOnPlatform: 34,
    shelterIndex: 9,
    story: 'Barney is a dignified senior beagle looking for a peaceful retirement home. He takes mild arthritis medication and enjoys lazy sunbathing on cozy orthopedic beds.',
    imageUrl: ''
  },
  // 11. French Bulldog - Bruno
  {
    name: 'Bruno',
    breed: 'French Bulldog',
    breedFolder: 'French Bulldog',
    ageGroup: 'Young',
    ageDetail: 'Young (1.5 years)',
    gender: 'Male',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 25 lbs)',
    coatLength: 'Short',
    color: 'Bicolor',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs'],
    daysOnPlatform: 2,
    shelterIndex: 1,
    story: 'Bruno is a compact bundle of pure snuggles and bat-eared charm. He makes funny little snores when napping and adores sitting in laps.',
    imageUrl: ''
  },
  // 12. French Bulldog - Coco
  {
    name: 'Coco',
    breed: 'French Bulldog',
    breedFolder: 'French Bulldog',
    ageGroup: 'Adult',
    ageDetail: 'Adult (4 years)',
    gender: 'Female',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 25 lbs)',
    coatLength: 'Short',
    color: 'Cream',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs', 'Cats'],
    daysOnPlatform: 9,
    shelterIndex: 7,
    story: 'Coco is calm, affectionate, and thoroughly enjoys air-conditioned indoor lounging. She is well-socialized and greets everyone with a gentle wiggle.',
    imageUrl: ''
  },
  // 13. Siberian Husky - Ghost
  {
    name: 'Ghost',
    breed: 'Siberian Husky',
    breedFolder: 'Siberian Husky',
    ageGroup: 'Young',
    ageDetail: 'Young (2 years)',
    gender: 'Male',
    sizeGroup: 'Large',
    sizeDetail: 'Large (61-100 lbs)',
    coatLength: 'Medium',
    color: 'White',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Dogs'],
    daysOnPlatform: 5,
    shelterIndex: 2,
    story: 'Ghost has mesmerizing icy blue eyes and an endearing vocal singing style. He needs an active owner who loves jogging and hiking around nature reserves.',
    imageUrl: ''
  },
  // 14. Siberian Husky - Luna
  {
    name: 'Luna',
    breed: 'Siberian Husky',
    breedFolder: 'Siberian Husky',
    ageGroup: 'Adult',
    ageDetail: 'Adult (3 years)',
    gender: 'Female',
    sizeGroup: 'Large',
    sizeDetail: 'Large (61-100 lbs)',
    coatLength: 'Medium',
    color: 'Bicolor',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs'],
    daysOnPlatform: 18,
    shelterIndex: 4,
    story: 'Luna is a breathtaking husky with a plush silver-and-white coat. She loves human interaction, squeaky toys, and learning agility tricks.',
    imageUrl: ''
  },
  // 15. Corgi - Waffles
  {
    name: 'Waffles',
    breed: 'Pembroke Welsh Corgi',
    breedFolder: 'Pembroke Welsh Corgi',
    ageGroup: 'Young',
    ageDetail: 'Young (1 year)',
    gender: 'Male',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 25 lbs)',
    coatLength: 'Medium',
    color: 'Golden/Yellow',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs', 'Cats'],
    daysOnPlatform: 1,
    shelterIndex: 6,
    story: 'Waffles has the sweetest stubby legs and a heart full of mischief. He loves herding toys across the living room and trotting proudly beside you.',
    imageUrl: ''
  },
  // 16. Corgi - Biscuit
  {
    name: 'Biscuit',
    breed: 'Pembroke Welsh Corgi',
    breedFolder: 'Pembroke Welsh Corgi',
    ageGroup: 'Puppy',
    ageDetail: 'Puppy (6 months)',
    gender: 'Female',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 25 lbs)',
    coatLength: 'Medium',
    color: 'Tricolor',
    houseTrained: 'Unknown',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs'],
    daysOnPlatform: 2,
    shelterIndex: 3,
    story: 'Biscuit is a perky corgi pup who loves belly tickles and learning new obedience cues. Her tail wag is truly infectious.',
    imageUrl: ''
  },
  // 17. Shiba Inu - Hachi
  {
    name: 'Hachi',
    breed: 'Shiba Inu',
    breedFolder: 'Shiba Inu',
    ageGroup: 'Adult',
    ageDetail: 'Adult (3.5 years)',
    gender: 'Male',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 25 lbs)',
    coatLength: 'Short',
    color: 'Golden/Yellow',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Dogs'],
    daysOnPlatform: 11,
    shelterIndex: 5,
    story: 'Hachi is an impeccably clean, cat-like dog with a gorgeous fox-like appearance. He takes time to warm up to strangers, but once bonded, his loyalty is steadfast.',
    imageUrl: ''
  },
  // 18. Shiba Inu - Kiko
  {
    name: 'Kiko',
    breed: 'Shiba Inu',
    breedFolder: 'Shiba Inu',
    ageGroup: 'Young',
    ageDetail: 'Young (2 years)',
    gender: 'Female',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 25 lbs)',
    coatLength: 'Short',
    color: 'Black',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs'],
    daysOnPlatform: 8,
    shelterIndex: 1,
    story: 'Kiko is a rare black-and-tan Shiba with cheeky eyebrows. She loves playing fetch in enclosed dog parks and curling into a tight cinnamon roll when asleep.',
    imageUrl: ''
  },
  // 19. Poodle - Gigi
  {
    name: 'Gigi',
    breed: 'Poodle',
    breedFolder: 'Poodle',
    ageGroup: 'Young',
    ageDetail: 'Young (2 years)',
    gender: 'Female',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 25 lbs)',
    coatLength: 'Long',
    color: 'White',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs', 'Cats'],
    daysOnPlatform: 4,
    shelterIndex: 7,
    story: 'Gigi is an intelligent, hypoallergenic miniature poodle. She learns commands in record time and enjoys being dressed up in soft cotton tees.',
    imageUrl: ''
  },
  // 20. Poodle - Teddy
  {
    name: 'Teddy',
    breed: 'Poodle',
    breedFolder: 'Poodle',
    ageGroup: 'Adult',
    ageDetail: 'Adult (4 years)',
    gender: 'Male',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (26-60 lbs)',
    coatLength: 'Long',
    color: 'Brown/Chocolate',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs'],
    daysOnPlatform: 14,
    shelterIndex: 8,
    story: 'Teddy looks just like a walking teddy bear with his apricot-brown curls. He is gentle, emotionally intuitive, and great with first-time dog owners.',
    imageUrl: ''
  },
  // 21. Border Collie - Dash
  {
    name: 'Dash',
    breed: 'Border Collie',
    breedFolder: 'Border Collie',
    ageGroup: 'Young',
    ageDetail: 'Young (2 years)',
    gender: 'Male',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (26-60 lbs)',
    coatLength: 'Medium',
    color: 'Bicolor',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs'],
    daysOnPlatform: 3,
    shelterIndex: 2,
    story: 'Dash is razor-sharp and eager to work. He knows over 20 verbal commands and frisbee tricks. He will excel in a household that provides puzzle toys and mental stimulation.',
    imageUrl: ''
  },
  // 22. Border Collie - Skye
  {
    name: 'Skye',
    breed: 'Border Collie',
    breedFolder: 'Border Collie',
    ageGroup: 'Adult',
    ageDetail: 'Adult (3 years)',
    gender: 'Female',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (26-60 lbs)',
    coatLength: 'Medium',
    color: 'Tricolor',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Dogs'],
    daysOnPlatform: 16,
    shelterIndex: 0,
    story: 'Skye has striking blue merle markings and an attentive gaze. She enjoys agility tunnels and staying right alongside her handler during long scenic walks.',
    imageUrl: ''
  },
  // 23. Dachshund - Frankie
  {
    name: 'Frankie',
    breed: 'Dachshund',
    breedFolder: 'Dachshund',
    ageGroup: 'Young',
    ageDetail: 'Young (1.5 years)',
    gender: 'Male',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 25 lbs)',
    coatLength: 'Short',
    color: 'Brown/Chocolate',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs'],
    daysOnPlatform: 7,
    shelterIndex: 9,
    story: 'Frankie the miniature wiener dog is 10 pounds of pure courage and personality. He loves burrowing under fleece blankets and sunbathing on balcony rugs.',
    imageUrl: ''
  },
  // 24. Dachshund - Penny
  {
    name: 'Penny',
    breed: 'Dachshund',
    breedFolder: 'Dachshund',
    ageGroup: 'Adult',
    ageDetail: 'Adult (5 years)',
    gender: 'Female',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 25 lbs)',
    coatLength: 'Long',
    color: 'Black',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Cats', 'Dogs'],
    daysOnPlatform: 21,
    shelterIndex: 1,
    story: 'Penny is a long-haired miniature dachshund with flowing black-and-tan locks. She is quiet, well-behaved, and enjoys riding along in dog strollers.',
    imageUrl: ''
  },
  // 25. Pomeranian - Mochi
  {
    name: 'Mochi',
    breed: 'Pomeranian',
    breedFolder: 'Pomeranian',
    ageGroup: 'Puppy',
    ageDetail: 'Puppy (7 months)',
    gender: 'Female',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 25 lbs)',
    coatLength: 'Long',
    color: 'Cream',
    houseTrained: 'Unknown',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs', 'Cats'],
    daysOnPlatform: 2,
    shelterIndex: 7,
    story: 'Mochi is a fluffy cloud of joy who pirouettes on her hind legs when dinner time arrives. She is curious, friendly, and loves squeaker balls.',
    imageUrl: ''
  },
  // 26. Pomeranian - Popcorn
  {
    name: 'Popcorn',
    breed: 'Pomeranian',
    breedFolder: 'Pomeranian',
    ageGroup: 'Adult',
    ageDetail: 'Adult (3 years)',
    gender: 'Male',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 25 lbs)',
    coatLength: 'Long',
    color: 'Golden/Yellow',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs'],
    daysOnPlatform: 10,
    shelterIndex: 11,
    story: 'Popcorn is an alert little fellow who loves giving tiny hand kisses. He is great at leash walking and loves showing off his luxurious lion mane.',
    imageUrl: ''
  },
  // 27. Samoyed - Blizzard
  {
    name: 'Blizzard',
    breed: 'Samoyed',
    breedFolder: 'Samoyed',
    ageGroup: 'Young',
    ageDetail: 'Young (2 years)',
    gender: 'Male',
    sizeGroup: 'Large',
    sizeDetail: 'Large (61-100 lbs)',
    coatLength: 'Long',
    color: 'White',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs', 'Cats'],
    daysOnPlatform: 5,
    shelterIndex: 4,
    story: 'Famous for the trademark "Sammie smile", Blizzard brings happiness wherever he goes. He loves grooming sessions and playing in air-conditioned indoor dog runs.',
    imageUrl: ''
  },
  // 28. Bernese Mountain Dog - Moose
  {
    name: 'Moose',
    breed: 'Bernese Mountain Dog',
    breedFolder: 'Bernese Mountain Dog',
    ageGroup: 'Adult',
    ageDetail: 'Adult (4 years)',
    gender: 'Male',
    sizeGroup: 'Extra Large',
    sizeDetail: 'Extra Large (over 100 lbs)',
    coatLength: 'Long',
    color: 'Tricolor',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs'],
    daysOnPlatform: 13,
    shelterIndex: 6,
    story: 'Moose is a gentle giant with a peaceful demeanor. Despite his large stature, he steps very delicately around young children and loves quiet lean-in hugs.',
    imageUrl: ''
  },
  // 29. Australian Shepherd - Rusty
  {
    name: 'Rusty',
    breed: 'Australian Shepherd',
    breedFolder: 'Australian Shepherd',
    ageGroup: 'Young',
    ageDetail: 'Young (1.5 years)',
    gender: 'Male',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (26-60 lbs)',
    coatLength: 'Medium',
    color: 'Spotted/Tabby',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs'],
    daysOnPlatform: 4,
    shelterIndex: 0,
    story: 'Rusty has a stunning red merle coat with speckled copper points. He is super athletic, attentive, and loves tracking down tossed frisbees.',
    imageUrl: ''
  },
  // 30. Cavalier King Charles Spaniel - Charlie
  {
    name: 'Charlie',
    breed: 'Cavalier King Charles Spaniel',
    breedFolder: 'Cavalier King Charles Spaniel',
    ageGroup: 'Adult',
    ageDetail: 'Adult (3 years)',
    gender: 'Male',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 25 lbs)',
    coatLength: 'Medium',
    color: 'Bicolor',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs', 'Cats'],
    daysOnPlatform: 6,
    shelterIndex: 8,
    story: 'Charlie has silky chestnut and white fur and warm, soulful eyes. He is the ultimate lap companion and accompanies his human calmly from room to room.',
    imageUrl: ''
  },
  // 31. Shih Tzu - Cookie
  {
    name: 'Cookie',
    breed: 'Shih Tzu',
    breedFolder: 'Shih Tzu',
    ageGroup: 'Senior',
    ageDetail: 'Senior (8 years)',
    gender: 'Female',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 25 lbs)',
    coatLength: 'Long',
    color: 'Bicolor',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs', 'Cats'],
    daysOnPlatform: 24,
    shelterIndex: 9,
    story: 'Cookie is a gentle lap sweetheart who loves having her hair combed with pretty ribbons. She is content with short strolls and lots of cuddle time.',
    imageUrl: ''
  },
  // 32. Cocker Spaniel - Lady
  {
    name: 'Lady',
    breed: 'Cocker Spaniel',
    breedFolder: 'Cocker Spaniel',
    ageGroup: 'Young',
    ageDetail: 'Young (2 years)',
    gender: 'Female',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (26-60 lbs)',
    coatLength: 'Medium',
    color: 'Golden/Yellow',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs'],
    daysOnPlatform: 8,
    shelterIndex: 1,
    story: 'Lady is as graceful and sweet as her name suggests. She has lush honey-colored ears and loves paddling in shallow water tubs on warm mornings.',
    imageUrl: ''
  },
  // 33. Boston Terrier - Pixel
  {
    name: 'Pixel',
    breed: 'Boston Terrier',
    breedFolder: 'Boston Terrier',
    ageGroup: 'Puppy',
    ageDetail: 'Puppy (8 months)',
    gender: 'Male',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 25 lbs)',
    coatLength: 'Short',
    color: 'Bicolor',
    houseTrained: 'Unknown',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs'],
    daysOnPlatform: 1,
    shelterIndex: 7,
    story: 'Pixel sports a dapper "tuxedo" jacket and is full of playful curiosity. He loves chasing feather wands and making friends with everyone he meets.',
    imageUrl: ''
  },
  // 34. Pug - Barnaby
  {
    name: 'Barnaby',
    breed: 'Pug',
    breedFolder: 'Pug',
    ageGroup: 'Adult',
    ageDetail: 'Adult (4 years)',
    gender: 'Male',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 25 lbs)',
    coatLength: 'Short',
    color: 'Cream',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs', 'Cats'],
    daysOnPlatform: 11,
    shelterIndex: 5,
    story: 'Barnaby is a comical pug with a wrinkled brow and curly tail. He is a master of humorous head-tilts whenever you ask him if he wants a treat.',
    imageUrl: ''
  },
  // 35. Great Dane - Apollo
  {
    name: 'Apollo',
    breed: 'Great Dane',
    breedFolder: 'Great Dane',
    ageGroup: 'Young',
    ageDetail: 'Young (2.5 years)',
    gender: 'Male',
    sizeGroup: 'Extra Large',
    sizeDetail: 'Extra Large (over 100 lbs)',
    coatLength: 'Short',
    color: 'Gray/Silver',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs'],
    daysOnPlatform: 17,
    shelterIndex: 2,
    story: 'Apollo is a gentle giant who thinks he weighs ten pounds. He loves leaning against your legs and receiving long ear massages.',
    imageUrl: ''
  },
  // 36. Doberman Pinscher - Duke
  {
    name: 'Duke',
    breed: 'Doberman Pinscher',
    breedFolder: 'Doberman Pinscher',
    ageGroup: 'Adult',
    ageDetail: 'Adult (3 years)',
    gender: 'Male',
    sizeGroup: 'Large',
    sizeDetail: 'Large (61-100 lbs)',
    coatLength: 'Short',
    color: 'Black',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Dogs'],
    daysOnPlatform: 9,
    shelterIndex: 4,
    story: 'Duke is an athletic and loyal guardian with a glossy black-and-rust coat. He is very responsive to clicker training and forms deep bonds with his human companions.',
    imageUrl: ''
  },
  // 37. Akita - Taro
  {
    name: 'Taro',
    breed: 'Akita',
    breedFolder: 'Akita',
    ageGroup: 'Adult',
    ageDetail: 'Adult (4 years)',
    gender: 'Male',
    sizeGroup: 'Large',
    sizeDetail: 'Large (61-100 lbs)',
    coatLength: 'Medium',
    color: 'Bicolor',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids'],
    daysOnPlatform: 20,
    shelterIndex: 2,
    story: 'Taro carries an aura of quiet dignity. He is calm and observant in public, standing proud and keeping a watchful, protective eye over his family.',
    imageUrl: ''
  },
  // 38. Whippet - Comet
  {
    name: 'Comet',
    breed: 'Whippet',
    breedFolder: 'Whippet',
    ageGroup: 'Young',
    ageDetail: 'Young (2 years)',
    gender: 'Female',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (26-60 lbs)',
    coatLength: 'Short',
    color: 'Gray/Silver',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Dogs', 'Cats'],
    daysOnPlatform: 6,
    shelterIndex: 0,
    story: 'Comet is lightning fast in the dog yard, but once inside, she turns into the world\'s biggest couch potato. She loves fleece blankets and sunny windowsills.',
    imageUrl: ''
  },
  // 39. Jack Russell Terrier - Sparky
  {
    name: 'Sparky',
    breed: 'Jack Russell Terrier',
    breedFolder: 'Jack Russell Terrier',
    ageGroup: 'Adult',
    ageDetail: 'Adult (3 years)',
    gender: 'Male',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 25 lbs)',
    coatLength: 'Short',
    color: 'White',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs'],
    daysOnPlatform: 10,
    shelterIndex: 8,
    story: 'Sparky has an exuberant spirit and lightning-quick agility. He loves agility obstacle courses, fetch sessions, and discovering buried toys.',
    imageUrl: ''
  },
  // 40. Basset Hound - Copper
  {
    name: 'Copper',
    breed: 'Basset Hound',
    breedFolder: 'Basset Hound',
    ageGroup: 'Adult',
    ageDetail: 'Adult (5 years)',
    gender: 'Male',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (26-60 lbs)',
    coatLength: 'Short',
    color: 'Tricolor',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs', 'Cats'],
    daysOnPlatform: 23,
    shelterIndex: 9,
    story: 'Copper has velvety long ears and a soulful hound bay. He enjoys meandering neighborhood sniff-walks followed by long naps on the porch.',
    imageUrl: ''
  },
  // 41. Singapore Special - Kopi (Local breed)
  {
    name: 'Kopi',
    breed: 'Singapore Special (Local Crossbreed)',
    breedFolder: 'Singapore Special',
    ageGroup: 'Young',
    ageDetail: 'Young (1.5 years)',
    gender: 'Male',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (26-60 lbs)',
    coatLength: 'Short',
    color: 'Brown/Chocolate',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs'],
    daysOnPlatform: 2,
    shelterIndex: 0,
    story: 'Rescued from an industrial area, Kopi has blossomed into a joyful, trusting companion. He loves nature walks at Coney Island and learning positive reinforcement cues.',
    imageUrl: ''
  },
  // 42. Singapore Special - Teh-O (Local breed)
  {
    name: 'Teh-O',
    breed: 'Singapore Special (Local Crossbreed)',
    breedFolder: 'Singapore Special',
    ageGroup: 'Puppy',
    ageDetail: 'Puppy (4 months)',
    gender: 'Female',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 25 lbs)',
    coatLength: 'Short',
    color: 'Black',
    houseTrained: 'Unknown',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs', 'Cats'],
    daysOnPlatform: 1,
    shelterIndex: 4,
    story: 'Teh-O is an inquisitive black puppy with pointy radar ears and high intelligence. She loves solving food puzzles and tumbling on grass.',
    imageUrl: ''
  },
  // 43. Singapore Special - Pandan
  {
    name: 'Pandan',
    breed: 'Singapore Special (Local Crossbreed)',
    breedFolder: 'Singapore Special',
    ageGroup: 'Adult',
    ageDetail: 'Adult (3 years)',
    gender: 'Female',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (26-60 lbs)',
    coatLength: 'Short',
    color: 'Golden/Yellow',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs'],
    daysOnPlatform: 15,
    shelterIndex: 2,
    story: 'Pandan is a calm fawn-colored Singapore Special who loves companionship. She walks gracefully on harness and enjoys gentle ear rubs.',
    imageUrl: ''
  },
  // 44. Singapore Special - Milo Dinosaur
  {
    name: 'Milo Dinosaur',
    breed: 'Singapore Special (Local Crossbreed)',
    breedFolder: 'Singapore Special',
    ageGroup: 'Adult',
    ageDetail: 'Adult (4 years)',
    gender: 'Male',
    sizeGroup: 'Large',
    sizeDetail: 'Large (61-100 lbs)',
    coatLength: 'Short',
    color: 'Brown/Chocolate',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Dogs'],
    daysOnPlatform: 28,
    shelterIndex: 5,
    story: 'Milo Dinosaur is a sweet-natured boy who loves splash pools on warm afternoons. He is patient, quiet at home, and loves chew toys.',
    imageUrl: ''
  },
  // 45. Singapore Special - Singa
  {
    name: 'Singa',
    breed: 'Singapore Special (Local Crossbreed)',
    breedFolder: 'Singapore Special',
    ageGroup: 'Senior',
    ageDetail: 'Senior (10 years)',
    gender: 'Male',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (26-60 lbs)',
    coatLength: 'Short',
    color: 'White',
    houseTrained: 'Yes',
    specialNeeds: true,
    goodWith: ['Kids', 'Dogs'],
    daysOnPlatform: 42,
    shelterIndex: 6,
    story: 'Singa is a gentle senior who has spent years in the shelter. He is calm, completely housebroken, and dreams of having a soft carpet to spend his golden years on.',
    imageUrl: ''
  },
  // 46. Rottweiler - Diesel
  {
    name: 'Diesel',
    breed: 'Rottweiler',
    breedFolder: 'Rottweiler',
    ageGroup: 'Adult',
    ageDetail: 'Adult (3 years)',
    gender: 'Male',
    sizeGroup: 'Large',
    sizeDetail: 'Large (61-100 lbs)',
    coatLength: 'Short',
    color: 'Black',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Dogs'],
    daysOnPlatform: 11,
    shelterIndex: 2,
    story: 'Diesel is a big softie underneath his strong exterior. He loves leaning his head against you for scritches and enjoys playing tug-of-war.',
    imageUrl: ''
  },
  // 47. Beagle - Copper Jr.
  {
    name: 'Copper Jr.',
    breed: 'Beagle',
    breedFolder: 'Beagle',
    ageGroup: 'Puppy',
    ageDetail: 'Puppy (3 months)',
    gender: 'Male',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 25 lbs)',
    coatLength: 'Short',
    color: 'Tricolor',
    houseTrained: 'Unknown',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs', 'Cats'],
    daysOnPlatform: 1,
    shelterIndex: 1,
    story: 'Copper Jr. is a lively pup who explores everything with joyous hound energy. He loves cuddling in puppy piles and chewing rubber teething toys.',
    imageUrl: ''
  },
  // 48. Golden Retriever - Archie
  {
    name: 'Archie',
    breed: 'Golden Retriever',
    breedFolder: 'Golden Retriever',
    ageGroup: 'Puppy',
    ageDetail: 'Puppy (5 months)',
    gender: 'Male',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (26-60 lbs)',
    coatLength: 'Long',
    color: 'Golden/Yellow',
    houseTrained: 'No',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs', 'Cats'],
    daysOnPlatform: 3,
    shelterIndex: 0,
    story: 'Archie is curious, loving, and learning his puppy manners with flying colors. He will bring joy to any active family with plenty of play time.',
    imageUrl: ''
  },
  // 49. German Shepherd - Rex
  {
    name: 'Rex',
    breed: 'German Shepherd Dog',
    breedFolder: 'German Shepherd Dog',
    ageGroup: 'Young',
    ageDetail: 'Young (2 years)',
    gender: 'Male',
    sizeGroup: 'Large',
    sizeDetail: 'Large (61-100 lbs)',
    coatLength: 'Short',
    color: 'Black',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs'],
    daysOnPlatform: 7,
    shelterIndex: 4,
    story: 'Rex is an eager student who thrives when given tasks and mental puzzles. He bonds closely with his handler and loves trail running.',
    imageUrl: ''
  },
  // 50. Boxer - Buster
  {
    name: 'Buster',
    breed: 'Boxer',
    breedFolder: 'Boxer',
    ageGroup: 'Adult',
    ageDetail: 'Adult (4 years)',
    gender: 'Male',
    sizeGroup: 'Large',
    sizeDetail: 'Large (61-100 lbs)',
    coatLength: 'Short',
    color: 'Brown/Chocolate',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs'],
    daysOnPlatform: 19,
    shelterIndex: 1,
    story: 'Buster has an infectious smile and loves greeting his caretakers with happy full-body wiggles. He is playful, affectionate, and loyal.',
    imageUrl: ''
  },
  // 51. Foster dog: Bella
  {
    name: 'Bella',
    breed: 'Labrador Retriever',
    breedFolder: 'Labrador Retriever',
    ageGroup: 'Adult',
    ageDetail: 'Adult (3 years)',
    gender: 'Female',
    sizeGroup: 'Large',
    sizeDetail: 'Large (61-100 lbs)',
    coatLength: 'Short',
    color: 'Brown/Chocolate',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs', 'Cats'],
    daysOnPlatform: 5,
    shelterIndex: 12,
    story: 'Bella is currently staying with our dedicated foster network in Woodlands, Singapore. She is gentle, travels comfortably in cars, and is ready for adoption into a loving home.',
    imageUrl: ''
  },
  // 52. Sanctuary dog: Max
  {
    name: 'Max',
    breed: 'Siberian Husky',
    breedFolder: 'Siberian Husky',
    ageGroup: 'Young',
    ageDetail: 'Young (1.5 years)',
    gender: 'Male',
    sizeGroup: 'Large',
    sizeDetail: 'Large (61-100 lbs)',
    coatLength: 'Medium',
    color: 'Gray/Silver',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Dogs'],
    daysOnPlatform: 9,
    shelterIndex: 13,
    story: 'Max is being nurtured at our local sanctuary in Seletar, Singapore. He is playful, loves playing with other dogs, and has full health clearance for adoption.',
    imageUrl: ''
  },
  // 53. Poodle - Ollie
  {
    name: 'Ollie',
    breed: 'Poodle',
    breedFolder: 'Poodle',
    ageGroup: 'Senior',
    ageDetail: 'Senior (9 years)',
    gender: 'Male',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 25 lbs)',
    coatLength: 'Long',
    color: 'White',
    houseTrained: 'Yes',
    specialNeeds: true,
    goodWith: ['Dogs', 'Cats'],
    daysOnPlatform: 38,
    shelterIndex: 7,
    story: 'Ollie is a calm senior poodle who enjoys quiet companionship and curling up beside your desk during work hours. He has mild cataracts but navigates familiar spaces easily.',
    imageUrl: ''
  },
  // 54. Shih Tzu - Toby
  {
    name: 'Toby',
    breed: 'Shih Tzu',
    breedFolder: 'Shih Tzu',
    ageGroup: 'Young',
    ageDetail: 'Young (2 years)',
    gender: 'Male',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 25 lbs)',
    coatLength: 'Long',
    color: 'Golden/Yellow',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs'],
    daysOnPlatform: 4,
    shelterIndex: 9,
    story: 'Toby is a perky little companion with a silky honey coat. He loves exploring potted garden balconies and snoozing on velvet cushions.',
    imageUrl: ''
  },
  // 55. Singapore Special - Sandy
  {
    name: 'Sandy',
    breed: 'Singapore Special (Local Crossbreed)',
    breedFolder: 'Singapore Special',
    ageGroup: 'Young',
    ageDetail: 'Young (1 year)',
    gender: 'Female',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (26-60 lbs)',
    coatLength: 'Short',
    color: 'Golden/Yellow',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Dogs', 'Cats'],
    daysOnPlatform: 2,
    shelterIndex: 3,
    story: 'Sandy has an exceptionally sweet temperament. She was rescued as a puppy and raised in foster care, making her very accustomed to home environments.',
    imageUrl: ''
  }
];

// Generate the list of cat cases
const catDefinitions = [
  // 1. British Shorthair - Milo
  {
    name: 'Milo',
    breed: 'British Shorthair',
    breedFolder: 'British Shorthair',
    ageGroup: 'Young',
    ageDetail: 'Young (2 years)',
    gender: 'Male',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (9-15 lbs)',
    coatLength: 'Short',
    color: 'Gray/Silver',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats'],
    daysOnPlatform: 2,
    shelterIndex: 3,
    story: 'Milo has the quintessential round British Shorthair cheeks and a plush blue coat. He is serene, undemanding, and loves sitting nearby like an adorable velvet paperweight.',
    imageUrl: ''
  },
  // 2. British Shorthair - Luna
  {
    name: 'Luna',
    breed: 'British Shorthair',
    breedFolder: 'British Shorthair',
    ageGroup: 'Adult',
    ageDetail: 'Adult (3 years)',
    gender: 'Female',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (9-15 lbs)',
    coatLength: 'Short',
    color: 'White',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats', 'Dogs'],
    daysOnPlatform: 6,
    shelterIndex: 10,
    story: 'Luna is a gorgeous lilac-white British Shorthair with amber eyes. She enjoys watching birds from screened windows and enjoys chin scratches before bedtime.',
    imageUrl: ''
  },
  // 3. Maine Coon - Leo
  {
    name: 'Leo',
    breed: 'Maine Coon',
    breedFolder: 'Maine Coon',
    ageGroup: 'Adult',
    ageDetail: 'Adult (4 years)',
    gender: 'Male',
    sizeGroup: 'Large',
    sizeDetail: 'Large (15-25 lbs)',
    coatLength: 'Long',
    color: 'Brown/Chocolate',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats', 'Dogs'],
    daysOnPlatform: 4,
    shelterIndex: 0,
    story: 'Leo is a gentle giant with tufted lynx ears and a magnificent bushy tail. He chirps when excited and loves playing with running water from bathroom sinks.',
    imageUrl: ''
  },
  // 4. Maine Coon - Thor
  {
    name: 'Thor',
    breed: 'Maine Coon',
    breedFolder: 'Maine Coon',
    ageGroup: 'Young',
    ageDetail: 'Young (1.5 years)',
    gender: 'Male',
    sizeGroup: 'Large',
    sizeDetail: 'Large (15-25 lbs)',
    coatLength: 'Long',
    color: 'Golden/Yellow',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Cats', 'Dogs'],
    daysOnPlatform: 8,
    shelterIndex: 1,
    story: 'Thor has a glorious ginger tabby coat and a very affectionate disposition. He greets you at the door with soft trills and loves curling up at the foot of the bed.',
    imageUrl: ''
  },
  // 5. Persian - Snowball
  {
    name: 'Snowball',
    breed: 'Persian',
    breedFolder: 'Persian',
    ageGroup: 'Adult',
    ageDetail: 'Adult (5 years)',
    gender: 'Female',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (9-15 lbs)',
    coatLength: 'Long',
    color: 'White',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Cats'],
    daysOnPlatform: 14,
    shelterIndex: 7,
    story: 'Snowball is a regal white Persian with silky fur. She enjoys a peaceful home environment, daily brushing, and basking in morning sunlight.',
    imageUrl: ''
  },
  // 6. Persian - Casper
  {
    name: 'Casper',
    breed: 'Persian',
    breedFolder: 'Persian',
    ageGroup: 'Senior',
    ageDetail: 'Senior (8 years)',
    gender: 'Male',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (9-15 lbs)',
    coatLength: 'Long',
    color: 'Cream',
    houseTrained: 'Yes',
    specialNeeds: true,
    goodWith: ['Kids', 'Cats'],
    daysOnPlatform: 29,
    shelterIndex: 9,
    story: 'Casper is an easy-going senior who loves lap naps and being gently groomed. He requires daily eye wipes and enjoys a peaceful, quiet household.',
    imageUrl: ''
  },
  // 7. Siamese - Cleo
  {
    name: 'Cleo',
    breed: 'Siamese',
    breedFolder: 'Siamese',
    ageGroup: 'Young',
    ageDetail: 'Young (1 year)',
    gender: 'Female',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 8 lbs)',
    coatLength: 'Short',
    color: 'Cream',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats'],
    daysOnPlatform: 1,
    shelterIndex: 3,
    story: 'Cleo has deep sapphire eyes and dark seal points. She is very vocal, conversational, and will gladly narrate her daily adventures to anyone who listens.',
    imageUrl: ''
  },
  // 8. Siamese - Simba
  {
    name: 'Simba',
    breed: 'Siamese',
    breedFolder: 'Siamese',
    ageGroup: 'Adult',
    ageDetail: 'Adult (3 years)',
    gender: 'Male',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (9-15 lbs)',
    coatLength: 'Short',
    color: 'Brown/Chocolate',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Cats', 'Dogs'],
    daysOnPlatform: 10,
    shelterIndex: 10,
    story: 'Simba is an agile, sleek boy who loves perching on high cat trees. He loves laser pointer sessions and sleeping under warm duvet covers.',
    imageUrl: ''
  },
  // 9. Ragdoll - Bella
  {
    name: 'Bella',
    breed: 'Ragdoll',
    breedFolder: 'Ragdoll',
    ageGroup: 'Young',
    ageDetail: 'Young (2 years)',
    gender: 'Female',
    sizeGroup: 'Large',
    sizeDetail: 'Large (15-25 lbs)',
    coatLength: 'Long',
    color: 'Bicolor',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats', 'Dogs'],
    daysOnPlatform: 3,
    shelterIndex: 0,
    story: 'True to her breed, Bella goes limp with happiness when held in your arms. She is exceptionally gentle, making her ideal for families with young children.',
    imageUrl: ''
  },
  // 10. Ragdoll - Cloud
  {
    name: 'Cloud',
    breed: 'Ragdoll',
    breedFolder: 'Ragdoll',
    ageGroup: 'Puppy', // Kitten
    ageDetail: 'Kitten (6 months)',
    gender: 'Male',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 8 lbs)',
    coatLength: 'Long',
    color: 'Bicolor',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats', 'Dogs'],
    daysOnPlatform: 1,
    shelterIndex: 8,
    story: 'Cloud is a fluffy bundle of innocence with stunning sky-blue eyes. He follows his foster parents from room to room, purring the entire time.',
    imageUrl: ''
  },
  // 11. Bengal - Tiger
  {
    name: 'Tiger',
    breed: 'Bengal',
    breedFolder: 'Bengal',
    ageGroup: 'Young',
    ageDetail: 'Young (1.5 years)',
    gender: 'Male',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (9-15 lbs)',
    coatLength: 'Short',
    color: 'Spotted/Tabby',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Dogs', 'Cats'],
    daysOnPlatform: 5,
    shelterIndex: 2,
    story: 'Tiger has breathtaking rosette markings and a glittering golden coat. He loves cat exercise wheels, harness walking, and playing with ice cubes.',
    imageUrl: ''
  },
  // 12. Bengal - Zara
  {
    name: 'Zara',
    breed: 'Bengal',
    breedFolder: 'Bengal',
    ageGroup: 'Adult',
    ageDetail: 'Adult (3 years)',
    gender: 'Female',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (9-15 lbs)',
    coatLength: 'Short',
    color: 'Spotted/Tabby',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Cats'],
    daysOnPlatform: 16,
    shelterIndex: 4,
    story: 'Zara is sleek, athletic, and inquisitive. She loves climbing ceiling cat bridges and enjoys learning target-stick training with salmon treats.',
    imageUrl: ''
  },
  // 13. Scottish Fold - Momo
  {
    name: 'Momo',
    breed: 'Scottish Fold',
    breedFolder: 'Scottish Fold',
    ageGroup: 'Young',
    ageDetail: 'Young (2 years)',
    gender: 'Male',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (9-15 lbs)',
    coatLength: 'Short',
    color: 'Golden/Yellow',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats'],
    daysOnPlatform: 4,
    shelterIndex: 10,
    story: 'Momo has adorable folded ears and often sits like a tiny human with his paws on his belly. He is calm, affectionate, and loves cardboard boxes.',
    imageUrl: ''
  },
  // 14. Scottish Fold - Tofu
  {
    name: 'Tofu',
    breed: 'Scottish Fold',
    breedFolder: 'Scottish Fold',
    ageGroup: 'Kitten',
    ageDetail: 'Kitten (5 months)',
    gender: 'Female',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 8 lbs)',
    coatLength: 'Short',
    color: 'White',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats', 'Dogs'],
    daysOnPlatform: 2,
    shelterIndex: 3,
    story: 'Tofu is a tiny snowball of wonder. She loves chasing crinkle balls and taking afternoon naps inside laundry baskets.',
    imageUrl: ''
  },
  // 15. Sphynx - Pharaoh
  {
    name: 'Pharaoh',
    breed: 'Sphynx',
    breedFolder: 'Sphynx',
    ageGroup: 'Young',
    ageDetail: 'Young (2 years)',
    gender: 'Male',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (9-15 lbs)',
    coatLength: 'Hairless',
    color: 'Gray/Silver',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats', 'Dogs'],
    daysOnPlatform: 7,
    shelterIndex: 7,
    story: 'Pharaoh is a hairless cuddle-bug who feels like a warm suede peach. He loves wearing cozy fleece sweaters and snuggling under your shirt collar.',
    imageUrl: ''
  },
  // 16. Sphynx - Cleo II
  {
    name: 'Yoda',
    breed: 'Sphynx',
    breedFolder: 'Sphynx',
    ageGroup: 'Adult',
    ageDetail: 'Adult (4 years)',
    gender: 'Female',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 8 lbs)',
    coatLength: 'Hairless',
    color: 'Cream',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Cats', 'Dogs'],
    daysOnPlatform: 13,
    shelterIndex: 1,
    story: 'Yoda has oversized bat ears and endless affection. She loves sunbathing on warm heat pads and greets you with eager head-bumps.',
    imageUrl: ''
  },
  // 17. Abyssinian - Amber
  {
    name: 'Amber',
    breed: 'Abyssinian',
    breedFolder: 'Abyssinian',
    ageGroup: 'Young',
    ageDetail: 'Young (1.5 years)',
    gender: 'Female',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 8 lbs)',
    coatLength: 'Short',
    color: 'Golden/Yellow',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats'],
    daysOnPlatform: 3,
    shelterIndex: 0,
    story: 'Amber has a rich ruddy agouti coat that sparkles in the light. She is curious, acrobatic, and loves perching on your shoulder while you work.',
    imageUrl: ''
  },
  // 18. Abyssinian - Phoenix
  {
    name: 'Phoenix',
    breed: 'Abyssinian',
    breedFolder: 'Abyssinian',
    ageGroup: 'Adult',
    ageDetail: 'Adult (3 years)',
    gender: 'Male',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (9-15 lbs)',
    coatLength: 'Short',
    color: 'Brown/Chocolate',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Cats', 'Dogs'],
    daysOnPlatform: 11,
    shelterIndex: 5,
    story: 'Phoenix is a graceful athlete who moves with effortless elegance. He loves interactive feather wands and watching birds outside.',
    imageUrl: ''
  },
  // 19. Russian Blue - Silver
  {
    name: 'Silver',
    breed: 'Russian Blue',
    breedFolder: 'Russian Blue',
    ageGroup: 'Adult',
    ageDetail: 'Adult (3 years)',
    gender: 'Male',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (9-15 lbs)',
    coatLength: 'Short',
    color: 'Gray/Silver',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats'],
    daysOnPlatform: 8,
    shelterIndex: 3,
    story: 'Silver has shimmering silvery-blue fur and emerald green eyes. He has a gentle temperament and forms a very sweet, devoted relationship with his family.',
    imageUrl: ''
  },
  // 20. Russian Blue - Velvet
  {
    name: 'Velvet',
    breed: 'Russian Blue',
    breedFolder: 'Russian Blue',
    ageGroup: 'Young',
    ageDetail: 'Young (1 year)',
    gender: 'Female',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 8 lbs)',
    coatLength: 'Short',
    color: 'Gray/Silver',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Cats'],
    daysOnPlatform: 2,
    shelterIndex: 10,
    story: 'Velvet is shy at first, but once you earn her trust, she will curl up beside you and purr like a tiny motorboat.',
    imageUrl: ''
  },
  // 21. American Shorthair - Felix
  {
    name: 'Felix',
    breed: 'American Shorthair',
    breedFolder: 'American Shorthair',
    ageGroup: 'Adult',
    ageDetail: 'Adult (4 years)',
    gender: 'Male',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (9-15 lbs)',
    coatLength: 'Short',
    color: 'Spotted/Tabby',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats', 'Dogs'],
    daysOnPlatform: 15,
    shelterIndex: 1,
    story: 'Felix is a classic silver tabby with bold swirl patterns. He is robust, playful, and loves chasing catnip mice across wooden floors.',
    imageUrl: ''
  },
  // 22. American Shorthair - Domino
  {
    name: 'Domino',
    breed: 'American Shorthair',
    breedFolder: 'American Shorthair',
    ageGroup: 'Young',
    ageDetail: 'Young (2 years)',
    gender: 'Female',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (9-15 lbs)',
    coatLength: 'Short',
    color: 'Bicolor',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats'],
    daysOnPlatform: 6,
    shelterIndex: 8,
    story: 'Domino is a charming tuxedo kitty who loves supervising kitchen cooking and curling up on fresh laundry.',
    imageUrl: ''
  },
  // 23. Norwegian Forest Cat - Freya
  {
    name: 'Freya',
    breed: 'Norwegian Forest Cat',
    breedFolder: 'Norwegian Forest Cat',
    ageGroup: 'Adult',
    ageDetail: 'Adult (3.5 years)',
    gender: 'Female',
    sizeGroup: 'Large',
    sizeDetail: 'Large (15-25 lbs)',
    coatLength: 'Long',
    color: 'Tricolor',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Cats', 'Dogs'],
    daysOnPlatform: 12,
    shelterIndex: 6,
    story: 'Freya has a weather-resistant double coat and an adventurous climbing spirit. She loves sturdy tall scratching posts and watching geckos outside.',
    imageUrl: ''
  },
  // 24. Norwegian Forest Cat - Loki
  {
    name: 'Loki',
    breed: 'Norwegian Forest Cat',
    breedFolder: 'Norwegian Forest Cat',
    ageGroup: 'Young',
    ageDetail: 'Young (2 years)',
    gender: 'Male',
    sizeGroup: 'Large',
    sizeDetail: 'Large (15-25 lbs)',
    coatLength: 'Long',
    color: 'Brown/Chocolate',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats'],
    daysOnPlatform: 9,
    shelterIndex: 0,
    story: 'Loki is a big teddy-bear cat with tufted paws and an easygoing heart. He gets along with everyone and loves gentle belly combings.',
    imageUrl: ''
  },
  // 25. Birman - Maya
  {
    name: 'Maya',
    breed: 'Birman',
    breedFolder: 'Birman',
    ageGroup: 'Young',
    ageDetail: 'Young (1.5 years)',
    gender: 'Female',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (9-15 lbs)',
    coatLength: 'Long',
    color: 'White',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats'],
    daysOnPlatform: 4,
    shelterIndex: 10,
    story: 'Maya has pure white gloves on all four paws and hypnotic blue eyes. She is exceptionally soft-spoken, loving, and patient.',
    imageUrl: ''
  },
  // 26. Bombay - Midnight
  {
    name: 'Midnight',
    breed: 'Bombay',
    breedFolder: 'Bombay',
    ageGroup: 'Young',
    ageDetail: 'Young (2 years)',
    gender: 'Male',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (9-15 lbs)',
    coatLength: 'Short',
    color: 'Black',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats', 'Dogs'],
    daysOnPlatform: 3,
    shelterIndex: 3,
    story: 'Looking like a miniature parlor panther with gleaming copper eyes, Midnight loves curling around your shoulders like a furry scarf.',
    imageUrl: ''
  },
  // 27. Bombay - Onyx
  {
    name: 'Onyx',
    breed: 'Bombay',
    breedFolder: 'Bombay',
    ageGroup: 'Adult',
    ageDetail: 'Adult (4 years)',
    gender: 'Female',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (9-15 lbs)',
    coatLength: 'Short',
    color: 'Black',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats'],
    daysOnPlatform: 17,
    shelterIndex: 1,
    story: 'Onyx has a patent-leather sheen to her pitch-black coat. She is a total lovebug who will knead blankets for hours.',
    imageUrl: ''
  },
  // 28. Turkish Van - Marina
  {
    name: 'Marina',
    breed: 'Turkish Van',
    breedFolder: 'Turkish Van',
    ageGroup: 'Adult',
    ageDetail: 'Adult (3 years)',
    gender: 'Female',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (9-15 lbs)',
    coatLength: 'Medium',
    color: 'Bicolor',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Cats', 'Dogs'],
    daysOnPlatform: 10,
    shelterIndex: 8,
    story: 'Marina has auburn markings on her head and tail. Unlike most cats, she is fascinated by running water and will happily dip her paws into bath water.',
    imageUrl: ''
  },
  // 29. Devon Rex - Pixie
  {
    name: 'Pixie',
    breed: 'Devon Rex',
    breedFolder: 'Devon Rex',
    ageGroup: 'Young',
    ageDetail: 'Young (1 year)',
    gender: 'Female',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 8 lbs)',
    coatLength: 'Short',
    color: 'Cream',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats'],
    daysOnPlatform: 2,
    shelterIndex: 7,
    story: 'Pixie looks like a woodland fairy with her large ears and ripple-waved coat. She loves climbing up on shoulders to whisper in your ear.',
    imageUrl: ''
  },
  // 30. Singapore Community Cat - Kaya
  {
    name: 'Kaya',
    breed: 'Singapore Community Cat (Local Shorthair)',
    breedFolder: 'Singapore Community Cat',
    ageGroup: 'Young',
    ageDetail: 'Young (1.5 years)',
    gender: 'Female',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 8 lbs)',
    coatLength: 'Short',
    color: 'Spotted/Tabby',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats', 'Dogs'],
    daysOnPlatform: 1,
    shelterIndex: 3,
    story: 'Kaya was rescued from an HDB void deck and adapted seamlessly to indoor life. She is a sweet brown tabby who loves sitting on laps during zoom calls.',
    imageUrl: ''
  },
  // 31. Singapore Community Cat - Laksa
  {
    name: 'Laksa',
    breed: 'Singapore Community Cat (Local Shorthair)',
    breedFolder: 'Singapore Community Cat',
    ageGroup: 'Adult',
    ageDetail: 'Adult (3 years)',
    gender: 'Male',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (9-15 lbs)',
    coatLength: 'Short',
    color: 'Golden/Yellow',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats'],
    daysOnPlatform: 5,
    shelterIndex: 0,
    story: 'Laksa is a handsome ginger boy who lives up to the reputation of orange cats: 100% affection, 0% thoughts. He loves belly rubs and head-butts.',
    imageUrl: ''
  },
  // 32. Singapore Community Cat - Kopi-C
  {
    name: 'Kopi-C',
    breed: 'Singapore Community Cat (Local Shorthair)',
    breedFolder: 'Singapore Community Cat',
    ageGroup: 'Young',
    ageDetail: 'Young (1 year)',
    gender: 'Female',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 8 lbs)',
    coatLength: 'Short',
    color: 'Tricolor',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats'],
    daysOnPlatform: 3,
    shelterIndex: 10,
    story: 'Kopi-C is a gorgeous calico with patches of caramel, espresso, and steamed milk white. She is gentle, playful, and loves feather wands.',
    imageUrl: ''
  },
  // 33. Singapore Community Cat - Durian
  {
    name: 'Durian',
    breed: 'Singapore Community Cat (Local Shorthair)',
    breedFolder: 'Singapore Community Cat',
    ageGroup: 'Senior',
    ageDetail: 'Senior (9 years)',
    gender: 'Male',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (9-15 lbs)',
    coatLength: 'Short',
    color: 'Bicolor',
    houseTrained: 'Yes',
    specialNeeds: true,
    goodWith: ['Cats'],
    daysOnPlatform: 35,
    shelterIndex: 9,
    story: 'Durian is a sweet senior who lost one eye to an old street infection. He is completely healed, loves soft wet food, and enjoys peaceful chin scratches.',
    imageUrl: ''
  },
  // 34. Singapore Community Cat - Sambal
  {
    name: 'Sambal',
    breed: 'Singapore Community Cat (Local Shorthair)',
    breedFolder: 'Singapore Community Cat',
    ageGroup: 'Kitten',
    ageDetail: 'Kitten (4 months)',
    gender: 'Male',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 8 lbs)',
    coatLength: 'Short',
    color: 'Spotted/Tabby',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats', 'Dogs'],
    daysOnPlatform: 1,
    shelterIndex: 10,
    story: 'Sambal is a feisty little kitten full of spice and playfulness. He leaps after paper balls and tumbles into your lap when tired.',
    imageUrl: ''
  },
  // 35. British Shorthair - Churchill
  {
    name: 'Churchill',
    breed: 'British Shorthair',
    breedFolder: 'British Shorthair',
    ageGroup: 'Adult',
    ageDetail: 'Adult (4 years)',
    gender: 'Male',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (9-15 lbs)',
    coatLength: 'Short',
    color: 'Gray/Silver',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats'],
    daysOnPlatform: 11,
    shelterIndex: 3,
    story: 'Churchill is a stately silver-blue British Shorthair with chubby cheeks and a mellow personality. He loves reclining on velvet cushions like true royalty.',
    imageUrl: ''
  },
  // 36. Maine Coon - Simba
  {
    name: 'Simba',
    breed: 'Maine Coon',
    breedFolder: 'Maine Coon',
    ageGroup: 'Kitten',
    ageDetail: 'Kitten (6 months)',
    gender: 'Male',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (9-15 lbs)',
    coatLength: 'Long',
    color: 'Golden/Yellow',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats', 'Dogs'],
    daysOnPlatform: 2,
    shelterIndex: 8,
    story: 'Simba is a giant fluffy kitten destined to grow into a majestic lion. He is gentle, playful, and loves playing with ice cubes in his water fountain.',
    imageUrl: ''
  },
  // 37. Persian - Marshmallow
  {
    name: 'Marshmallow',
    breed: 'Persian',
    breedFolder: 'Persian',
    ageGroup: 'Young',
    ageDetail: 'Young (2 years)',
    gender: 'Female',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (9-15 lbs)',
    coatLength: 'Long',
    color: 'White',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Cats'],
    daysOnPlatform: 8,
    shelterIndex: 7,
    story: 'Marshmallow is a pure white cloud with soft copper eyes. She loves gentle brushing sessions and resting on sheepskin rugs.',
    imageUrl: ''
  },
  // 38. Siamese - Nala
  {
    name: 'Nala',
    breed: 'Siamese',
    breedFolder: 'Siamese',
    ageGroup: 'Kitten',
    ageDetail: 'Kitten (5 months)',
    gender: 'Female',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 8 lbs)',
    coatLength: 'Short',
    color: 'Cream',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats'],
    daysOnPlatform: 3,
    shelterIndex: 10,
    story: 'Nala is a curious kitten with chocolate tips and sparkling blue eyes. She loves investigating open drawers and curling around your neck.',
    imageUrl: ''
  },
  // 39. Ragdoll - Pearl
  {
    name: 'Pearl',
    breed: 'Ragdoll',
    breedFolder: 'Ragdoll',
    ageGroup: 'Adult',
    ageDetail: 'Adult (3.5 years)',
    gender: 'Female',
    sizeGroup: 'Large',
    sizeDetail: 'Large (15-25 lbs)',
    coatLength: 'Long',
    color: 'Bicolor',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats', 'Dogs'],
    daysOnPlatform: 7,
    shelterIndex: 0,
    story: 'Pearl has silky semi-longhair that resists matting and a sweet, serene temperament. She loves being cradled like an infant.',
    imageUrl: ''
  },
  // 40. Bengal - Hunter
  {
    name: 'Hunter',
    breed: 'Bengal',
    breedFolder: 'Bengal',
    ageGroup: 'Adult',
    ageDetail: 'Adult (3 years)',
    gender: 'Male',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (9-15 lbs)',
    coatLength: 'Short',
    color: 'Spotted/Tabby',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Dogs', 'Cats'],
    daysOnPlatform: 12,
    shelterIndex: 2,
    story: 'Hunter has incredible contrast in his leopard spots and love for high perches. He requires daily interactive playtime and loves puzzle feeders.',
    imageUrl: ''
  },
  // 41. Scottish Fold - Boba
  {
    name: 'Boba',
    breed: 'Scottish Fold',
    breedFolder: 'Scottish Fold',
    ageGroup: 'Adult',
    ageDetail: 'Adult (3 years)',
    gender: 'Male',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (9-15 lbs)',
    coatLength: 'Short',
    color: 'Gray/Silver',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats'],
    daysOnPlatform: 14,
    shelterIndex: 10,
    story: 'Boba has big round owl eyes and neatly folded ears. He is calm, quiet, and enjoys having his cheeks gently rubbed while purring.',
    imageUrl: ''
  },
  // 42. Russian Blue - Shadow
  {
    name: 'Shadow',
    breed: 'Russian Blue',
    breedFolder: 'Russian Blue',
    ageGroup: 'Senior',
    ageDetail: 'Senior (10 years)',
    gender: 'Male',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (9-15 lbs)',
    coatLength: 'Short',
    color: 'Gray/Silver',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Cats'],
    daysOnPlatform: 32,
    shelterIndex: 3,
    story: 'Shadow is a distinguished senior with glistening silver fur. He appreciates a serene routine, quiet reading rooms, and soft fleece throws.',
    imageUrl: ''
  },
  // 43. Abyssinian - Rusty
  {
    name: 'Rusty',
    breed: 'Abyssinian',
    breedFolder: 'Abyssinian',
    ageGroup: 'Young',
    ageDetail: 'Young (2 years)',
    gender: 'Male',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 8 lbs)',
    coatLength: 'Short',
    color: 'Brown/Chocolate',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Cats', 'Dogs'],
    daysOnPlatform: 6,
    shelterIndex: 1,
    story: 'Rusty is active, intelligent, and inquisitive. He loves climbing door frames and inspecting every corner of the house with joyful vigor.',
    imageUrl: ''
  },
  // 44. Birman - Lotus
  {
    name: 'Lotus',
    breed: 'Birman',
    breedFolder: 'Birman',
    ageGroup: 'Adult',
    ageDetail: 'Adult (4 years)',
    gender: 'Female',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (9-15 lbs)',
    coatLength: 'Long',
    color: 'Cream',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats'],
    daysOnPlatform: 16,
    shelterIndex: 8,
    story: 'Lotus has a creamy golden body with dark points and snowy white mittens. She has a gentle, sweet purr and adores resting next to you while you read.',
    imageUrl: ''
  },
  // 45. Foster cat: Pandan Cake
  {
    name: 'Pandan Cake',
    breed: 'British Shorthair',
    breedFolder: 'British Shorthair',
    ageGroup: 'Young',
    ageDetail: 'Young (1.5 years)',
    gender: 'Female',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (9-15 lbs)',
    coatLength: 'Short',
    color: 'Bicolor',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats'],
    daysOnPlatform: 5,
    shelterIndex: 12,
    story: 'Pandan Cake is currently fostered under our local companion foster network in Woodlands, Singapore. She is vaccinated, microchipped, and ready for a loving home.',
    imageUrl: ''
  },
  // 46. Sanctuary cat: Bintan
  {
    name: 'Bintan',
    breed: 'Singapore Community Cat (Local Shorthair)',
    breedFolder: 'Singapore Community Cat',
    ageGroup: 'Adult',
    ageDetail: 'Adult (3 years)',
    gender: 'Male',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (9-15 lbs)',
    coatLength: 'Short',
    color: 'Spotted/Tabby',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Cats'],
    daysOnPlatform: 18,
    shelterIndex: 13,
    story: 'Bintan is resting safely at our local animal sanctuary in Seletar, Singapore. He is gentle, calm, and has a sweet heart ready to find a forever home.',
    imageUrl: ''
  },
  // 47. Burmese - Toffee
  {
    name: 'Toffee',
    breed: 'Burmese',
    breedFolder: 'Burmese',
    ageGroup: 'Young',
    ageDetail: 'Young (2 years)',
    gender: 'Male',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (9-15 lbs)',
    coatLength: 'Short',
    color: 'Brown/Chocolate',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats', 'Dogs'],
    daysOnPlatform: 4,
    shelterIndex: 0,
    story: 'Toffee has a warm sable brown coat and brilliant yellow eyes. He is extremely people-oriented and will happily perch on your shoulders like a parrot.',
    imageUrl: ''
  },
  // 48. Chartreux - Nimbus
  {
    name: 'Nimbus',
    breed: 'Chartreux',
    breedFolder: 'Chartreux',
    ageGroup: 'Adult',
    ageDetail: 'Adult (4 years)',
    gender: 'Male',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (9-15 lbs)',
    coatLength: 'Short',
    color: 'Gray/Silver',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats'],
    daysOnPlatform: 19,
    shelterIndex: 10,
    story: 'Nimbus has a dense water-repellent slate-gray coat and a constant gentle "smile". He is quiet, observant, and loves sleeping at the foot of your bed.',
    imageUrl: ''
  },
  // 49. Turkish Angora - Alabaster
  {
    name: 'Alabaster',
    breed: 'Turkish Angora',
    breedFolder: 'Turkish Angora',
    ageGroup: 'Young',
    ageDetail: 'Young (2 years)',
    gender: 'Male',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 8 lbs)',
    coatLength: 'Long',
    color: 'White',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Cats'],
    daysOnPlatform: 8,
    shelterIndex: 3,
    story: 'Alabaster is an elegant dancer of a cat with odd-colored eyes (one blue, one green) and a shimmering plume tail. He loves high shelves and feather play.',
    imageUrl: ''
  },
  // 50. Singapore Community Cat - Teh Tarik
  {
    name: 'Teh Tarik',
    breed: 'Singapore Community Cat (Local Shorthair)',
    breedFolder: 'Singapore Community Cat',
    ageGroup: 'Adult',
    ageDetail: 'Adult (2.5 years)',
    gender: 'Female',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 8 lbs)',
    coatLength: 'Short',
    color: 'Tricolor',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats'],
    daysOnPlatform: 6,
    shelterIndex: 10,
    story: 'Teh Tarik is a beloved community cat rescue who purrs the moment she hears human footsteps. She is tidy, litter-trained, and loves cuddles.',
    imageUrl: ''
  },
  // 51. American Bobtail - Jax
  {
    name: 'Jax',
    breed: 'American Bobtail',
    breedFolder: 'American Bobtail',
    ageGroup: 'Adult',
    ageDetail: 'Adult (3 years)',
    gender: 'Male',
    sizeGroup: 'Large',
    sizeDetail: 'Large (15-25 lbs)',
    coatLength: 'Medium',
    color: 'Spotted/Tabby',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats', 'Dogs'],
    daysOnPlatform: 10,
    shelterIndex: 1,
    story: 'Jax has a distinctive natural bobbed tail and a warm dog-like personality. He will retrieve crinkle balls and greet guests with a friendly chirp.',
    imageUrl: ''
  },
  // 52. British Shorthair - Oliver
  {
    name: 'Oliver',
    breed: 'British Shorthair',
    breedFolder: 'British Shorthair',
    ageGroup: 'Puppy', // Kitten
    ageDetail: 'Kitten (5 months)',
    gender: 'Male',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 8 lbs)',
    coatLength: 'Short',
    color: 'Golden/Yellow',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats', 'Dogs'],
    daysOnPlatform: 1,
    shelterIndex: 3,
    story: 'Oliver is an irresistible golden-shaded British Shorthair kitten. He is curious, sweet, and loves curling up in your palms for midday naps.',
    imageUrl: ''
  },
  // 53. Maine Coon - Gandalf
  {
    name: 'Gandalf',
    breed: 'Maine Coon',
    breedFolder: 'Maine Coon',
    ageGroup: 'Senior',
    ageDetail: 'Senior (9 years)',
    gender: 'Male',
    sizeGroup: 'Large',
    sizeDetail: 'Large (15-25 lbs)',
    coatLength: 'Long',
    color: 'Gray/Silver',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats', 'Dogs'],
    daysOnPlatform: 30,
    shelterIndex: 0,
    story: 'Gandalf is a majestic silver smoke Maine Coon who looks like a wise feline wizard. He is calm, wise, and enjoys gentle brush strokes while purring loudly.',
    imageUrl: ''
  },
  // 54. Persian - Princess
  {
    name: 'Princess',
    breed: 'Persian',
    breedFolder: 'Persian',
    ageGroup: 'Young',
    ageDetail: 'Young (2 years)',
    gender: 'Female',
    sizeGroup: 'Medium',
    sizeDetail: 'Medium (9-15 lbs)',
    coatLength: 'Long',
    color: 'Cream',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Cats'],
    daysOnPlatform: 5,
    shelterIndex: 7,
    story: 'Princess has big doll-like copper eyes and an ultra-fluffy coat. She loves being pampered, brushed, and served healthy freeze-dried treats.',
    imageUrl: ''
  },
  // 55. Singapore Community Cat - Ondeh-Ondeh
  {
    name: 'Ondeh-Ondeh',
    breed: 'Singapore Community Cat (Local Shorthair)',
    breedFolder: 'Singapore Community Cat',
    ageGroup: 'Young',
    ageDetail: 'Young (1 year)',
    gender: 'Female',
    sizeGroup: 'Small',
    sizeDetail: 'Small (under 8 lbs)',
    coatLength: 'Short',
    color: 'White',
    houseTrained: 'Yes',
    specialNeeds: false,
    goodWith: ['Kids', 'Cats', 'Dogs'],
    daysOnPlatform: 2,
    shelterIndex: 10,
    story: 'Ondeh-Ondeh is a spotless white kitty with a playful tail. She loves chasing light beams and resting her chin on your wrist when you type.',
    imageUrl: ''
  }
];

// Main function to fetch breeds from API and download images
async function main() {
  console.log('Fetching breeds and images from TheDogAPI and TheCatAPI...');

  // Fetch Dog Breeds and Cat Breeds
  let dogBreedsMap = new Map();
  let catBreedsMap = new Map();

  try {
    const dogRes = await fetch('https://api.thedogapi.com/v1/breeds', { headers: { 'x-api-key': 'DEMO-API-KEY' } });
    const dogBreeds = await dogRes.json();
    if (Array.isArray(dogBreeds)) {
      for (const b of dogBreeds) {
        dogBreedsMap.set(b.name.toLowerCase(), b);
      }
    }
  } catch (e) {
    console.warn('Could not fetch dog breeds:', e.message);
  }

  try {
    const catRes = await fetch('https://api.thecatapi.com/v1/breeds', { headers: { 'x-api-key': 'DEMO-API-KEY' } });
    const catBreeds = await catRes.json();
    if (Array.isArray(catBreeds)) {
      for (const b of catBreeds) {
        catBreedsMap.set(b.name.toLowerCase(), b);
      }
    }
  } catch (e) {
    console.warn('Could not fetch cat breeds:', e.message);
  }

  // Pre-fetch general search batches as fallbacks
  let fallbackDogImages = [];
  try {
    const res = await fetch('https://api.thedogapi.com/v1/images/search?limit=60', { headers: { 'x-api-key': 'DEMO-API-KEY' } });
    const data = await res.json();
    if (Array.isArray(data)) fallbackDogImages = data.map(d => d.url).filter(u => !u.endsWith('.gif'));
  } catch (e) {}

  let fallbackCatImages = [];
  try {
    const res = await fetch('https://api.thecatapi.com/v1/images/search?limit=60', { headers: { 'x-api-key': 'DEMO-API-KEY' } });
    const data = await res.json();
    if (Array.isArray(data)) fallbackCatImages = data.map(d => d.url).filter(u => !u.endsWith('.gif'));
  } catch (e) {}

  console.log(`Fallback pools ready: ${fallbackDogImages.length} dogs, ${fallbackCatImages.length} cats`);

  // Build full pets list
  const fullPetRecords = [];

  // Helper for addition dates based on days on platform
  const now = Date.now();

  // Process Dogs
  console.log('Processing dogs...');
  for (let i = 0; i < dogDefinitions.length; i++) {
    const def = dogDefinitions[i];
    const shelter = SHELTERS[def.shelterIndex % SHELTERS.length];
    const breedFolderSanitized = sanitizeName(def.breedFolder);
    const petNameSanitized = sanitizeName(def.name);
    const fileName = `${petNameSanitized}.jpg`;
    const targetPath = path.join(DOGS_DIR, breedFolderSanitized, fileName);
    const relativeImagePath = `/src/assets/pets/dogs/${breedFolderSanitized}/${fileName}`;

    let imageUrl = def.imageUrl;

    // Check if breed has direct image from API
    if (!imageUrl) {
      const matched = dogBreedsMap.get(def.breedFolder.toLowerCase()) ||
                      dogBreedsMap.get(def.breed.toLowerCase());
      if (matched && matched.image && matched.image.url && !matched.image.url.endsWith('.gif')) {
        imageUrl = matched.image.url;
      }
    }

    // Try breed image search if breed has ID
    if (!imageUrl) {
      const matched = dogBreedsMap.get(def.breedFolder.toLowerCase());
      if (matched && matched.id) {
        try {
          const res = await fetch(`https://api.thedogapi.com/v1/images/search?breed_ids=${matched.id}&limit=1`, {
            headers: { 'x-api-key': 'DEMO-API-KEY' }
          });
          const data = await res.json();
          if (data && data[0] && data[0].url && !data[0].url.endsWith('.gif')) {
            imageUrl = data[0].url;
          }
        } catch (e) {}
      }
    }

    // Fallback to general pool or dog.ceo
    if (!imageUrl) {
      if (fallbackDogImages.length > 0) {
        imageUrl = fallbackDogImages.pop();
      } else {
        imageUrl = 'https://images.dog.ceo/breeds/retriever-golden/n02099601_100.jpg';
      }
    }

    console.log(`[Dog ${i + 1}/${dogDefinitions.length}] Downloading ${def.name} (${def.breedFolder})...`);
    await downloadImage(imageUrl, targetPath);

    const additionTime = new Date(now - def.daysOnPlatform * 86400000 + (i * 3600000)).toISOString();

    fullPetRecords.push({
      id: `dog-${i + 1}`,
      name: def.name,
      type: 'dog',
      breed: def.breed,
      breedFolder: breedFolderSanitized,
      image: relativeImagePath,
      shelter: shelter.name,
      currentLocation: shelter.location,
      distance: shelter.dist,
      isOutOfTown: shelter.outOfTown,
      ageGroup: def.ageGroup,
      ageDetail: def.ageDetail,
      gender: def.gender,
      sizeGroup: def.sizeGroup,
      sizeDetail: def.sizeDetail,
      coatLength: def.coatLength,
      color: def.color,
      houseTrained: def.houseTrained,
      specialNeeds: def.specialNeeds,
      goodWith: def.goodWith,
      daysOnPlatform: def.daysOnPlatform,
      additionDate: additionTime,
      story: def.story
    });
  }

  // Process Cats
  console.log('Processing cats...');
  for (let i = 0; i < catDefinitions.length; i++) {
    const def = catDefinitions[i];
    const shelter = SHELTERS[def.shelterIndex % SHELTERS.length];
    const breedFolderSanitized = sanitizeName(def.breedFolder);
    const petNameSanitized = sanitizeName(def.name);
    const fileName = `${petNameSanitized}.jpg`;
    const targetPath = path.join(CATS_DIR, breedFolderSanitized, fileName);
    const relativeImagePath = `/src/assets/pets/cats/${breedFolderSanitized}/${fileName}`;

    let imageUrl = def.imageUrl;

    if (!imageUrl) {
      const matched = catBreedsMap.get(def.breedFolder.toLowerCase()) ||
                      catBreedsMap.get(def.breed.toLowerCase());
      if (matched && matched.image && matched.image.url && !matched.image.url.endsWith('.gif')) {
        imageUrl = matched.image.url;
      }
    }

    if (!imageUrl) {
      const matched = catBreedsMap.get(def.breedFolder.toLowerCase());
      if (matched && matched.id) {
        try {
          const res = await fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${matched.id}&limit=1`, {
            headers: { 'x-api-key': 'DEMO-API-KEY' }
          });
          const data = await res.json();
          if (data && data[0] && data[0].url && !data[0].url.endsWith('.gif')) {
            imageUrl = data[0].url;
          }
        } catch (e) {}
      }
    }

    if (!imageUrl) {
      if (fallbackCatImages.length > 0) {
        imageUrl = fallbackCatImages.pop();
      } else {
        imageUrl = 'https://cdn2.thecatapi.com/images/KWdLHmOqc.jpg';
      }
    }

    console.log(`[Cat ${i + 1}/${catDefinitions.length}] Downloading ${def.name} (${def.breedFolder})...`);
    await downloadImage(imageUrl, targetPath);

    const additionTime = new Date(now - def.daysOnPlatform * 86400000 + (i * 3600000)).toISOString();

    fullPetRecords.push({
      id: `cat-${i + 1}`,
      name: def.name,
      type: 'cat',
      breed: def.breed,
      breedFolder: breedFolderSanitized,
      image: relativeImagePath,
      shelter: shelter.name,
      currentLocation: shelter.location,
      distance: shelter.dist,
      isOutOfTown: shelter.outOfTown,
      ageGroup: def.ageGroup,
      ageDetail: def.ageDetail,
      gender: def.gender,
      sizeGroup: def.sizeGroup,
      sizeDetail: def.sizeDetail,
      coatLength: def.coatLength,
      color: def.color,
      houseTrained: def.houseTrained,
      specialNeeds: def.specialNeeds,
      goodWith: def.goodWith,
      daysOnPlatform: def.daysOnPlatform,
      additionDate: additionTime,
      story: def.story
    });
  }

  // Generate src/data/petsData.js
  console.log(`Total generated records: ${fullPetRecords.length}`);
  const dataContent = `// Auto-generated Pets Catalog Data for Pet Heaven
// Images dynamically resolved via Vite import.meta.glob

const petImages = import.meta.glob('/src/assets/pets/**/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default'
});

export function getPetImageUrl(imagePath) {
  if (petImages[imagePath]) {
    return petImages[imagePath];
  }
  // Fallback to placeholder if not found
  return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 24 24" fill="%23eee"><circle cx="12" cy="12" r="10"/><text x="12" y="14" font-size="6" text-anchor="middle" fill="%23888">No Image</text></svg>';
}

export const SHELTERS_LIST = ${JSON.stringify(SHELTERS, null, 2)};

export const PETS_DATABASE = ${JSON.stringify(fullPetRecords, null, 2)};

export default PETS_DATABASE;
`;

  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, dataContent, 'utf-8');
  console.log(`Successfully written ${DATA_FILE}`);
}

main().catch(err => {
  console.error('Build script failed:', err);
  process.exit(1);
});
