const COGNITO_DOMAIN = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID!;
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI!;
const LOGOUT_URI = process.env.NEXT_PUBLIC_LOGOUT_URI!;

// Cognito 로그인 URL
export const COGNITO_LOGIN_URL = `${COGNITO_DOMAIN}/login?client_id=${CLIENT_ID}&response_type=code&scope=email+openid&redirect_uri=${REDIRECT_URI}`;

// Cognito 로그아웃 URL
export const COGNITO_LOGOUT_URL = `${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${LOGOUT_URI}`;
