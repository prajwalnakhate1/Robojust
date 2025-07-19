import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix leaflet's default icon issue in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const LocationMarker = ({ latLng, setLatLng }) => {
  useMapEvents({
    click(e) {
      setLatLng(e.latlng);
    },
  });

  return latLng ? <Marker position={latLng}></Marker> : null;
};

const LocationPickerMap = ({ latLng, setLatLng }) => {
  return (
    <MapContainer
      center={latLng || [20.5937, 78.9629]} // Default center: India
      zoom={5}
      scrollWheelZoom={true}
      style={{ height: "400px", width: "100%", borderRadius: "0.5rem" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker latLng={latLng} setLatLng={setLatLng} />
    </MapContainer>
  );
};

export default LocationPickerMap;
