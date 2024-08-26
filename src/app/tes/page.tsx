import { Input } from "@/components/ui/input";
import SearchIcon from "../../../public/icons/SearchIcon";

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Welcome to My Page</h1>
      <div className="mt-4">
        <Input
          type="text"
          placeholder="Enter your text"
          leftIcon={<span>🔍</span>} // Contoh ikon kiri
          rightIcon={<SearchIcon />} // Contoh ikon kanan
        />
      </div>
    </div>
  );
};

export default HomePage;
