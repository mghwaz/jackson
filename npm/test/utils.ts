import loadConnection from '../src/loadConnection';
import type { JacksonOption } from '../src/typings';

const connectionRecords: Array<any> = [];

const addSSOConnections = async (
  metadataPath,
  connectionAPIController,
  idpEnabledConnectionAPIController?
) => {
  const connections = await loadConnection(metadataPath);
  for (const connection of connections) {
    const _record = await ('oidcDiscoveryUrl' in connection
      ? connectionAPIController.createOIDCConnection(connection)
      : connectionAPIController.createSAMLConnection(connection));
    !('oidcDiscoveryUrl' in connection) &&
      idpEnabledConnectionAPIController &&
      (await idpEnabledConnectionAPIController.createSAMLConnection(connection));
    connectionRecords.push(_record);
  }
  return connectionRecords;
};

const jacksonOptions = <JacksonOption>{
  externalUrl: 'https://my-cool-app.com',
  samlAudience: 'https://saml.boxyhq.com',
  samlPath: '/sso/oauth/saml',
  oidcPath: '/sso/oauth/oidc',
  db: {
    engine: 'mem',
  },
  clientSecretVerifier: 'TOP-SECRET',
  openid: {
    jwtSigningKeys: { private: 'PRIVATE_KEY', public: 'PUBLIC_KEY' },
    jwsAlg: 'RS256',
  },
  boxyhqLicenseKey: 'dummy-license',
  noAnalytics: true,
};

export { addSSOConnections, jacksonOptions };
