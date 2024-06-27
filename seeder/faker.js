const { faker } = require("@faker-js/faker");

const generateRandomImage = () => {
  const images = [ faker.image.animals(), faker.image.people(), faker.image.nightlife(), faker.image.sports()];
  const randomIdx = Math.floor(Math.random() * images.length);
  return images[randomIdx]
}
const generateRandomUser = () => ({
  _id: faker.datatype.uuid(),
  _createdAt: faker.date.past().toISOString(),
  _updatedAt: faker.date.recent().toISOString(),
  username: faker.internet.userName(),
  bgThumbnail: faker.image.city(),
  avatar: faker.image.people(),
  countryOfOrigin: faker.address.country(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  dateOfBirth: faker.date.past(30, new Date(2000, 0, 1)).toISOString(),
  geoId: faker.address.zipCode(),
  maritalStatus: faker.helpers.arrayElement([
    "single",
    "married",
    "divorced",
    "widowed",
  ]),
  hobbies: faker.helpers.arrayElements(
    ["reading", "traveling", "sports", "cooking", "music", "technology", "joe biden"],
    3
  ),
  preferredMadhab: faker.helpers.arrayElement([
    "Hanafi",
    "Shafi'i",
    "Maliki",
    "Hanbali",
    "Salafi",
  ]),
  frequentMasjid: faker.company.name(),
  favoriteQuranReciters: faker.helpers.arrayElements(
    [faker.name.fullName(), faker.name.fullName(), faker.name.fullName()],
    2
  ),
  favoriteIslamicScholars: faker.helpers.arrayElements(
    [faker.name.fullName(), faker.name.fullName(), faker.name.fullName()],
    2
  ),
  islamicStudyTopics: faker.helpers.arrayElements(
    ["Fiqh", "Aqidah", "Tafsir", "Hadith"],
    2
  )
});

const generateRandomTweet = (username, profileImg) => ({
  _id: faker.datatype.uuid(),
  _createdAt: faker.date.past().toISOString(),
  _updatedAt: faker.date.recent().toISOString(),
  _rev: faker.datatype.uuid(),
  _type: "tweet",
  blockTweet: faker.datatype.boolean(),
  text: faker.lorem.sentence(100),
  username: username,
  profileImg: profileImg,
  image: generateRandomImage(),
});

const generateRandomComment = (tweetId, username, profileImg) => ({
    tweetId: tweetId,
    comments: [
      {
        username: username,
        _id: faker.datatype.uuid(),
        _createdAt: faker.date.past().toISOString(),
        _updatedAt: faker.date.recent().toISOString(),
        text: faker.lorem.sentence(25),
        profileImg: profileImg,
      },
      // {
      //   "username": "user2",
      //   "_id": "comment2",
      //   "_createdAt": "2024-06-10T12:05:00Z",
      //   "_updatedAt": "2024-06-10T12:05:00Z",
      //   "text": "This is the second comment!",
      //   "profileImg": "http://example.com/user2.jpg"
      // },
      // {
      //   "username": "user3",
      //   "_id": "comment3",
      //   "_createdAt": "2024-06-10T12:10:00Z",
      //   "_updatedAt": "2024-06-10T12:10:00Z",
      //   "text": "This is the third comment!",
      //   "profileImg": "http://example.com/user3.jpg"
      // }
    ]  
})

module.exports = { generateRandomComment, generateRandomUser, generateRandomTweet };
