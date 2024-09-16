'use client'

import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get(`${process.env.FASTAPI_BASE_URL}/health_check`).then((response) => {
      console.log(response);
      setData(response.data.data);
      console.log(response.data);
    });
  });

  return (
    <div className="items-center justify-items-center p-8 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
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
