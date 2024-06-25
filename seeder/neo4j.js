const { auth, driver } = require("neo4j-driver");

const defineDriver = () => {
  const connectionURI = process.env.NEO4J_CONNECTION_URI;
  const connectionUser = process.env.NEO4J_CONNECTION_USER;
  const connectionPwd = process.env.NEO4J_CONNECTION_PWD;
  console.log(connectionURI, connectionUser, connectionPwd);
  const dr = driver(
    connectionURI,
    auth.basic(
      connectionUser,
      connectionPwd
    )
  );
  return dr;
}

async function seed(users, tweets, comments) {
  
  //Open the session
  const mainDriver = defineDriver();
  const session = mainDriver.session();
  try {
    const canSeedRecords = await read(session, 'MATCH (u:User) RETURN u LIMIT 1', {});
    if (!canSeedRecords.length) {
      for (let i = 0; i < users.length; i++) {
        var user = users[i];
        var tweetsQueue = tweets
          .slice()
          .filter((t) => t.username === user.username);

          await write(
            session,
            `
            CREATE (u:User {
              _id: $_id,
              _createdAt: $_createdAt,
              _updatedAt: $_updatedAt,
              username: $username,
              countryOfOrigin: $countryOfOrigin,
              email: $email,
              phone: $phone,
              dateOfBirth: $dateOfBirth,
              geoId: $geoId,
              maritalStatus: $maritalStatus,
              hobbies: $hobbies,
              preferredMadhab: $preferredMadhab,
              frequentMasjid: $frequentMasjid,
              favoriteQuranReciters: $favoriteQuranReciters,
              favoriteIslamicScholars: $favoriteIslamicScholars,
              islamicStudyTopics: $islamicStudyTopics
            })`,
            {...user} // Pass the flattened properties as parameters
          );
        while (tweetsQueue.length) {
          // console.log("tweetsQueue.length:", tweetsQueue.length);
          var currTweet = tweetsQueue.pop();
          console.log("currentTweet:", currTweet);
          await write(
            session,
            `MATCH (u:User {username: $username})
                     CREATE (u)-[:POSTED]->(t:Tweet {
                       _id: $_id,
                       _createdAt: $_createdAt,
                       _updatedAt: $_updatedAt,
                       _rev: $_rev,
                       _type: $_type,
                       blockTweet: $blockTweet,
                       text: $text,
                       username: $username,
                       profileImg: $profileImg,
                       image: $image
                     })`,
            {
              _id: currTweet?._id,
              _createdAt: currTweet?._createdAt,
              _updatedAt: currTweet?._updatedAt,
              _rev: currTweet?._rev,
              _type: currTweet?._type,
              blockTweet: currTweet?.blockTweet,
              text: currTweet?.text,
              username: currTweet?.username,
              profileImg: currTweet?.profileImg,
              image: currTweet?.image,
            }
          );

          const currTweetCommentsQueue = comments.slice().filter(c => c.tweetId === currTweet?._id);
          while(currTweetCommentsQueue.length) {
              await write(
                session,
                `MATCH (u:User {username: $username})
                        CREATE (u)-[:POSTED]->(t:Tweet {
                          _id: $_id,
                          _createdAt: $_createdAt,
                          _updatedAt: $_updatedAt,
                          _rev: $_rev,
                          _type: $_type,
                          blockTweet: $blockTweet,
                          text: $text,
                          username: $username,
                          profileImg: $profileImg,
                          image: $image
                        })`,
                {
                  _id: currTweet?._id,
                  _createdAt: currTweet?._createdAt,
                  _updatedAt: currTweet?._updatedAt,
                  _rev: currTweet?._rev,
                  _type: currTweet?._type,
                  blockTweet: currTweet?.blockTweet,
                  text: currTweet?.text,
                  username: currTweet?.username,
                  profileImg: currTweet?.profileImg,
                  image: currTweet?.image,
                }
              );
          }
        }
        console.log("Seeded Data Successfully.");

      }
    }
  } catch (error) {
    console.error("Error checking if you can seed user data:", error);
    throw error;
  } finally {
    await session.close();
  }
}


async function read(session, cypher = "", params = {}) {
  try {
    // Execute cypher statement
    const { records } = await session.run(cypher, params);
    return records.map(record => record.get('u').properties);
  } catch(error) {
    console.log("ERror:", error);
  } finally {
    console.log("Successfully Read Data");
    // await session.close();
  }
}

async function write(session, cypher = "", params = {}) {
  try {
    await session.run(cypher, params);
  } catch(error){
    console.log("ERROR:", error);
  } finally {
    console.log("Successfully Write Data");
  }
}

module.exports = { write, read, seed };