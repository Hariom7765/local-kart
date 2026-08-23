'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function OnboardingCheck() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if profile was already completed locally
    try {
      if (typeof window !== 'undefined' && localStorage.getItem('local_kart_profile_complete') === 'true') {
        return;
      }
    } catch (_) {}

    // Only check if authenticated and not already on the onboarding page
    if (status === 'authenticated' && session?.user && pathname !== '/onboarding') {
      const user = session.user as any;

      // Admins bypass customer/shopkeeper onboarding
      if (user.role === 'admin') return;

      // Check if profile is incomplete
      if (user.isProfileComplete === false) {
        fetch('/api/user/profile')
          .then((res) => res.json())
          .then((data) => {
            if (data && data.isProfileComplete === false) {
              // Check again before pushing
              if (localStorage.getItem('local_kart_profile_complete') !== 'true') {
                router.push('/onboarding');
              }
            }
          })
          .catch((err) => {
            console.error('Error verifying profile completion:', err);
          });
      }
    }
  }, [session, status, pathname, router]);

  return null;
}
