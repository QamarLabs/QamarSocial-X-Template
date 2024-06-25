import { Session, auth, driver } from "neo4j-driver";

export function defineDriver() {
  const connectionURI = process.env.NEXT_PUBLIC_NEO4J_CONNECTION_URI!;
  const connectionUser = process.env.NEXT_PUBLIC_NEO4J_CONNECTION_USER!;
  const connectionPwd = process.env.NEXT_PUBLIC_NEO4J_CONNECTION_PWD!;
  const dr = driver(connectionURI, auth.basic(connectionUser, connectionPwd));
  return dr;
}

export async function read(session: Session, cypher = "", params = {}, alias?: string | undefined) {
  try {
    // Execute cypher statement
    const { records } = await session.run(cypher, params);
    return records.map((record) => record.get(alias ?? "u").properties);
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
