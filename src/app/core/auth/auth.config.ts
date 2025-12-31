import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
    issuer: 'https://auth.sutthiporn.dev/realms/portal.sutthiporn',
    redirectUri: window.location.origin,
    clientId: 'raijai.client.id',
    responseType: 'code',
    scope: 'openid profile email',
    showDebugInformation: true,
    silentRefreshRedirectUri: window.location.origin + '/assets/silent-refresh.html',
    postLogoutRedirectUri: window.location.origin,
    useSilentRefresh: false, // อันเดิมที่เราปิดไป
    // เพิ่มบรรทัดนี้: เปิดการเช็คสถานะ Session
    sessionChecksEnabled: false,
};
