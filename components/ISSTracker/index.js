import { useEffect, useState } from "react";
import Controls from "../Controls/index";
import Map from "../Map/index";
import useSWR from "swr";

const URL = "https://api.wheretheiss.at/v1/satellites/25544";

const fetcher = async (url) => {
  const res = await fetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    // Attach extra info to the error object.
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export default function ISSTracker() {
  /*  const [coords, setCoords] = useState({
    longitude: 0,
    latitude: 0,
  }); */

  /*   async function getISSCoords() {
    try {
      const response = await fetch(URL);
      if (response.ok) {
        const data = await response.json();
        setCoords({ longitude: data.longitude, latitude: data.latitude });
      }
    } catch (error) {
      console.error(error);
    }
  } */

  /* useEffect(() => {
    const timer = setInterval(() => {
      getISSCoords();
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, []); */
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    URL,
    fetcher,
    { refreshIntervall: 5000 }
  );

  console.log(data);

  /* if (isLoading) {
    return <div>Loading...</div>;
  } */
  if (error) {
    return <div>An error occurred fetching data: {error.info.error}</div>;
  }

  return (
    <main>
      <Map longitude={data?.longitude ?? 0} latitude={data?.latitude ?? 0} />
      <Controls
        longitude={data?.longitude ?? 0}
        latitude={data?.latitude ?? 0}
        onRefresh={() => {
          mutate();
        }}
      />
    </main>
  );
}
