import { Auth, signInWithEmailAndPassword } from 'firebase/auth';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { toast } from 'sonner';
import { FirebaseError } from 'firebase/app';

export async function loginWithEmail({
  auth,
  email,
  password,
  searchParams,
  router,
}: {
  auth: Auth;
  email: string;
  password: string;
  searchParams: URLSearchParams;
  router: AppRouterInstance;
}): Promise<void> {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    toast.success('Logged in successfully!');
    const redirectUrl = searchParams.get('redirect') || '/admin';
    router.push(redirectUrl);
  } catch (error) {
    console.error('Login error:', error);
    let errorMessage = 'Failed to login. Please check your credentials.';
    if (
      error instanceof FirebaseError &&
      (error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-credential')
    ) {
      errorMessage = 'Invalid email or password.';
    }
    toast.error(errorMessage);
    throw error;
  }
}
