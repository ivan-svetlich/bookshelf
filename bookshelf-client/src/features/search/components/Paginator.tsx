import Button from "react-bootstrap/Button";
import Book from "../../../types/book";
import { QueryArgs } from "../api/googleBooks";

interface PraginatorProps {
  args: QueryArgs;
  handleChange: React.Dispatch<React.SetStateAction<QueryArgs>>;
  data: Book[];
}

const Paginator = ({ args, handleChange, data }: PraginatorProps) => {
  const handleNext = () => {
    handleChange({ ...args, startIndex: args.startIndex + 20 });
  };

  const handlePrevious = () => {
    if (args.startIndex >= 20) {
      handleChange({ ...args, startIndex: args.startIndex - 20 });
    } else {
      handleChange({ ...args, startIndex: 0 });
    }
  };
  return (
    <div className="content-is-centered">
      <div>Page {Math.floor(args.startIndex / 20) + 1}</div>
      <Button
        variant="outline-dark"
        onClick={handlePrevious}
        className="paginator-btn"
        disabled={args.startIndex < 20 ? true : false}
      >
        <i className="fas fa-arrow-left" /> Prev
      </Button>
      <Button
        variant="outline-dark"
        onClick={handleNext}
        className="paginator-btn"
        disabled={data && data.length >= 20 ? false : true}
      >
        Next <i className="fas fa-arrow-right" />
      </Button>
    </div>
  );
};

export default Paginator;
