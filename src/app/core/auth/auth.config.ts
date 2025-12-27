import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
    issuer: 'https://auth.sutthiporn.dev/realms/portal.sutthiporn',
    redirectUri: window.location.origin + '/callback',
    clientId: 'raijai.client.id',
    responseType: 'code',
    scope: 'openid profile email offline_access',
    showDebugInformation: true,
    // silentRefreshRedirectUri: window.location.origin + '/assets/silent-refresh.html',
    useSilentRefresh: false
};
