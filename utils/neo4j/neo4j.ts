import { Node, Session, auth, driver } from "neo4j-driver";
import { TweetToDisplay } from "typings";

export function defineDriver() {
  const connectionURI = process.env.NEXT_PUBLIC_NEO4J_CONNECTION_URI!;
  const connectionUser = process.env.NEXT_PUBLIC_NEO4J_CONNECTION_USER!;
  const connectionPwd = process.env.NEXT_PUBLIC_NEO4J_CONNECTION_PWD!;
  const dr = driver(connectionURI, auth.basic(connectionUser, connectionPwd));
  return dr;
}

export async function read(session: Session, cypher = "", params = {}, alias?: string | string[] | undefined) {
  try {
    // Execute cypher statement
    const { records } = await session.run(cypher, params);
    return records.map((record) => {
      if(Array.isArray(alias)) {
        var result: {[key: string]: any[] } = {};

        for(const aIdx in alias) {
           const aKey = alias[aIdx];
           const recordBasedOnAlias = record.get(aKey);

           if(typeof recordBasedOnAlias === 'object')
            result[aKey] = recordBasedOnAlias && Array.isArray(recordBasedOnAlias) && recordBasedOnAlias.length ? recordBasedOnAlias.map((r: Node) => r.properties) : recordBasedOnAlias.properties ?? [];
          else
            result[aKey] = recordBasedOnAlias;
        }

        return result;
      }
      return record.get(alias ?? "u").properties
    });
  } catch (error) {
    console.log("ERror:", error);
  } finally {
    console.log("Successfully Read Data");
    // await session.close();
  }
}

export async function write(session: Session, cypher = "", params = {}) {
  try {
    await session.run(cypher, params);
  } catch (error) {
    console.log("ERROR:", error);
  } finally {
    console.log("Successfully Write Data");
  }
}
