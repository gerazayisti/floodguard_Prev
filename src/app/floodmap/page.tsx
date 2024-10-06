import dynamic from "next/dynamic";

// Importer le composant de manière dynamique avec rendu uniquement côté client
const MapPage = dynamic(() => import("@/components/mapComponent"), { ssr: false });

export default function Floodmap() {
  return (
    <div className="App">
      <MapPage />
    </div>
  );
}