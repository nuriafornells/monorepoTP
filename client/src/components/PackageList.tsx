// src/components/PackageList.tsx
import { useTravel } from "../hooks/useTravel";

const PackageList = () => {
  const { packages } = useTravel();
  const publishedPackages = packages.filter(pkg => pkg.published);

  return (
    <div>
      <h2>Paquetes disponibles</h2>
      {publishedPackages.map(pkg => (
        <div key={pkg.id}>
          <h3>{pkg.title}</h3>
          <p>{pkg.description}</p>
          <p>Precio: ${pkg.priceUSD}</p>
          <img src={pkg.imageUrl} alt={pkg.title} width={200} />
        </div>
      ))}
    </div>
  );
};

export default PackageList;