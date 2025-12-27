import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
    issuer: 'https://auth.sutthiporn.dev/realms/portal.sutthiporn',
    redirectUri: window.location.origin,
    clientId: 'raijai.client.id',
    responseType: 'code',
    scope: 'openid profile email',
    showDebugInformation: true,
    silentRefreshRedirectUri: window.location.origin + '/assets/silent-refresh.html',
};
