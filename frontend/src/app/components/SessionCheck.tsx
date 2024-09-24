import React, { useEffect, useState } from 'react';
import Session from 'supertokens-web-js/recipe/session';
import { doesSessionExist } from '@/lib/utils';
import {useRouter} from "next/navigation";

const SessionCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionExists, setSessionExists] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const exists = await doesSessionExist();
      setSessionExists(exists);
    };
    checkSession();
  }, []);

  if (sessionExists === null) {
    return <div>Loading...</div>; // or a loading spinner
  }

  if (!sessionExists) {
    router.push("/login");
  }

  return <>{children}</>;
};

export default SessionCheck;