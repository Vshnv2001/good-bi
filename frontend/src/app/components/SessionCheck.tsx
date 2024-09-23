import React, { useEffect, useState } from 'react';
import Session from 'supertokens-web-js/recipe/session';
import { doesSessionExist } from '../../lib/utils';

const SessionCheck: React.FC = ({ children }) => {
  const [sessionExists, setSessionExists] = useState<boolean | null>(null);

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
    return <div>Session does not exist. Please log in.</div>;
  }

  return <>{children}</>;
};

export default SessionCheck;