import React, { lazy, useState } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  MarkerF,
  useJsApiLoader,
} from "@react-google-maps/api";
import { CgSpinnerTwoAlt } from "react-icons/cg";
const Header = lazy(() => import("../Components/Common/Header"));
const Footer = lazy(() => import("../Components/Common/Footer"));
const FindVehicles = lazy(() => import("../Components/Common/FindVehicles"));

// colombo location
const center = { lat: 6.927, lng: 80.001 };
// initialize google
const google = window.google;
// google map libraries
const libs = ["places"];

const Search = () => {
  // load map api
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
    libraries: libs,
  });

  const [directions, setDirections] = useState(null);
  const [durations, setDurations] = useState("");
  const [distance, setDistance] = useState("");
  const [routeDetails, setRouteDetails] = useState({});

  // return loading spinner while google map loading
  if (!isLoaded)
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <CgSpinnerTwoAlt className="h-20 w-20 animate-spin text-emerald-400" />
        <h1 className="mt-8 font-Poppins text-2xl font-medium italic">
          Map is loading..
        </h1>
      </div>
    );

  // find vehicle with form submission
  const findVehicles = (formData) => {
    if (formData["booking-type"] === "Book Now")
      calculateRoute(formData["pick-up"], formData["destination"]);
  };

  // canclutate route
  const calculateRoute = async (origin, destination) => {
    if (origin === "" || destination === "") return;
    const directionService = new google.maps.DirectionsService();
    const result = await directionService.route({
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
    });

    setDirections(result);
    setDistance(result.routes[0].legs[0].distance.text);
    setDurations(result.routes[0].legs[0].duration.text);
    const start_ = result.routes[0].legs[0].start_location
      .toUrlValue()
      .split(",");
    const end_ = result.routes[0].legs[0].end_location.toUrlValue().split(",");
    setRouteDetails({
      start: {
        lat: parseFloat(start_[0]),
        lng: parseFloat(start_[1]),
      },
      end: {
        lat: parseFloat(end_[0]),
        lng: parseFloat(end_[1]),
      },
    });
  };

  return (
    <React.Fragment>
      <div className="flex min-h-screen w-screen flex-col items-center justify-between bg-slate-200 dark:bg-slate-900">
        {/* header */}
        <Header />
        {/* container */}
        <div className="flex w-full flex-col-reverse py-10 xl:flex-row">
          {/* search and results */}
          <div className="flex w-full flex-col items-center justify-center xl:w-1/2">
            <FindVehicles isEmbed={true} findVehicles={findVehicles} />
          </div>
          <div className="h-[50vh] w-full px-5 xl:h-auto xl:w-1/2">
            {/* map */}
            <GoogleMap
              center={center}
              zoom={11}
              mapContainerClassName="w-full h-full"
              options={{
                fullscreenControl: false,
                mapTypeControl: false,
                streetViewControl: false,
              }}
            >
              {directions && (
                <>
                  <MarkerF
                    position={routeDetails.start}
                    label={{ text: "O", color: "white" }}
                  />
                  <MarkerF
                    position={routeDetails.end}
                    label={{ text: "D", color: "white" }}
                  />
                </>
              )}
              {directions && (
                <div className="absolute start-2 top-2 max-w-[12rem] space-y-1 rounded-md bg-white p-2 px-4 font-Poppins text-sm font-semibold dark:bg-slate-800">
                  <p className="">Distance : {distance}</p>
                  <p className="">Time : {durations}</p>
                </div>
              )}
              {directions && (
                <DirectionsRenderer
                  directions={directions}
                  options={{
                    markerOptions: {
                      visible: false,
                    },
                  }}
                />
              )}
            </GoogleMap>
          </div>
        </div>
        {/* footer */}
        <Footer />
      </div>
    </React.Fragment>
  );
};

export default Search;
