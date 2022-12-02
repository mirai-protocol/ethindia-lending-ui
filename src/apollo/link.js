import { HttpLink, from, split } from "@apollo/client";
import { RetryLink } from "@apollo/client/link/retry";

export const funlink = () => {
  const protocolstats = from([
    new RetryLink(),
    new HttpLink({
      uri: 'https://api.thegraph.com/subgraphs/name/cryption-network/mirai-protocol',
      // shouldBatch: true,
    }),
  ]);
  const links = split(
    (operation) => operation.getContext().clientName === "mirai",
    protocolstats,
  )
  return links;
}