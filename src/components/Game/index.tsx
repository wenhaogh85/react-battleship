import Border from "../Border";
import PlayerBoard from "../Board/PlayerBoard";
import WithHeader from "../WithHeader";
import Wrapper from "../Wrapper";
import ComputerBoard from "../Board/computerBoard";
import Dashboard from "../Dashboard";

const Game: React.FC = () => {
  return (
    <WithHeader width="large">
      <Wrapper>
        <PlayerBoard />
        <Border />
        <ComputerBoard />
      </Wrapper>
      <Dashboard />
    </WithHeader>
  );
};

export default Game;
