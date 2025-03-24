
import { Link } from "react-router-dom";
import { NavigationBar } from "@/components/NavigationBar";
import HomePage from "./HomePage";

const IndexPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <HomePage />
    </div>
  );
};

export default IndexPage;
