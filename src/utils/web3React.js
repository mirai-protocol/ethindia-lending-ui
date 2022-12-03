// import { ConnectorNames } from "cryption-uikit-v2";
import getConnectors from './web3Connectors';

const connectors = getConnectors();

export const connectorsByName = {
  injected: connectors.injected,
  // [ConnectorNames.WalletConnect]: connectors.walletConnectConnector,
  // [ConnectorNames.GoogleTorusConnector]: connectors.torusGoogleConnector,
  // [ConnectorNames.FacebookTorusConnector]: connectors.torusFacebookConnector,
  // [ConnectorNames.TwitterTorusConnector]: connectors.torusTwitterConnector,
  // [ConnectorNames.RedditTorusConnector]: connectors.torusRedditConnector,
  // [ConnectorNames.DiscordTorusConnector]: connectors.torusDiscordConnector,
  // [ConnectorNames.EmailTorusConnector]: connectors.torusEmailConnector,
};

export const getLibrary = (provider) => provider;
