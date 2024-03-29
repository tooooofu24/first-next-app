import { FirebaseApp, FirebaseError, getApps, initializeApp } from 'firebase/app';
import type { Auth as FirebaseAuth } from 'firebase/auth';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

/**
 * @description Firebaseの管理画面から取得したAPIオブジェクト
 * @note 環境変数は`.env.local`ファイルに定義しています
 */
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/**
 * @description FirebaseAppを返す
 */
export const getFirebaseApp = (): FirebaseApp | undefined => {
  if (typeof window === 'undefined') return; // バックエンドで実行されないようにする

  return getApps()[0] || initializeApp(firebaseConfig);
};

/**
 * @description FirebaseAuthを返す
 */
export const getFirebaseAuth = (): FirebaseAuth => {
  return getAuth(getFirebaseApp());
};

/**
 * @description メールアドレスとパスワードでログイン
 */
export const login = async (email: string, password: string): Promise<void> => {
  // FirebaseAuthを取得する
  const auth = getFirebaseAuth();

  try {
    // メールアドレスとパスワードでログインする
    const result = await signInWithEmailAndPassword(auth, email, password);
    // セッションIDを作成するためのIDを作成する
    const id = await result.user.getIdToken();
    // Cookieにセッションを付与するようにAPIを投げる
    await fetch('/api/session', { method: 'POST', body: JSON.stringify({ id }) });
  } catch (e) {
    if (e instanceof FirebaseError) {
      // 認証エラー
      throw new Error('メールアドレスかパスワードが違います。');
    } else {
      // その他エラー
      throw new Error('不明なエラーです。開発者にお問合せください。');
    }
  }
};

/**
 * @description ログアウトさせる
 */
export const logout = async (): Promise<void> => {
  // セッションCookieを削除するため、Firebase SDKでなくREST APIでログアウトさせる
  await fetch('/api/sessionLogout', { method: 'POST' });
};
