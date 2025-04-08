import ComposePost from "./components/ComposePost";
import Posts from "./components/Posts";
import Tournaments from "./components/Tournaments";
import YourGames from "./components/YourGames";

const Homepage = () => {
  return (
    <div className="flex flex-col gap-6 pt-4">
      <YourGames />
      <ComposePost />
      <Posts />
      <Tournaments />
    </div>
  );
};

export default Homepage;
