import { NextResponse } from 'next/server';

const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.wellnessz.fitno&hl=en_IN';
const APP_STORE_URL = 'https://apps.apple.com/bz/app/fitno-d/id6775784318';

const IOS_REGEX = /iPhone|iPad|iPod/i;
const ANDROID_REGEX = /Android/i;

export function proxy(request: Request) {
  const { pathname } = new URL(request.url);
  if (!pathname.startsWith('/app')) {
    return NextResponse.next();
  }

  const userAgent = request.headers.get('user-agent') || '';

  if (IOS_REGEX.test(userAgent)) {
    return NextResponse.redirect(APP_STORE_URL, 302);
  }

  if (ANDROID_REGEX.test(userAgent)) {
    return NextResponse.redirect(PLAY_STORE_URL, 302);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*'],
};
