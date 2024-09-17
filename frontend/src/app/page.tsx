'use client'

import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get(`http://localhost:8000/health_check`).then((response) => {
      setData(response.data.data);
    });
  });

  return (
    <div className="items-center justify-items-center p-8">
      { data && (
        <div>
          <h2 className="text-2xl font-bold">FastAPI Health Check Response LOL</h2>
          <br />
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
