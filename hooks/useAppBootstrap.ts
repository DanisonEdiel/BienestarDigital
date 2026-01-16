import { useAuth, useUser } from '@clerk/clerk-expo';
import { useEffect, useState } from 'react';
import { useBootstrapMutation } from './auth/useBootstrapMutation';

export function useAppBootstrap() {
  const { userId, isSignedIn } = useAuth();
  const { user } = useUser();
  const bootstrapMutation = useBootstrapMutation();
  const [isBootstrapped, setIsBootstrapped] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      if (isSignedIn && userId && !isBootstrapped) {
        try {
          // console.log('Global bootstrapping for user:', userId);
          await bootstrapMutation.mutateAsync({
            clerkId: userId,
            email: user?.primaryEmailAddress?.emailAddress,
            role: 'parent'
          });
          setIsBootstrapped(true);
        } catch (error) {
          // If error is "User already exists", we consider it bootstrapped
          // console.error('Global bootstrap error:', error);
          // For now, assume success or eventual consistency
          setIsBootstrapped(true); 
        }
      }
    };
    bootstrap();
  }, [isSignedIn, userId, isBootstrapped, user]);

  return isBootstrapped;
}
