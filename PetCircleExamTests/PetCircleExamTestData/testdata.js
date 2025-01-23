module.exports = {
  // Function to generate a random pet name and corresponding ID
  generateRandomPetData: () => {
    const petNames = [
      "Buddy",
      "Charlie",
      "Max",
      "Bella",
      "Rocky",
      "Daisy",
      "Milo",
      "Luna",
      "Coco",
      "Bailey",
    ];

    // Pick a random index
    const randomIndex = Math.floor(Math.random() * petNames.length);
    const petName = petNames[randomIndex];
    const petId = randomIndex + 1; // ID starts from 1 and corresponds to the name's position

    return { name: petName, id: petId };
  },

  // Function to generate a random category (dog or cat)
  generateRandomCategory: () => {
    const categories = ["dog", "cat"];
    const randomIndex = Math.floor(Math.random() * categories.length);
    return categories[randomIndex];
  },

  // Function to generate a random status
  generateRandomStatus: () => {
    const statuses = ["available", "sold", "pending"];
    const randomIndex = Math.floor(Math.random() * statuses.length);
    return statuses[randomIndex];
  },

  // Function to generate appropriate tags based on the pet category
  generateRandomTags: (category) => {
    const dogTags = ["poodle", "labrador", "chihuahua", "lhasa apso"];
    const dogTags2 = ["Small", "Medium", "Large"];
    const catTags = ["siamese", "burmese", "maine coon", "sphynx"];
    const catTags2 = ["Small", "Medium", "Large"];
  
    if (category === "dog") {
      return [
        dogTags[Math.floor(Math.random() * dogTags.length)],
        dogTags2[Math.floor(Math.random() * dogTags2.length)],
      ];
    } else if (category === "cat") {
      return [
        catTags[Math.floor(Math.random() * catTags.length)],
        catTags2[Math.floor(Math.random() * catTags2.length)],
      ];
    }
    return ["Unknown", "Unknown"];
  },

  // POST Requests Test Data
  addpet: null, // This will be dynamically assigned later
  sampledata: {
    "id": 150,
    "category": {
      "id": 10,
      "name": "cat"
    },
    "name": "kitty",
    "photoUrls": [
      "string"
    ],
    "tags": [
      {
        "id": 1,
        "name": "small"
      },
      {
        "id": 2,
        "name": "2 KG"
      }
    ],
    "status": "available"
  },

  sampledata2: {
    "id": 151,
    "category": {
      "id": 11,
      "name": "dog"
    },
    "name": "doggy",
    "photoUrls": [
      "string"
    ],
    "tags": [
      {
        "id": 3,
        "name": "big"
      },
      {
        "id": 4,
        "name": "15 KG"
      }
    ],
    "status": "available"
  },

  // Base URL for tests
  baseurl: "https://petstore.swagger.io/v2",
};

// Dynamically generate pet object
const data = module.exports;
const randomPetData = data.generateRandomPetData();
const randomCategory = data.generateRandomCategory();
const randomStatus = data.generateRandomStatus();
const randomTags = data.generateRandomTags(randomCategory);

// Create the dynamic pet object
data.addpet = {
  id: randomPetData.id,
  category: {
    id: Math.floor(Math.random() * 100),
    name: randomCategory,
  },
  name: randomPetData.name,
  photoUrls: ["string"],
  tags: [
    { id: Math.floor(Math.random() * 1000), name: randomTags[0] },
    { id: Math.floor(Math.random() * 1000), name: randomTags[1] }
  ],
  status: randomStatus,
};